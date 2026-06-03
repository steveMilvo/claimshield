import { z } from "zod";
import type { PracticeLadder, PracticeRung, TraitId } from "./types";
import { TRAIT_MAP } from "./rubric";
import { TAXONOMY_MAP } from "./taxonomy";
import { getClient, model, extractJson, hasLLM } from "./anthropic";

/**
 * Generates a faded-worked-example ladder for one misconception:
 *   worked example (see the move) -> faded (complete the move) -> independent.
 * This is the deliberate-practice core: isolate one move, model it, fade the
 * scaffold, then demand independent execution. Grounded in the student's own
 * topic so the practice transfers straight back into their draft.
 */

const RungSchema = z.object({
  kind: z.enum(["worked_example", "faded", "independent"]),
  title: z.string(),
  prompt: z.string(),
  exemplar: z.string().optional(),
  stem: z.string().optional(),
  modelAnswer: z.string().optional(),
});
const LadderSchema = z.object({
  microLesson: z.string(),
  rungs: z.array(RungSchema).min(2),
});

const SYSTEM = `You are an expert writing teacher building a short, faded worked-example practice for ONE specific writing move for a middle-school student. You follow the worked-example effect: model the move fully, then fade the scaffold, then ask for independent execution. Keep language warm, concrete, and age-appropriate (ages 11-14). Output STRICT JSON only. Never do the student's whole assignment for them; practice is on a single isolated move.`;

export async function llmLadder(
  trait: TraitId,
  tag: string,
  studentTopic: string
): Promise<PracticeLadder> {
  const anthropic = getClient();
  if (!anthropic) throw new Error("No LLM configured");
  const def = TRAIT_MAP[trait];
  const m = TAXONOMY_MAP[tag];

  const user = `Trait: ${def.label} — ${def.blurb}
Misconception to fix: ${m?.label ?? tag}
The move that fixes it: ${m?.theMove ?? ""}
Student's writing topic (ground examples in this): "${studentTopic}"

Build JSON:
{
  "microLesson": "2-3 sentences naming the move and why it matters",
  "rungs": [
    {"kind":"worked_example","title":"...","prompt":"...","exemplar":"a complete, annotated example of the move"},
    {"kind":"faded","title":"...","prompt":"...","stem":"text with a clear gap for the student to complete","modelAnswer":"a strong completion"},
    {"kind":"independent","title":"...","prompt":"now you do it on your own writing","modelAnswer":"an example of success for feedback"}
  ]
}`;

  const res = await anthropic.messages.create({
    model: model(),
    max_tokens: 1400,
    system: SYSTEM,
    messages: [{ role: "user", content: user }],
  });
  const out = res.content.map((c) => (c.type === "text" ? c.text : "")).join("");
  const parsed = LadderSchema.parse(extractJson(out));
  return { trait, tag, microLesson: parsed.microLesson, rungs: parsed.rungs as PracticeRung[] };
}

/* ----------------------------- Mock ladders ----------------------------- */
/* Hand-authored faded ladders per misconception so the loop is fully usable
   offline. These double as few-shot seeds for the LLM generator later. */

function ladder(
  trait: TraitId,
  tag: string,
  microLesson: string,
  rungs: PracticeRung[]
): PracticeLadder {
  return { trait, tag, microLesson, rungs };
}

const MOCK_LADDERS: Record<string, (topic: string) => PracticeLadder> = {
  "cohesion.evidence_unlinked": (topic) =>
    ladder(
      "cohesion",
      "cohesion.evidence_unlinked",
      "Evidence doesn't speak for itself. After every fact or example, add a 'link' sentence that says how it proves your point. Claim → Evidence → Link.",
      [
        {
          kind: "worked_example",
          title: "Watch the move",
          prompt: "Notice the third sentence — it links the evidence back to the claim.",
          exemplar:
            "Phones can support learning. A 2022 study found students who used dictionary apps learned 15% more vocabulary. [LINK →] This shows that phones, used well, can directly improve results — which is exactly why they belong in class.",
        },
        {
          kind: "faded",
          title: "Finish the link",
          prompt: "The claim and evidence are here. Write the LINK sentence that connects them.",
          stem:
            "School libraries should stay open at lunch. Last term, the days the library was open had 40 more students inside than days it was shut. ____",
          modelAnswer:
            "This shows students genuinely want a quiet space to read and work — so keeping it open directly meets a need they're already showing.",
        },
        {
          kind: "independent",
          title: "Now on your own writing",
          prompt: `Find one piece of evidence in your ${topic ? `'${topic}' ` : ""}draft and add a link sentence after it (start with "This shows…" or "This means…").`,
          modelAnswer: "Each piece of evidence is followed by a sentence linking it to the claim.",
        },
      ]
    ),
  "sentence.comma_splice": (topic) =>
    ladder(
      "sentence_structure",
      "sentence.comma_splice",
      "A comma can't join two complete sentences on its own. Fix a splice three ways: full stop, connective (and/but/so), or semicolon.",
      [
        {
          kind: "worked_example",
          title: "Spot the fix",
          prompt: "The splice on the left becomes three correct options on the right.",
          exemplar:
            "✗ It was late, we kept walking.\n✓ It was late. We kept walking.\n✓ It was late, so we kept walking.\n✓ It was late; we kept walking.",
        },
        {
          kind: "faded",
          title: "Repair it",
          prompt: "Rewrite this so it is no longer a comma splice.",
          stem: "The rules were unfair, nobody wanted to follow them.",
          modelAnswer: "The rules were unfair, so nobody wanted to follow them.",
        },
        {
          kind: "independent",
          title: "Hunt in your draft",
          prompt: `Find a sentence in your ${topic ? `'${topic}' ` : ""}draft where a comma joins two full sentences and fix it.`,
          modelAnswer: "No two complete sentences are joined by only a comma.",
        },
      ]
    ),
  "character.tell_not_show": (topic) =>
    ladder(
      "character_setting",
      "character.tell_not_show",
      "Don't name the feeling — show it with an action or detail and let the reader feel it.",
      [
        {
          kind: "worked_example",
          title: "Show, don't tell",
          prompt: "The told version becomes a shown one.",
          exemplar:
            "✗ She was terrified.\n✓ Her hand froze on the handle. She counted three breaths before she could make herself turn it.",
        },
        {
          kind: "faded",
          title: "Show this feeling",
          prompt: "Rewrite to SHOW the emotion instead of naming it.",
          stem: "He was really excited.",
          modelAnswer: "He was already at the door, shoes half on, before anyone else had stood up.",
        },
        {
          kind: "independent",
          title: "In your story",
          prompt: `Find one 'feeling word' in your ${topic ? `'${topic}' ` : ""}story and replace it with a shown detail.`,
          modelAnswer: "At least one emotion is shown through action, not named.",
        },
      ]
    ),
  "ideas.unelaborated": (topic) =>
    ladder(
      "ideas",
      "ideas.unelaborated",
      "A point on its own is just an assertion. Elaborate: add a 'because…' and a concrete example so the idea earns its place.",
      [
        {
          kind: "worked_example",
          title: "Point + because + example",
          prompt: "See how the bare point grows.",
          exemplar:
            "Bare: Recess should be longer.\nElaborated: Recess should be longer because students focus better after real rest — on Wednesdays, when we get 25 minutes, the class is noticeably calmer in period 4.",
        },
        {
          kind: "faded",
          title: "Add the because + example",
          prompt: "Complete this point with a reason and an example.",
          stem: "Schools should plant more trees because ____",
          modelAnswer:
            "Schools should plant more trees because shade makes the yard usable in summer — last February half the basketball court was unplayable by lunch.",
        },
        {
          kind: "independent",
          title: "Strengthen your draft",
          prompt: `Pick the weakest point in your ${topic ? `'${topic}' ` : ""}draft and add a 'because' and an example.`,
          modelAnswer: "Each main idea has a reason and a concrete example.",
        },
      ]
    ),
};

function genericLadder(trait: TraitId, tag: string, topic: string): PracticeLadder {
  const m = TAXONOMY_MAP[tag];
  const def = TRAIT_MAP[trait];
  return ladder(
    trait,
    tag,
    `${m?.studentFraming ?? def.blurb} The move: ${m?.theMove ?? "practise this trait deliberately."}`,
    [
      {
        kind: "worked_example",
        title: "See the move",
        prompt: `Here's what '${def.label}' looks like done well.`,
        exemplar: m?.theMove ?? def.blurb,
      },
      {
        kind: "independent",
        title: "Apply it",
        prompt: `Now apply this to your ${topic ? `'${topic}' ` : ""}draft: ${m?.theMove ?? def.blurb}`,
        modelAnswer: "The move is visible in your revised draft.",
      },
    ]
  );
}

export function mockLadder(trait: TraitId, tag: string, topic: string): PracticeLadder {
  const fn = MOCK_LADDERS[tag];
  return fn ? fn(topic) : genericLadder(trait, tag, topic);
}

export async function buildLadder(
  trait: TraitId,
  tag: string,
  topic: string
): Promise<{ ladder: PracticeLadder; engine: "llm" | "mock" }> {
  if (hasLLM()) {
    try {
      return { ladder: await llmLadder(trait, tag, topic), engine: "llm" };
    } catch (e) {
      console.error("llmLadder failed, falling back to mock:", e);
    }
  }
  return { ladder: mockLadder(trait, tag, topic), engine: "mock" };
}
