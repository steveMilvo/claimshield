import { z } from "zod";
import type { Diagnosis, TextType, TraitId, TraitScore } from "./types";
import { TRAIT_MAP, masteryBand, traitsFor } from "./rubric";
import { TAXONOMY, misconceptionsFor } from "./taxonomy";
import { getClient, model, extractJson, hasLLM } from "./anthropic";

/* ----------------------------- LLM scorer ----------------------------- */

const ScoreItem = z.object({
  trait: z.string(),
  band: z.number(),
  confidence: z.number().min(0).max(1),
  tags: z.array(z.string()).default([]),
  note: z.string(),
  evidence: z.array(z.string()).default([]),
});
const ScoreResponse = z.object({ scores: z.array(ScoreItem) });

function rubricSpec(textType: TextType): string {
  return traitsFor(textType)
    .map(
      (t) =>
        `- ${t.id} ("${t.label}", band 0..${t.max}, mastery≥${masteryBand(
          t.id
        )}): ${t.blurb}`
    )
    .join("\n");
}

function taxonomySpec(textType: TextType): string {
  const ids = new Set(traitsFor(textType).map((t) => t.id));
  return TAXONOMY.filter((m) => ids.has(m.trait))
    .map((m) => `- ${m.id} (${m.trait}): ${m.label}`)
    .join("\n");
}

const SYSTEM = `You are an experienced NAPLAN writing marker. You assess a middle-school student's writing on an analytic rubric, ONE trait at a time. You are calibrated, fair, and evidence-bound.

Hard rules:
- Judge ONLY what is on the page. Never reward intentions.
- Every judgement must quote a verbatim span from the student's text in "evidence".
- Never rewrite the student's work or invent facts. Notes describe the gap; they do not fix it.
- Use ONLY misconception tag ids from the provided taxonomy. If none apply, return [].
- "confidence" reflects how sure a human marker would be; lower it for very short or ambiguous pieces.
- Output STRICT JSON only.`;

export async function llmScore(
  text: string,
  textType: TextType
): Promise<TraitScore[]> {
  const anthropic = getClient();
  if (!anthropic) throw new Error("No LLM configured");

  const user = `Text type: ${textType}

RUBRIC (score each trait, integer band within range):
${rubricSpec(textType)}

MISCONCEPTION TAXONOMY (use these ids only):
${taxonomySpec(textType)}

STUDENT TEXT:
"""
${text}
"""

Return JSON: { "scores": [ { "trait", "band", "confidence", "tags":[], "note", "evidence":[] } ] }. Include every rubric trait exactly once.`;

  const res = await anthropic.messages.create({
    model: model(),
    max_tokens: 2000,
    system: SYSTEM,
    messages: [{ role: "user", content: user }],
  });
  const textOut = res.content
    .map((c) => (c.type === "text" ? c.text : ""))
    .join("");
  const parsed = ScoreResponse.parse(extractJson(textOut));

  const valid = new Set(traitsFor(textType).map((t) => t.id as string));
  return parsed.scores
    .filter((s) => valid.has(s.trait))
    .map((s) => clampScore(s as TraitScore));
}

function clampScore(s: TraitScore): TraitScore {
  const def = TRAIT_MAP[s.trait];
  const max = def?.max ?? 5;
  return {
    ...s,
    band: Math.max(0, Math.min(max, Math.round(s.band))),
    confidence: Math.max(0, Math.min(1, s.confidence)),
    tags: (s.tags || []).filter((t) => TAXONOMY.some((m) => m.id === t)),
    evidence: s.evidence || [],
  };
}

/* --------------------------- Heuristic mock --------------------------- */
/* A deterministic, explainable scorer so the full UX works with no API key.
   It is NOT the product's scorer — the real one is the calibrated LLM judge —
   but it is good enough to drive a believable diagnose→practise→revise loop. */

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstSpan(text: string, re: RegExp): string[] {
  const m = text.match(re);
  return m ? [m[0].trim().slice(0, 120)] : [];
}

export function mockScore(text: string, textType: TextType): TraitScore[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  const sents = sentences(text);
  const paras = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const lower = text.toLowerCase();

  const connectives = ["however", "because", "therefore", "as a result", "for example", "although", "firstly", "secondly", "finally", "in conclusion"];
  const connectiveCount = connectives.filter((c) => lower.includes(c)).length;
  const hasEvidenceLink = /(this shows|this proves|which means|this is because)/i.test(text);
  const commaSplice = /\b\w+, [a-z]+ \w+ \w+,/.test(text) && /,[^.?!]*\b(it|they|this|he|she|we|i)\b/i.test(text);
  const repeated = (() => {
    const counts: Record<string, number> = {};
    for (const w of words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ""))) {
      if (w.length > 3) counts[w] = (counts[w] ?? 0) + 1;
    }
    return Object.values(counts).filter((n) => n >= 4).length;
  })();
  const rhetorical = /\?/.test(text);
  const tellWords = /(was scared|was happy|was sad|was angry|felt scared|felt happy)/i.test(text);

  const lenScale = Math.min(1, wc / 220); // shorter pieces score lower & less confidently
  const baseConf = Math.max(0.45, Math.min(0.9, 0.5 + lenScale * 0.4));

  const mk = (
    trait: TraitId,
    band: number,
    note: string,
    tags: string[],
    evidence: string[]
  ): TraitScore => {
    const max = TRAIT_MAP[trait].max;
    return {
      trait,
      band: Math.max(0, Math.min(max, Math.round(band))),
      confidence: baseConf,
      tags,
      note,
      evidence,
    };
  };

  const scores: TraitScore[] = [];

  scores.push(
    mk(
      "ideas",
      2 + lenScale * 2 + (hasEvidenceLink ? 1 : 0),
      hasEvidenceLink
        ? "Ideas are developed and connected to your purpose."
        : "Points are made but several aren't elaborated with a reason or example.",
      hasEvidenceLink ? [] : ["ideas.unelaborated"],
      firstSpan(text, /[^.?!]*\b(should|think|believe|important)\b[^.?!]*[.?!]/i)
    )
  );

  scores.push(
    mk(
      "cohesion",
      1 + connectiveCount * 0.6 + (hasEvidenceLink ? 1 : 0),
      hasEvidenceLink
        ? "Evidence is linked back to your claims."
        : "Evidence appears but isn't yet linked back to the claim it supports.",
      hasEvidenceLink
        ? connectiveCount < 2
          ? ["cohesion.missing_connectives"]
          : []
        : ["cohesion.evidence_unlinked"],
      firstSpan(text, /[^.?!]*\b(study|research|example|fact|shows?)\b[^.?!]*[.?!]/i)
    )
  );

  scores.push(
    mk(
      "text_structure",
      1 + Math.min(2, paras.length) + lenScale,
      paras.length >= 3
        ? "A clear beginning, middle and end."
        : "The shape (beginning–middle–end) isn't fully developed yet.",
      paras.length < 2 ? ["structure.weak_opening"] : [],
      []
    )
  );

  scores.push(
    mk(
      "paragraphing",
      paras.length >= 3 ? 2 : paras.length >= 2 ? 1 : 0,
      paras.length < 2
        ? "Ideas are grouped into one block rather than paragraphs."
        : "Paragraphs group related ideas.",
      paras.length < 2 ? ["paragraphing.run_on"] : [],
      []
    )
  );

  scores.push(
    mk(
      "vocabulary",
      2 + lenScale * 2 - (repeated > 1 ? 1 : 0),
      repeated > 1
        ? "A few words repeat often and could be more precise."
        : "Word choices are varied and mostly precise.",
      repeated > 1 ? ["vocab.repetitive"] : [],
      []
    )
  );

  scores.push(
    mk(
      "sentence_structure",
      commaSplice ? 2 : 3 + lenScale * 2,
      commaSplice
        ? "Some sentences are joined with only a comma (comma splices)."
        : "Sentences are controlled with some variety.",
      commaSplice ? ["sentence.comma_splice"] : [],
      firstSpan(text, /[^.?!]*,[^.?!]*\b(it|they|this|he|she|we)\b[^.?!]*[.?!]/i)
    )
  );

  scores.push(mk("audience", 2 + lenScale * 2, "Some awareness of a reader.", lenScale < 0.5 ? ["audience.flat"] : [], []));
  scores.push(mk("punctuation", 3 + lenScale, "Punctuation mostly supports meaning.", [], []));
  scores.push(mk("spelling", 4 + lenScale, "Most words spelled correctly.", [], []));

  if (textType === "persuasive") {
    scores.push(
      mk(
        "persuasive_devices",
        (rhetorical ? 1 : 0) + 1 + lenScale,
        rhetorical
          ? "Some persuasive techniques are present."
          : "Few deliberate persuasive techniques yet.",
        rhetorical ? [] : ["devices.absent"],
        firstSpan(text, /[^.?!]*\?[^.?!]*/)
      )
    );
  } else {
    scores.push(
      mk(
        "character_setting",
        (tellWords ? 1 : 2) + lenScale,
        tellWords
          ? "Emotions are told ('was scared') more than shown."
          : "Character and setting are beginning to come through.",
        tellWords ? ["character.tell_not_show"] : [],
        firstSpan(text, /[^.?!]*\b(was|felt) (scared|happy|sad|angry)[^.?!]*[.?!]/i)
      )
    );
  }

  return scores;
}

/* ------------------------- Public entry point ------------------------- */

export async function scoreWriting(
  text: string,
  textType: TextType
): Promise<{ scores: TraitScore[]; engine: "llm" | "mock" }> {
  if (hasLLM()) {
    try {
      const scores = await llmScore(text, textType);
      if (scores.length > 0) return { scores, engine: "llm" };
    } catch (e) {
      // Fall through to mock so the loop never hard-fails on a transient error.
      console.error("llmScore failed, falling back to mock:", e);
    }
  }
  return { scores: mockScore(text, textType), engine: "mock" };
}

/** Assemble a full Diagnosis: scores + ZPD focus + confidence gate. */
export function buildDiagnosis(
  scores: TraitScore[],
  focus: { trait: TraitId; tag: string },
  wordCount: number
): Diagnosis {
  const overall =
    scores.reduce((a, s) => a + s.confidence, 0) / Math.max(1, scores.length);
  return {
    scores,
    focusTrait: focus.trait,
    focusTag: focus.tag,
    overallConfidence: Number(overall.toFixed(2)),
    wordCount,
  };
}

export { misconceptionsFor };
