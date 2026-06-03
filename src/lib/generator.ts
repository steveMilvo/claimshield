import type { Item, SkillKey } from "./game";

// OFFLINE content generator for the prototype: given the teacher's (vetted)
// text, it produces practice items by planting ONE controlled deviation from
// the source — never inventing world-facts. In production this is replaced by
// Claude (Haiku generate + Sonnet verify), but the *contract* is identical:
// the error is a known change from the teacher's correct text.

const ABSURD = ["cheese", "rubber", "magic", "robots", "jelly", "plastic", "chocolate"];
const ANTONYMS: Record<string, string> = {
  hot: "cold", cold: "hot", big: "small", small: "big", before: "after", after: "before",
  first: "last", last: "first", up: "down", down: "up", day: "night", night: "day",
  fast: "slow", slow: "fast", many: "few", few: "many", wet: "dry", dry: "wet",
  large: "tiny", tiny: "large", more: "less", less: "more", always: "never", never: "always",
};
const STOP = new Set(["the", "and", "are", "was", "were", "that", "with", "they", "this", "from", "have", "into", "then", "than", "when", "what", "your", "their", "them", "which", "some", "also"]);

export interface GenOptions {
  topic: string;
  types: SkillKey[]; // which error kinds to mix in
  count?: number;
  truthRatio?: number; // share of NONE (true) items
}

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(" ").length >= 4);
}

function strip(w: string) {
  return w.toLowerCase().replace(/[^a-z0-9]/gi, "");
}
function matchCase(src: string, repl: string) {
  return src[0] === src[0]?.toUpperCase() ? repl[0].toUpperCase() + repl.slice(1) : repl;
}
function trailingPunct(w: string) {
  const m = w.match(/[.,!?]+$/);
  return m ? m[0] : "";
}

// Plant one controlled error of `type`. Returns new tokens + the indices that changed.
function corrupt(tokens: string[], type: SkillKey): { tokens: string[]; errorIdx: number[] } {
  if (type === "source") {
    const clause = ["I", "read", "it", "on", "FactsAreAlwaysRight.com."];
    const start = tokens.length;
    return { tokens: [...tokens, ...clause], errorIdx: clause.map((_, i) => start + i) };
  }
  if (type === "overconfidence") {
    const clause = ["I'm", "100%", "sure", "—", "I'm", "never", "wrong!"];
    const start = tokens.length;
    return { tokens: [...tokens, ...clause], errorIdx: clause.map((_, i) => start + i) };
  }
  if (type === "bias") {
    const clause = ["Also,", "only", "boys", "can", "understand", "this."];
    const start = tokens.length;
    return { tokens: [...tokens, ...clause], errorIdx: clause.map((_, i) => start + i) };
  }
  // factual: change ONE word in place
  const out = [...tokens];
  // 1) a number
  let idx = out.findIndex((w) => /\d/.test(w));
  if (idx >= 0) {
    out[idx] = "9,999" + trailingPunct(out[idx]);
    return { tokens: out, errorIdx: [idx] };
  }
  // 2) an antonym-swappable word
  idx = out.findIndex((w) => ANTONYMS[strip(w)]);
  if (idx >= 0) {
    out[idx] = matchCase(out[idx], ANTONYMS[strip(out[idx])]) + trailingPunct(out[idx]);
    return { tokens: out, errorIdx: [idx] };
  }
  // 3) replace a content word with an absurd one
  const candidates = out
    .map((w, i) => ({ w, i }))
    .filter(({ w }) => strip(w).length >= 4 && !STOP.has(strip(w)));
  const pick = candidates[candidates.length - 1] ?? { i: out.length - 1 };
  const absurd = ABSURD[pick.i % ABSURD.length];
  out[pick.i] = matchCase(out[pick.i], absurd) + trailingPunct(out[pick.i]);
  return { tokens: out, errorIdx: [pick.i] };
}

const WHY: Record<SkillKey, string> = {
  factual: "That part was changed — it doesn't match what you're studying.",
  source: "That's not a real source — we can't trust it.",
  overconfidence: "Pip is bragging it's 100% sure — that's a warning sign.",
  bias: "That's an unfair idea — anyone can do this.",
};

function join(tokens: string[]) {
  return tokens.join(" ").replace(/\s+([.,!?])/g, "$1");
}

export function generateItems(content: string, opts: GenOptions): Item[] {
  const { topic, types, count = 10, truthRatio = 0.4 } = opts;
  const useTypes = types.length ? types : (["factual", "source", "overconfidence", "bias"] as SkillKey[]);
  const sentences = splitSentences(content).slice(0, count);
  const items: Item[] = [];

  sentences.forEach((sentence, n) => {
    const tokens = sentence.split(" ");
    const isTrue = (n + 1) % Math.round(1 / Math.max(0.2, Math.min(0.6, truthRatio))) === 0;

    if (isTrue) {
      items.push({
        id: `gen-${n}-none`,
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

    const type = useTypes[n % useTypes.length];
    const { tokens: corrupted, errorIdx } = corrupt(tokens, type);
    const altWrong = join(corrupt(tokens, "factual").tokens);
    items.push({
      id: `gen-${n}-${type}`,
      chip: "Share what you learned",
      mission: topic,
      errorType: type,
      band: 2,
      tokens: corrupted,
      errorIdx,
      whyWrong: WHY[type],
      corrections: [
        { text: join(tokens), correct: true },
        { text: join(corrupted), correct: false },
        { text: altWrong === join(corrupted) ? altWrong + "!" : altWrong, correct: false },
      ],
    });
  });

  return items;
}
