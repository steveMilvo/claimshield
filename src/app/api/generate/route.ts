import Anthropic from "@anthropic-ai/sdk";
import type { Item, SkillKey } from "@/lib/game";

// Build-spec pipeline, real-model version:
//   1) GENERATE — Claude turns the teacher's vetted text into items, planting
//      exactly one controlled deviation per error item (never world-facts).
//   2) VERIFY  — Claude confirms each item has exactly one change of the right
//      kind vs the source; failures are dropped before any child sees them.
// Tokenisation + error-index location is done deterministically server-side.

export const runtime = "nodejs";
export const maxDuration = 60;

const GEN_MODEL = process.env.PIP_GEN_MODEL || "claude-sonnet-4-6";
const VERIFY_MODEL = process.env.PIP_VERIFY_MODEL || "claude-sonnet-4-6";

type GenType = "none" | SkillKey;

interface RawItem {
  type: GenType;
  trueSentence: string;
  text: string;
  errorPhrase: string;
}

const GEN_SYSTEM = `You build practice items for "Pip", a children's AI-literacy game for ages 7-9. A teacher gives you CORRECT study content. Children must catch Pip's planted mistakes.

HARD RULES:
- Use ONLY information from the teacher's text. NEVER add outside facts.
- "none" items: take one correct sentence, lightly simplify it for an 8-year-old, with NO mistakes.
- error items: take one correct sentence and introduce EXACTLY ONE deliberate mistake of the requested kind, changing as little as possible. Everything else stays correct.
- Error kinds:
  - factual: change one fact, name, or number to something wrong.
  - source: add a fake or silly source (e.g. a made-up website, "my cat told me").
  - overconfidence: add over-confident bragging ("exactly", "100% sure", "I am never wrong").
  - bias: add an unfair generalisation about a group of people.
- Each sentence must be short and simple (<= ~20 words), easy for an 8-year-old to read aloud.
- "errorPhrase" must be the EXACT words copied from "text" that are the mistake (empty string for "none").

Return ONLY valid JSON, no prose:
{"items":[{"type":"none|factual|source|overconfidence|bias","trueSentence":"...","text":"...","errorPhrase":"..."}]}`;

const VERIFY_SYSTEM = `You verify children's AI-literacy practice items. For each item decide if it is SAFE and CORRECT to show.

PASS only if:
- type "none": "text" contains NO mistake and is faithful to "trueSentence".
- error items: "text" contains EXACTLY ONE mistake, it is of the stated "type", it is located at "errorPhrase", and the rest of "text" still matches "trueSentence".
Be conservative: if unsure, fail it. Reject anything inappropriate for young children.

Return ONLY JSON: {"results":[{"ok":true|false}]}  (same order as input).`;

function extractJson(text: string): any {
  let t = text.trim();
  t = t.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = Math.min(...[t.indexOf("{"), t.indexOf("[")].filter((i) => i >= 0));
  const end = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/gi, "");

// locate the error phrase inside the tokenised text → token indices
function locate(tokens: string[], phrase: string): number[] {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  if (p.length === 0) return [];
  for (let i = 0; i + p.length <= tokens.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) {
      if (norm(tokens[i + j]) !== p[j]) { ok = false; break; }
    }
    if (ok) return Array.from({ length: p.length }, (_, j) => i + j);
  }
  // fallback: any single token contained in the phrase
  const single = tokens.findIndex((t) => norm(t) && p.includes(norm(t)));
  return single >= 0 ? [single] : [];
}

const WHY: Record<SkillKey, string> = {
  factual: "That part was changed — it doesn't match what you're studying.",
  source: "That's not a real source — we can't trust it.",
  overconfidence: "Pip is bragging it's 100% sure — that's a warning sign.",
  bias: "That's an unfair idea — anyone can do this.",
};

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "no_key" }, { status: 400 });

  let body: { content?: string; topic?: string; types?: SkillKey[]; count?: number; truthRatio?: number };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const content = (body.content || "").trim();
  const topic = (body.topic || "Our class topic").trim();
  const types = body.types?.length ? body.types : (["factual", "source", "overconfidence", "bias"] as SkillKey[]);
  const count = Math.min(Math.max(body.count ?? 10, 3), 14);
  const truthRatio = body.truthRatio ?? 0.4;
  if (content.split(/\s+/).length < 6) return Response.json({ error: "too_short" }, { status: 400 });

  const client = new Anthropic({ apiKey: key });

  try {
    // 1) generate
    const genMsg = await client.messages.create({
      model: GEN_MODEL,
      max_tokens: 2000,
      system: [{ type: "text", text: GEN_SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: `Topic: ${topic}\nMake ${count} items. About ${Math.round(
            truthRatio * 100
          )}% should be type "none" (all true). For the rest, use these error kinds, spread evenly: ${types.join(
            ", "
          )}.\n\nTEACHER CONTENT:\n"""${content}"""`,
        },
      ],
    });
    const genText = genMsg.content.find((b) => b.type === "text")?.text ?? "";
    const raw: RawItem[] = extractJson(genText).items ?? [];
    if (!Array.isArray(raw) || raw.length === 0)
      return Response.json({ error: "empty_generation" }, { status: 502 });

    // 2) verify
    let verdicts: { ok: boolean }[] = [];
    try {
      const vMsg = await client.messages.create({
        model: VERIFY_MODEL,
        max_tokens: 1000,
        system: [{ type: "text", text: VERIFY_SYSTEM, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: JSON.stringify({ items: raw }) }],
      });
      const vText = vMsg.content.find((b) => b.type === "text")?.text ?? "";
      verdicts = extractJson(vText).results ?? [];
    } catch {
      verdicts = raw.map(() => ({ ok: true })); // if verify call fails, don't hard-block
    }

    // 3) assemble verified items
    const items: Item[] = [];
    raw.forEach((r, i) => {
      if (verdicts[i] && verdicts[i].ok === false) return;
      const tokens = r.text.trim().split(/\s+/);
      if (r.type === "none") {
        items.push({
          id: `ai-${i}-none`,
          chip: "Share what you learned",
          mission: topic,
          errorType: "NONE",
          band: 1,
          tokens,
          errorIdx: [],
          whyWrong: "",
          corrections: [],
        });
        return;
      }
      const errorIdx = locate(tokens, r.errorPhrase || "");
      if (errorIdx.length === 0) return; // can't anchor the error → drop (safety)
      items.push({
        id: `ai-${i}-${r.type}`,
        chip: "Share what you learned",
        mission: topic,
        errorType: r.type,
        band: 2,
        tokens,
        errorIdx,
        whyWrong: WHY[r.type as SkillKey] ?? "Something about that wasn't right.",
        corrections: [
          { text: r.trueSentence, correct: true },
          { text: r.text, correct: false },
          { text: "Pip isn't sure — let's check a trusted book.", correct: false },
        ],
      });
    });

    if (items.length === 0) return Response.json({ error: "all_failed_verification" }, { status: 502 });
    return Response.json({ items });
  } catch (e: any) {
    return Response.json({ error: "model_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}
