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
  chip: string; // the direction the child gives Pip
  mission: string; // tiny framing for the turn
  errorType: ErrorType;
  band: 1 | 2 | 3 | 4;
  tokens: string[]; // Pip's answer, word by word
  errorIdx: number[]; // which tokens are the mistake (empty when NONE)
  whyWrong: string;
  corrections: { text: string; correct: boolean }[];
}

export type Skills = Record<SkillKey, number>;

export interface SkillStat {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
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

  if (item.errorType === "NONE") {
    next.calTrials += 1;
    if (!saidWrong) {
      next.calTrue += 1;
      next.calibration = next.calTrue / next.calTrials;
      return {
        state: next,
        result: {
          outcome: "goodTrust",
          message: "Nice — that one was actually true. You didn't get tricked!",
        },
      };
    }
    next.calibration = next.calTrue / next.calTrials;
    return {
      state: next,
      result: {
        outcome: "falseAlarm",
        message:
          "Careful! That answer was actually correct. Pip isn't always wrong — check carefully.",
      },
    };
  }

  const skill = item.errorType;
  const stat = next.stats[skill];
  const tappedRight = tappedIdx !== null && item.errorIdx.includes(tappedIdx);
  const caughtIt = saidWrong && tappedRight;

  if (caughtIt) {
    stat.hits += 1;
    next.caught += 1;
    next.mastery[skill] = bktUpdate(next.mastery[skill], true);
    return {
      state: next,
      result: { outcome: "catch", message: "Great catch! You found Pip's mistake. 🎉" },
    };
  }

  if (saidWrong && !tappedRight) {
    // sensed something off but pointed at the wrong bit — partial
    stat.misses += 1;
    next.mastery[skill] = bktUpdate(next.mastery[skill], false);
    return {
      state: next,
      result: {
        outcome: "miss",
        message: `So close! The tricky bit was "${item.errorIdx
          .map((i) => item.tokens[i])
          .join(" ")}". ${item.whyWrong}`,
      },
    };
  }

  // said "Pip's right" but it was wrong
  stat.misses += 1;
  next.mastery[skill] = bktUpdate(next.mastery[skill], false);
  return {
    state: next,
    result: {
      outcome: "miss",
      message: `Hmm, Pip slipped one past you. ${item.whyWrong}`,
    },
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
