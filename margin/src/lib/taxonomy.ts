import type { TraitId } from "./types";

/**
 * Writing-misconception taxonomy. Each entry is a recurring, nameable error
 * pattern the evaluator can tag and the practice generator can target with a
 * faded worked-example ladder. This list is deliberately curated and finite
 * (not free-form) so the student model stays interpretable and the practice
 * generator stays on rails. Expand from real marked scripts during calibration.
 */
export interface Misconception {
  id: string;
  trait: TraitId;
  label: string; // teacher-facing
  /** Student-facing, non-judgemental framing of the gap. */
  studentFraming: string;
  /** The single move that fixes it (what practice teaches). */
  theMove: string;
}

export const TAXONOMY: Misconception[] = [
  // Ideas
  {
    id: "ideas.unelaborated",
    trait: "ideas",
    label: "Ideas asserted but not elaborated",
    studentFraming: "You make a point, then jump on before showing why it matters.",
    theMove: "Add a 'because…' and an example to each main idea.",
  },
  {
    id: "ideas.off_purpose",
    trait: "ideas",
    label: "Ideas drift from the purpose/prompt",
    studentFraming: "Some ideas are interesting but pull away from your goal.",
    theMove: "Test each idea against the prompt; cut or re-aim the strays.",
  },
  // Cohesion
  {
    id: "cohesion.evidence_unlinked",
    trait: "cohesion",
    label: "Evidence stated but not linked to the claim",
    studentFraming: "You give good evidence, but don't say how it proves your point.",
    theMove: "After each piece of evidence, add a sentence linking it back to your claim.",
  },
  {
    id: "cohesion.missing_connectives",
    trait: "cohesion",
    label: "Few connectives between ideas",
    studentFraming: "Your ideas are good but sit side by side without joining.",
    theMove: "Use connectives (however, as a result, for example) to show how ideas relate.",
  },
  // Text structure
  {
    id: "structure.weak_opening",
    trait: "text_structure",
    label: "Opening doesn't orient or hook",
    studentFraming: "Your start doesn't yet set up what's coming.",
    theMove: "Open with a hook plus a one-line signpost of your position/story.",
  },
  {
    id: "structure.no_resolution",
    trait: "text_structure",
    label: "Ending stops rather than resolves",
    studentFraming: "Your piece stops instead of landing.",
    theMove: "End by resolving the tension (narrative) or driving the point home (persuasive).",
  },
  // Persuasive devices
  {
    id: "devices.absent",
    trait: "persuasive_devices",
    label: "No deliberate persuasive techniques",
    studentFraming: "You state opinions but don't use techniques to move the reader.",
    theMove: "Add one device per paragraph: rhetorical question, rule of three, or appeal.",
  },
  // Character & setting
  {
    id: "character.tell_not_show",
    trait: "character_setting",
    label: "Tells emotion instead of showing it",
    studentFraming: "You name feelings ('she was scared') instead of showing them.",
    theMove: "Replace a 'feeling word' with an action or detail that shows it.",
  },
  // Audience
  {
    id: "audience.flat",
    trait: "audience",
    label: "No clear sense of a reader",
    studentFraming: "It reads like notes, not like it's written for someone.",
    theMove: "Picture one reader; choose words and a tone that work on them.",
  },
  // Paragraphing
  {
    id: "paragraphing.run_on",
    trait: "paragraphing",
    label: "One block / no topic grouping",
    studentFraming: "Different ideas are bundled into one big block.",
    theMove: "Start a new paragraph at each new idea; lead with a topic sentence.",
  },
  // Vocabulary
  {
    id: "vocab.repetitive",
    trait: "vocabulary",
    label: "Repetitive, low-precision word choice",
    studentFraming: "A few words are doing all the work and repeat a lot.",
    theMove: "Swap 3 vague words (good, said, went) for precise ones.",
  },
  // Sentence structure
  {
    id: "sentence.comma_splice",
    trait: "sentence_structure",
    label: "Comma splices / run-ons",
    studentFraming: "Two sentences are joined with only a comma.",
    theMove: "Split with a full stop, or join with a connective or semicolon.",
  },
  {
    id: "sentence.monotone_length",
    trait: "sentence_structure",
    label: "Little sentence variety",
    studentFraming: "Sentences are all a similar length and shape.",
    theMove: "Add one short punchy sentence and one longer complex one.",
  },
];

export const TAXONOMY_MAP: Record<string, Misconception> = Object.fromEntries(
  TAXONOMY.map((m) => [m.id, m])
);

export function misconceptionsFor(trait: TraitId): Misconception[] {
  return TAXONOMY.filter((m) => m.trait === trait);
}
