import type { Analysis } from "./mockAnalysis";

const INDEX_KEY = "claimshield:cases";
const caseKey = (id: string) => `claimshield:case:${id}`;

export type CaseSummary = {
  id: string;
  createdAt: number;
  insurer: string;
  policyType: string;
  score: number;
  scoreLabel: Analysis["scoreLabel"];
  upside: number;
};

function newId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}

export function listCases(): CaseSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return [...arr].sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function getCase(id: string): Analysis | null {
  if (typeof window === "undefined" || !id) return null;
  try {
    const raw = window.localStorage.getItem(caseKey(id));
    return raw ? (JSON.parse(raw) as Analysis) : null;
  } catch {
    return null;
  }
}

export function saveCase(analysis: Analysis): string {
  const id = newId();
  if (typeof window === "undefined") return id;
  try {
    window.localStorage.setItem(caseKey(id), JSON.stringify(analysis));
    const summary: CaseSummary = {
      id,
      createdAt: Date.now(),
      insurer: analysis.insurer,
      policyType: analysis.policyType,
      score: analysis.score,
      scoreLabel: analysis.scoreLabel,
      upside: analysis.upside,
    };
    const next = [summary, ...listCases().filter((c) => c.id !== id)];
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable or full — the analysis is still rendered this session */
  }
  return id;
}

export function deleteCase(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(caseKey(id));
    window.localStorage.setItem(
      INDEX_KEY,
      JSON.stringify(listCases().filter((c) => c.id !== id)),
    );
  } catch {
    /* ignore */
  }
}
