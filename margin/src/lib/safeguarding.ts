import type { SafeguardCategory, SafeguardSeverity, SafeguardSignal } from "./types";
import { getClient, model, extractJson, hasLLM } from "./anthropic";
import { z } from "zod";

/**
 * Safeguarding triage for student writing.
 *
 * A writing tool receives disclosures of harm — self-harm, abuse, neglect,
 * threats. This module's ONLY job is to detect and route them to a trusted
 * adult. It must never advise, counsel, or address the student about the
 * disclosure. The Designated Safeguarding Lead (a human) always decides what
 * happens next; this is a safety net, not a diagnosis.
 *
 * Two layers:
 *   1. Deterministic rules (always on, no key) — high-recall keyword/pattern
 *      net so the floor of protection never depends on an external service.
 *   2. Optional LLM triage (when ANTHROPIC_API_KEY is set) — adds nuance and
 *      reduces false positives. Classifies ONLY; never generates a reply.
 *
 * The combined result takes the HIGHER severity of the two layers (fail-safe).
 */

interface Rule {
  category: SafeguardCategory;
  severity: SafeguardSeverity;
  re: RegExp;
}

// Deliberately conservative, reviewable patterns. Real deployments should
// expand/tune these with a safeguarding lead and log review outcomes.
const RULES: Rule[] = [
  // Self-harm / suicidal ideation — treated as urgent.
  { category: "self_harm", severity: "urgent", re: /\b(kill myself|end my life|want to die|don'?t want to (be alive|live)|take my own life|suicid)/i },
  { category: "self_harm", severity: "urgent", re: /\b(cut(ting)? myself|hurt myself|harm myself|self[- ]?harm)\b/i },
  { category: "self_harm", severity: "concern", re: /\b(no (point|reason) (in|to) (living|going on)|everyone( would)? be better off without me|hate being alive)\b/i },
  // Abuse — urgent.
  { category: "abuse", severity: "urgent", re: /\b(hits? me|beats? me|hurts? me at home|touch(ed|es) me|made me touch|abus(e|ed|ing) me)\b/i },
  { category: "abuse", severity: "concern", re: /\b(scared (to go|of going) home|scared of (my )?(dad|mum|mom|stepdad|stepmum|parents))\b/i },
  // Neglect.
  { category: "neglect", severity: "concern", re: /\b(no(thing| food) to eat at home|haven'?t eaten (in|for)|no one looks after me|left alone for days)\b/i },
  // Violence / threats.
  { category: "violence", severity: "urgent", re: /\b(going to (kill|hurt|shoot|stab)|bring a (knife|gun|weapon) to school|make them pay)\b/i },
  // Bullying.
  { category: "bullying", severity: "concern", re: /\b(bullied|they pick on me|everyone hates me|no friends and|being threatened)\b/i },
  // Substance.
  { category: "substance", severity: "concern", re: /\b(getting drunk every|using (drugs|ice|meth)|can'?t stop drinking)\b/i },
  // Eating disorder.
  { category: "eating_disorder", severity: "concern", re: /\b(starv(e|ing) myself|make myself (sick|throw up)|haven'?t eaten so i|too fat to eat)\b/i },
  // Generalised distress.
  { category: "distress", severity: "monitor", re: /\b(so (depressed|hopeless)|can'?t cope|crying every (night|day)|feel so alone)\b/i },
];

const SEV_RANK: Record<SafeguardSeverity, number> = { none: 0, monitor: 1, concern: 2, urgent: 3 };

function sentenceAround(text: string, index: number): string {
  const start = Math.max(0, text.lastIndexOf(".", index) + 1, text.lastIndexOf("\n", index) + 1);
  let end = text.length;
  for (const p of [".", "!", "?", "\n"]) {
    const i = text.indexOf(p, index);
    if (i !== -1 && i < end) end = i + 1;
  }
  return text.slice(start, end).trim().slice(0, 200);
}

export function rulesDetect(text: string): SafeguardSignal {
  let best: { rule: Rule; span: string } | null = null;
  for (const rule of RULES) {
    const m = rule.re.exec(text);
    if (!m) continue;
    if (!best || SEV_RANK[rule.severity] > SEV_RANK[best.rule.severity]) {
      best = { rule, span: sentenceAround(text, m.index) };
    }
  }
  if (!best) {
    return { flagged: false, category: null, severity: "none", rationale: "No safeguarding patterns matched.", engine: "rules" };
  }
  return {
    flagged: true,
    category: best.rule.category,
    severity: best.rule.severity,
    rationale: `Rule match (${best.rule.category}).`,
    span: best.span,
    engine: "rules",
  };
}

const LLMResult = z.object({
  flagged: z.boolean(),
  category: z.string().nullable(),
  severity: z.enum(["none", "monitor", "concern", "urgent"]),
  rationale: z.string(),
  span: z.string().optional(),
});

const TRIAGE_SYSTEM = `You are a safeguarding TRIAGE CLASSIFIER for a school writing tool used by 11-14 year olds. Your only job is to flag whether a piece of writing may contain a real disclosure of harm to the student, and how urgent it is, so a human safeguarding lead can review it.

STRICT RULES:
- You CLASSIFY ONLY. Never write advice, comfort, or any message addressed to the student.
- Distinguish fiction/assigned-narrative content from genuine first-person disclosure. A scary story is usually NOT a disclosure; weigh first-person, present-tense, specific statements more heavily.
- severity: "urgent" = active self-harm/suicidal intent, current abuse, credible threat of violence. "concern" = worrying but not immediately dangerous. "monitor" = mild distress. "none" = nothing.
- category in: self_harm, abuse, neglect, violence, bullying, substance, eating_disorder, distress, other, or null.
- Output STRICT JSON only: {"flagged":bool,"category":string|null,"severity":"none|monitor|concern|urgent","rationale":"for the adult reviewer","span":"the triggering passage"}`;

export async function llmTriage(text: string): Promise<SafeguardSignal | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const res = await client.messages.create({
      model: model(),
      max_tokens: 400,
      system: TRIAGE_SYSTEM,
      messages: [{ role: "user", content: `STUDENT TEXT:\n"""\n${text}\n"""` }],
    });
    const out = res.content.map((c) => (c.type === "text" ? c.text : "")).join("");
    const parsed = LLMResult.parse(extractJson(out));
    return {
      flagged: parsed.flagged,
      category: (parsed.category as SafeguardCategory) ?? null,
      severity: parsed.severity,
      rationale: parsed.rationale,
      span: parsed.span,
      engine: "llm",
    };
  } catch (e) {
    console.error("llmTriage failed:", e);
    return null;
  }
}

/** Combined triage. Takes the higher severity of rules and LLM (fail-safe). */
export async function evaluateSafeguarding(text: string): Promise<SafeguardSignal> {
  const rules = rulesDetect(text);
  if (!hasLLM()) return rules;

  const llm = await llmTriage(text);
  if (!llm) return rules;

  const higher = SEV_RANK[llm.severity] >= SEV_RANK[rules.severity] ? llm : rules;
  return {
    flagged: higher.severity !== "none",
    category: higher.category,
    severity: higher.severity,
    rationale: `${rules.rationale} | LLM: ${llm.rationale}`,
    span: higher.span ?? rules.span ?? llm.span,
    engine: "rules+llm",
  };
}

/** Region-appropriate crisis resources shown to a student on an urgent flag. */
export function crisisResources() {
  return {
    message:
      "It sounds like you might be carrying something really heavy right now. You're not in trouble, and you don't have to deal with it alone — a teacher you trust has been let know so a real person can check in with you.",
    lines: [
      { region: "AU", name: "Kids Helpline", contact: "1800 55 1800", note: "free, 24/7, ages 5–25" },
      { region: "AU", name: "Lifeline", contact: "13 11 14", note: "24/7 crisis support" },
      { region: "NZ", name: "Youthline", contact: "0800 376 633 / text 234", note: "free, 24/7" },
      { region: "NZ", name: "Need to talk?", contact: "call or text 1737", note: "free, 24/7" },
      { region: "AU/NZ", name: "Emergency", contact: "000 (AU) / 111 (NZ)", note: "if someone is in danger now" },
    ],
  };
}
