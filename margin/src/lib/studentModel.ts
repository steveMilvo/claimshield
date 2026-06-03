import type {
  Diagnosis,
  StudentModel,
  TraitId,
  TraitScore,
  TraitState,
} from "./types";
import {
  MASTERY_SAMPLES_REQUIRED,
  TRAITS,
  TRAIT_MAP,
  bandToRating,
  masteryBand,
  traitsFor,
} from "./rubric";
import type { TextType } from "./types";

/**
 * The student model. Each trait carries a continuous rating (0..100) updated
 * Elo-style toward each new observation, with the step size scaled by model
 * uncertainty (Glicko-ish: uncertain traits move fast, settled traits move
 * slowly). Mastery is NOT granted by a single high score — it requires
 * sustained performance across independent COLD-WRITE (transfer) samples.
 */

export function emptyTraitState(trait: TraitId): TraitState {
  return {
    trait,
    rating: 0,
    uncertainty: 1,
    masterySamples: 0,
    mastered: false,
    tagCounts: {},
    baselineRating: -1,
    history: [],
  };
}

export function newStudent(studentId: string, displayName: string): StudentModel {
  const traits: Record<string, TraitState> = {};
  for (const t of TRAITS) traits[t.id] = emptyTraitState(t.id);
  return { studentId, displayName, traits, pieces: [] };
}

/** Elo-style update of a single trait from one scored observation. */
export function updateTrait(
  state: TraitState,
  score: TraitScore,
  opts: { cold: boolean; t: number }
): TraitState {
  const observed = bandToRating(score.trait, score.band);
  // Confidence-weighted, uncertainty-scaled learning rate.
  const k = 0.55 * state.uncertainty * Math.max(0.4, score.confidence);
  const baseline = state.baselineRating < 0 ? observed : state.baselineRating;
  const rating =
    state.rating === 0 && state.history.length === 0
      ? observed // first observation seeds the rating
      : Math.round(state.rating + k * (observed - state.rating));

  // Uncertainty shrinks with evidence, floored so the model stays adaptive.
  const uncertainty = Math.max(0.18, state.uncertainty * 0.82);

  // Transfer-gated mastery: only cold-writes at/above the mastery band count.
  const atMastery = score.band >= masteryBand(score.trait);
  let masterySamples = state.masterySamples;
  if (opts.cold && atMastery) masterySamples += 1;
  if (opts.cold && !atMastery) masterySamples = 0; // must be sustained
  const mastered = masterySamples >= MASTERY_SAMPLES_REQUIRED;

  const tagCounts = { ...state.tagCounts };
  for (const tag of score.tags) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;

  return {
    ...state,
    rating,
    uncertainty,
    masterySamples,
    mastered,
    tagCounts,
    baselineRating: baseline,
    history: [...state.history, { t: opts.t, rating }].slice(-24),
  };
}

/**
 * ZPD-bounded focus selection. We do NOT pick the absolute weakest trait —
 * we pick the weakest *high-leverage* trait that is close enough to its
 * mastery threshold that practice will pay off, excluding already-mastered
 * traits. This is the pedagogical heart: one high-leverage move at a time.
 */
export function selectFocusTrait(
  model: StudentModel,
  textType: TextType
): { trait: TraitId; reason: string } {
  const candidates = traitsFor(textType)
    .map((def) => {
      const st = model.traits[def.id];
      if (st.mastered) return null;
      const target = (masteryBand(def.id) / def.max) * 100;
      const gap = Math.max(0, target - st.rating); // distance to mastery
      // ZPD sweet spot: reachable (gap not huge) but not trivial.
      const reachability = gap === 0 ? 0 : Math.exp(-Math.pow(gap - 22, 2) / 800);
      const priority = def.leverage * reachability;
      return { def, st, gap, priority };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null && c.gap > 4);

  if (candidates.length === 0) {
    // Fall back to the lowest-rated unmastered trait.
    const lowest = traitsFor(textType)
      .map((d) => ({ d, st: model.traits[d.id] }))
      .filter((c) => !c.st.mastered)
      .sort((a, b) => a.st.rating - b.st.rating)[0];
    const trait = (lowest?.d.id ?? traitsFor(textType)[0].id) as TraitId;
    return { trait, reason: "Lowest current trait." };
  }

  candidates.sort((a, b) => b.priority - a.priority);
  const top = candidates[0];
  return {
    trait: top.def.id,
    reason: `High-leverage and within reach (${Math.round(top.gap)} pts from mastery).`,
  };
}

/** Pick the most-seen misconception tag for a trait, else its first canonical. */
export function dominantTag(state: TraitState, fallback: string): string {
  const entries = Object.entries(state.tagCounts);
  if (entries.length === 0) return fallback;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

/** Apply a full diagnosis to the model, returning a new model. */
export function applyDiagnosis(
  model: StudentModel,
  diagnosis: Diagnosis,
  opts: { taskId: string; textType: TextType; cold: boolean; t: number }
): StudentModel {
  const traits = { ...model.traits };
  const bands: Record<string, number> = {};
  for (const score of diagnosis.scores) {
    bands[score.trait] = score.band;
    traits[score.trait] = updateTrait(traits[score.trait], score, {
      cold: opts.cold,
      t: opts.t,
    });
  }
  return {
    ...model,
    traits,
    pieces: [
      ...model.pieces,
      {
        id: `${opts.taskId}-${opts.t}`,
        taskId: opts.taskId,
        textType: opts.textType,
        cold: opts.cold,
        createdAt: opts.t,
        wordCount: diagnosis.wordCount,
        bands,
        focusTrait: diagnosis.focusTrait,
      },
    ],
  };
}

/** Overall writing rating: leverage-weighted mean of trait ratings. */
export function overallRating(model: StudentModel, textType: TextType): number {
  const defs = traitsFor(textType);
  let num = 0;
  let den = 0;
  for (const d of defs) {
    const st = model.traits[d.id];
    if (st.history.length === 0) continue;
    num += st.rating * d.leverage;
    den += d.leverage;
  }
  return den === 0 ? 0 : Math.round(num / den);
}

export function masteredCount(model: StudentModel, textType: TextType): number {
  return traitsFor(textType).filter((d) => model.traits[d.id].mastered).length;
}

export function totalGrowth(model: StudentModel, textType: TextType): number {
  const defs = traitsFor(textType);
  let delta = 0;
  let n = 0;
  for (const d of defs) {
    const st = model.traits[d.id];
    if (st.baselineRating < 0 || st.history.length < 2) continue;
    delta += st.rating - st.baselineRating;
    n += 1;
  }
  return n === 0 ? 0 : Math.round(delta / n);
}

export const ALL_TRAIT_DEFS = TRAITS;
export { TRAIT_MAP, traitsFor };
