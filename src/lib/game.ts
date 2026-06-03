// Core types + the (lightweight) mastery model that drives both scoring
// and Pip's appearance. Mirrors the build spec: per-skill BKT-style update,
// hit / miss / false-alarm tracking, and tiers derived from mastery.

export type SkillKey = "factual" | "bias" | "overconfidence" | "source";

export const SKILLS: {
  key: SkillKey;
  label: string;
  kidLabel: string;
  emoji: string;
  part: string; // which part of Pip this competency grows
  color: string;
}[] = [
  {
    key: "factual",
    label: "Spotting made-up facts",
    kidLabel: "Made-up facts",
    emoji: "🔎",
    part: "Pip's eyes",
    color: "#5BC8F5",
  },
  {
    key: "bias",
    label: "Spotting unfair ideas",
    kidLabel: "Fair & kind",
    emoji: "⚖️",
    part: "Pip's smile",
    color: "#FF7BA9",
  },
  {
    key: "overconfidence",
    label: "Spotting big bragging",
    kidLabel: "No bragging",
    emoji: "🎯",
    part: "Pip's body",
    color: "#FFC44D",
  },
  {
    key: "source",
    label: "Checking where facts come from",
    kidLabel: "Check the source",
    emoji: "📚",
    part: "Pip's book",
    color: "#3FD3A7",
  },
];

export type ErrorType = SkillKey | "NONE";

export interface Item {
  id: string;
  topic?: string; // content domain; defaults to PRIMARY_TOPIC
  chip: string; // the direction the child gives Pip
  mission: string; // tiny framing for the turn
  errorType: ErrorType;
  band: 1 | 2 | 3 | 4;
  tokens: string[]; // Pip's answer, word by word
  errorIdx: number[]; // which tokens are the mistake (empty when NONE)
  whyWrong: string;
  corrections: { text: string; correct: boolean }[];
  provenance?: "ai" | "offline"; // how the item was authored
  verifyReason?: string; // Claude verifier's note (ai items only)
}

// The "practised" content domain. Anything else counts as a transfer
// (new-topic) trial — evidence the skill generalises, not memorisation.
export const PRIMARY_TOPIC = "life-cycles";

export type Skills = Record<SkillKey, number>;

export interface SkillStat {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
}

export interface TurnLog {
  topic: string;
  skill: SkillKey | "NONE";
  isError: boolean;
  correct: boolean;
}

export interface GameState {
  mastery: Skills;
  stats: Record<SkillKey, SkillStat>;
  // calibration: did the child correctly accept true answers? 0..1
  calibration: number;
  calTrue: number;
  calTrials: number;
  caught: number; // total good catches (for streaks/celebration)
  turns: number;
  log: TurnLog[];
  // the practised content domain for this session (a custom pack overrides
  // the built-in default); anything else in the log counts as transfer.
  practisedTopic?: string;
  transferTopic?: string; // display name for the new-topic probe domain
}

export const PRIOR = 0.18;

export function initState(): GameState {
  return {
    mastery: { factual: PRIOR, bias: PRIOR, overconfidence: PRIOR, source: PRIOR },
    stats: {
      factual: blankStat(),
      bias: blankStat(),
      overconfidence: blankStat(),
      source: blankStat(),
    },
    calibration: 0.4,
    calTrue: 0,
    calTrials: 0,
    caught: 0,
    turns: 0,
    log: [],
  };
}

function blankStat(): SkillStat {
  return { hits: 0, misses: 0, falseAlarms: 0, correctRejections: 0 };
}

// BKT-ish update (params from the build spec, seeded).
const pT = 0.16; // learn rate
const pSlip = 0.1;
const pGuess = 0.2;

function bktUpdate(pL: number, correct: boolean): number {
  const posterior = correct
    ? (pL * (1 - pSlip)) / (pL * (1 - pSlip) + (1 - pL) * pGuess)
    : (pL * pSlip) / (pL * pSlip + (1 - pL) * (1 - pGuess));
  return posterior + (1 - posterior) * pT;
}

export interface TurnResult {
  outcome: "catch" | "miss" | "falseAlarm" | "goodTrust";
  message: string;
}

// The child judged "wrong" or "right"; for "wrong" they also tapped a token.
export function applyTurn(
  state: GameState,
  item: Item,
  saidWrong: boolean,
  tappedIdx: number | null
): { state: GameState; result: TurnResult } {
  const next: GameState = structuredCloneSafe(state);
  next.turns += 1;
  const topic = item.topic ?? PRIMARY_TOPIC;
  let result: TurnResult;

  if (item.errorType === "NONE") {
    next.calTrials += 1;
    if (!saidWrong) next.calTrue += 1;
    next.calibration = next.calTrue / next.calTrials;
    result = saidWrong
      ? {
          outcome: "falseAlarm",
          message:
            "Careful! That answer was actually correct. Pip isn't always wrong — check carefully.",
        }
      : {
          outcome: "goodTrust",
          message: "Nice — that one was actually true. You didn't get tricked!",
        };
    next.log.push({ topic, skill: "NONE", isError: false, correct: !saidWrong });
    return { state: next, result };
  }

  const skill = item.errorType;
  const stat = next.stats[skill];
  const tappedRight = tappedIdx !== null && item.errorIdx.includes(tappedIdx);
  const caughtIt = saidWrong && tappedRight;

  if (caughtIt) {
    stat.hits += 1;
    next.caught += 1;
    next.mastery[skill] = bktUpdate(next.mastery[skill], true);
    result = { outcome: "catch", message: "Great catch! You found Pip's mistake. 🎉" };
  } else if (saidWrong && !tappedRight) {
    // sensed something off but pointed at the wrong bit
    stat.misses += 1;
    next.mastery[skill] = bktUpdate(next.mastery[skill], false);
    result = {
      outcome: "miss",
      message: `So close! The tricky bit was "${item.errorIdx
        .map((i) => item.tokens[i])
        .join(" ")}". ${item.whyWrong}`,
    };
  } else {
    // said "Pip's right" but it was wrong
    stat.misses += 1;
    next.mastery[skill] = bktUpdate(next.mastery[skill], false);
    result = { outcome: "miss", message: `Hmm, Pip slipped one past you. ${item.whyWrong}` };
  }

  next.log.push({ topic, skill, isError: true, correct: caughtIt });
  return { state: next, result };
}

export interface TransferReport {
  practised: { trials: number; rate: number | null };
  transfer: { trials: number; rate: number | null };
}

// Detection rate on the practised topic vs on new (transfer) topics.
export function transferReport(state: GameState): TransferReport {
  const practised = state.practisedTopic ?? PRIMARY_TOPIC;
  let pH = 0, pT = 0, tH = 0, tT = 0;
  for (const l of state.log) {
    if (!l.isError) continue;
    if (l.topic === practised) {
      pT++;
      if (l.correct) pH++;
    } else {
      tT++;
      if (l.correct) tH++;
    }
  }
  return {
    practised: { trials: pT, rate: pT ? pH / pT : null },
    transfer: { trials: tT, rate: tT ? tH / tT : null },
  };
}

function structuredCloneSafe<T>(v: T): T {
  if (typeof structuredClone === "function") return structuredClone(v);
  return JSON.parse(JSON.stringify(v));
}

// ---- Pip appearance derived from mastery (deterministic) ----

export interface PipTiers {
  eyes: number; // factual
  mouth: number; // bias
  body: number; // overconfidence
  source: number; // source
  glow: number; // calibration (0..1)
}

export function masteryToTier(m: number): number {
  // 0..1 -> 0..4
  return Math.max(0, Math.min(4, Math.round(m * 4)));
}

export function pipTiers(state: GameState): PipTiers {
  return {
    eyes: masteryToTier(state.mastery.factual),
    mouth: masteryToTier(state.mastery.bias),
    body: masteryToTier(state.mastery.overconfidence),
    source: masteryToTier(state.mastery.source),
    glow: state.calibration,
  };
}

export function overallStage(t: PipTiers): number {
  const avg = (t.eyes + t.mouth + t.body + t.source) / 4;
  return Math.round(avg);
}

// ---- Signal-detection report (teacher-facing evidence of mastery) ----
// d′ separates a genuinely discerning child from one who just says "wrong"
// to everything; criterion c reveals trust posture (cynical ↔ credulous).

// Inverse normal CDF (probit) — Acklam's approximation.
function probit(p: number): number {
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const plow = 0.02425, phigh = 1 - plow;
  let q: number, r: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= phigh) {
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

export interface SDReport {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
  hitRate: number;
  faRate: number;
  dprime: number;
  criterion: number;
  errorTrials: number;
  truthTrials: number;
}

export function sdReport(state: GameState): SDReport {
  let hits = 0, misses = 0;
  (Object.keys(state.stats) as SkillKey[]).forEach((k) => {
    hits += state.stats[k].hits;
    misses += state.stats[k].misses;
  });
  const correctRejections = state.calTrue;
  const falseAlarms = state.calTrials - state.calTrue;
  const errorTrials = hits + misses;
  const truthTrials = correctRejections + falseAlarms;
  // log-linear correction (add 0.5 to each cell) for small-N stability
  const H = (hits + 0.5) / (errorTrials + 1);
  const F = (falseAlarms + 0.5) / (truthTrials + 1);
  return {
    hits,
    misses,
    falseAlarms,
    correctRejections,
    hitRate: errorTrials ? hits / errorTrials : 0,
    faRate: truthTrials ? falseAlarms / truthTrials : 0,
    dprime: probit(H) - probit(F),
    criterion: -0.5 * (probit(H) + probit(F)),
    errorTrials,
    truthTrials,
  };
}

export function skillDetection(state: GameState, key: SkillKey) {
  const s = state.stats[key];
  const trials = s.hits + s.misses;
  return { trials, rate: trials ? s.hits / trials : null };
}

export function dprimeBand(d: number): { label: string; tone: string } {
  if (d < 0.5) return { label: "Still guessing", tone: "bubble" };
  if (d < 1.0) return { label: "Starting to spot mistakes", tone: "sunny" };
  if (d < 1.8) return { label: "Good at spotting AI mistakes", tone: "sky" };
  return { label: "Excellent — clearly discerning", tone: "mint" };
}

export function criterionPosture(c: number): { label: string; note: string } {
  if (c < -0.4)
    return {
      label: "Leans skeptical",
      note: "Tends to call things wrong even when true — encourage trusting correct answers.",
    };
  if (c > 0.4)
    return {
      label: "Leans trusting",
      note: "Tends to accept Pip too easily — encourage checking before agreeing.",
    };
  return { label: "Well balanced", note: "Tells true from false without over-trusting or over-rejecting." };
}
