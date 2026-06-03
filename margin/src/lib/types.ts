// Core domain types for Margin's middle-school writing model.

export type TextType = "persuasive" | "narrative";

/** Stable IDs for the analytic traits we model (NAPLAN-aligned). */
export type TraitId =
  | "audience"
  | "text_structure"
  | "ideas"
  | "persuasive_devices" // persuasive only
  | "character_setting" // narrative only
  | "vocabulary"
  | "cohesion"
  | "paragraphing"
  | "sentence_structure"
  | "punctuation"
  | "spelling";

/** A score on a single trait for a single piece of writing. */
export interface TraitScore {
  trait: TraitId;
  /** Rubric band achieved, 0..max for this trait (see rubric.ts). */
  band: number;
  /** Evaluator confidence 0..1. Low confidence routes to the teacher. */
  confidence: number;
  /** Misconception tag ids observed for this trait (see taxonomy.ts). */
  tags: string[];
  /** A short, evidence-grounded note. Quotes a span of the student's text. */
  note: string;
  /** Verbatim spans from the student's text this judgement is grounded in. */
  evidence: string[];
}

/** Result of scoring one piece of writing across all traits. */
export interface Diagnosis {
  scores: TraitScore[];
  /** The single highest-leverage trait to work on next (ZPD-bounded). */
  focusTrait: TraitId;
  /** The specific misconception we'll target inside the focus trait. */
  focusTag: string;
  /** Whole-piece confidence; if low, the whole diagnosis is teacher-gated. */
  overallConfidence: number;
  wordCount: number;
}

/** One rung of a faded-worked-example practice ladder. */
export interface PracticeRung {
  kind: "worked_example" | "faded" | "independent";
  title: string;
  /** Instructional text shown to the student. */
  prompt: string;
  /** For worked_example: the full expert exemplar (annotated). */
  exemplar?: string;
  /** For faded: text with a gap the student completes. */
  stem?: string;
  /** A model answer used to give the student feedback on faded/independent. */
  modelAnswer?: string;
}

export interface PracticeLadder {
  trait: TraitId;
  tag: string;
  microLesson: string; // 2-3 sentence explanation of the move
  rungs: PracticeRung[];
}

/** Per-trait competency estimate held in the student model. */
export interface TraitState {
  trait: TraitId;
  /** Continuous skill estimate on a 0..100 scale (Elo-style). */
  rating: number;
  /** Model uncertainty 0..1 (Glicko-ish); high = needs more evidence. */
  uncertainty: number;
  /** Independent samples at/above the mastery threshold on novel prompts. */
  masterySamples: number;
  mastered: boolean;
  /** Recurring misconception tags with how many times each was seen. */
  tagCounts: Record<string, number>;
  /** Rating at first observation, for growth reporting. */
  baselineRating: number;
  /** History of ratings for the sparkline. */
  history: { t: number; rating: number }[];
}

export interface StudentModel {
  studentId: string;
  displayName: string;
  traits: Record<string, TraitState>;
  /** Pieces written, for the activity log. */
  pieces: PieceRecord[];
}

export interface PieceRecord {
  id: string;
  taskId: string;
  textType: TextType;
  /** Was this a fresh "cold-write" (counts toward transfer evidence)? */
  cold: boolean;
  createdAt: number;
  wordCount: number;
  /** Map of traitId -> band at time of writing. */
  bands: Record<string, number>;
  /** The focus trait this piece drove practice on. */
  focusTrait?: TraitId;
  /** draft-1 -> draft-n band delta on the focus trait, if revised. */
  revisionDelta?: number;
}
