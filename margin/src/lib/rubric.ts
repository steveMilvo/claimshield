import type { TextType, TraitId } from "./types";

/**
 * NAPLAN-aligned analytic writing rubric (AU), framed to be portable to
 * NZ e-asTTle and US 6+1 Traits. Each trait has a max band and a "leverage"
 * weight — how much improving it tends to move overall writing quality at
 * middle-school level. Higher leverage = prioritised when within the ZPD.
 *
 * Leverage weights are an explicit design assumption (label: ASSUMPTION),
 * informed by the NAPLAN marking guide's relative criterion weighting and
 * the worked-example/cohesion literature. They are tunable per cohort once
 * the calibration corpus exists.
 */
export interface TraitDef {
  id: TraitId;
  label: string;
  /** One-line description in student-facing language. */
  blurb: string;
  /** Maximum rubric band for this trait. */
  max: number;
  /** 0..1 leverage on overall quality (drives ZPD trait selection). */
  leverage: number;
  /** Which text types this trait applies to. */
  appliesTo: TextType[];
  /** "Higher-order" traits get transfer-gated mastery; conventions get spacing. */
  order: "higher" | "convention";
}

export const TRAITS: TraitDef[] = [
  {
    id: "audience",
    label: "Audience",
    blurb: "Holds the reader in mind and works to affect them.",
    max: 6,
    leverage: 0.85,
    appliesTo: ["persuasive", "narrative"],
    order: "higher",
  },
  {
    id: "text_structure",
    label: "Text structure",
    blurb: "A clear beginning, middle and end that fit the text type.",
    max: 4,
    leverage: 0.8,
    appliesTo: ["persuasive", "narrative"],
    order: "higher",
  },
  {
    id: "ideas",
    label: "Ideas",
    blurb: "Ideas are selected, elaborated and connected to a purpose.",
    max: 5,
    leverage: 0.9,
    appliesTo: ["persuasive", "narrative"],
    order: "higher",
  },
  {
    id: "persuasive_devices",
    label: "Persuasive devices",
    blurb: "Uses rhetorical techniques to strengthen the argument.",
    max: 4,
    leverage: 0.75,
    appliesTo: ["persuasive"],
    order: "higher",
  },
  {
    id: "character_setting",
    label: "Character & setting",
    blurb: "Creates characters and a setting the reader can picture.",
    max: 4,
    leverage: 0.75,
    appliesTo: ["narrative"],
    order: "higher",
  },
  {
    id: "cohesion",
    label: "Cohesion",
    blurb: "Links ideas so the whole piece holds together.",
    max: 4,
    leverage: 0.88,
    appliesTo: ["persuasive", "narrative"],
    order: "higher",
  },
  {
    id: "paragraphing",
    label: "Paragraphing",
    blurb: "Groups related ideas into well-built paragraphs.",
    max: 2,
    leverage: 0.6,
    appliesTo: ["persuasive", "narrative"],
    order: "higher",
  },
  {
    id: "vocabulary",
    label: "Vocabulary",
    blurb: "Precise, varied word choices that do real work.",
    max: 5,
    leverage: 0.7,
    appliesTo: ["persuasive", "narrative"],
    order: "higher",
  },
  {
    id: "sentence_structure",
    label: "Sentence structure",
    blurb: "Controlled, varied sentences that read smoothly.",
    max: 6,
    leverage: 0.78,
    appliesTo: ["persuasive", "narrative"],
    order: "convention",
  },
  {
    id: "punctuation",
    label: "Punctuation",
    blurb: "Punctuation used correctly to aid meaning.",
    max: 5,
    leverage: 0.45,
    appliesTo: ["persuasive", "narrative"],
    order: "convention",
  },
  {
    id: "spelling",
    label: "Spelling",
    blurb: "Spells words across difficulty levels correctly.",
    max: 6,
    leverage: 0.4,
    appliesTo: ["persuasive", "narrative"],
    order: "convention",
  },
];

export const TRAIT_MAP: Record<string, TraitDef> = Object.fromEntries(
  TRAITS.map((t) => [t.id, t])
);

export function traitsFor(textType: TextType): TraitDef[] {
  return TRAITS.filter((t) => t.appliesTo.includes(textType));
}

export function traitLabel(id: TraitId): string {
  return TRAIT_MAP[id]?.label ?? id;
}

/** Convert a rubric band to a 0..100 rating scale for the student model. */
export function bandToRating(trait: TraitId, band: number): number {
  const def = TRAIT_MAP[trait];
  if (!def) return 0;
  return Math.round((band / def.max) * 100);
}

/** Mastery threshold as a band, per trait (≈ 75% of max, rounded). */
export function masteryBand(trait: TraitId): number {
  const def = TRAIT_MAP[trait];
  if (!def) return 0;
  return Math.ceil(def.max * 0.75);
}

/** Independent transfer samples required to confirm mastery of a trait. */
export const MASTERY_SAMPLES_REQUIRED = 2;
