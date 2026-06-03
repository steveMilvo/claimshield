/**
 * Scorer calibration harness — the "kill-switch" experiment.
 *
 * Runs Margin's evaluator (mock by default; the calibrated Claude judge when
 * ANTHROPIC_API_KEY is set) against a corpus of human-marked anchor scripts and
 * reports, per rubric trait, how closely the machine agrees with the human:
 *   - n              : number of scored pairs
 *   - MAE            : mean absolute band error
 *   - exact %        : exact band agreement
 *   - within-1 %     : agreement within one band (the practically useful number)
 *   - QWK            : quadratic-weighted kappa (chance-corrected agreement)
 *
 * GO/NO-GO GATE: a trait "passes" when QWK >= 0.60 OR (when N is too small for a
 * stable kappa) within-1 >= 0.80. This is exactly the gate the product design
 * says must clear BEFORE the student model can be trusted.
 *
 * Run:  npm run calibrate
 * No browser, no port. Output prints to your terminal.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreWriting } from "../src/lib/scoring";
import { TRAIT_MAP } from "../src/lib/rubric";
import type { TextType, TraitId } from "../src/lib/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/* Load ANTHROPIC_API_KEY from .env.local the way the Next app does, so the
   harness can exercise the real judge without extra setup. */
function loadEnvLocal() {
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

interface AnchorScript {
  id: string;
  textType: TextType;
  text: string;
  reference: Partial<Record<TraitId, number>>;
}

const corpus = JSON.parse(
  readFileSync(join(ROOT, "fixtures", "anchor-scripts.json"), "utf8")
) as { scripts: AnchorScript[] };

const QWK_GATE = 0.6;
const WITHIN1_GATE = 0.8;

/* ----------------------------- metrics ----------------------------- */

function quadraticWeightedKappa(pairs: { ref: number; pred: number }[], max: number): number | null {
  const k = max + 1;
  if (pairs.length < 2) return null;
  const O = Array.from({ length: k }, () => new Array(k).fill(0));
  const rowT = new Array(k).fill(0);
  const colT = new Array(k).fill(0);
  for (const { ref, pred } of pairs) {
    const a = Math.max(0, Math.min(max, ref));
    const b = Math.max(0, Math.min(max, pred));
    O[a][b] += 1;
    rowT[a] += 1;
    colT[b] += 1;
  }
  const n = pairs.length;
  let num = 0;
  let den = 0;
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      const w = ((i - j) * (i - j)) / ((k - 1) * (k - 1));
      const e = (rowT[i] * colT[j]) / n;
      num += w * O[i][j];
      den += w * e;
    }
  }
  if (den === 0) return null; // no expected disagreement -> kappa undefined
  return 1 - num / den;
}

/* ------------------------------ run ------------------------------- */

async function main() {
  const usingLLM = Boolean(process.env.ANTHROPIC_API_KEY);
  console.log("\n  Margin — scorer calibration harness");
  console.log("  ───────────────────────────────────");
  console.log(`  Engine:   ${usingLLM ? "Claude judge (ANTHROPIC_API_KEY set)" : "deterministic MOCK (no key)"}`);
  console.log(`  Corpus:   ${corpus.scripts.length} anchor scripts (ILLUSTRATIVE SEED DATA)`);
  console.log("");

  const byTrait = new Map<TraitId, { ref: number; pred: number }[]>();

  for (const s of corpus.scripts) {
    const { scores, engine } = await scoreWriting(s.text, s.textType);
    const predMap = new Map<string, number>(scores.map((x) => [x.trait, x.band]));
    for (const [traitStr, ref] of Object.entries(s.reference)) {
      const trait = traitStr as TraitId;
      const pred = predMap.get(trait);
      if (pred === undefined || ref === undefined) continue;
      if (!byTrait.has(trait)) byTrait.set(trait, []);
      byTrait.get(trait)!.push({ ref, pred });
    }
    process.stdout.write(`  scored ${s.id} (${s.textType}, ${engine})\n`);
  }

  console.log("");
  const head = `  ${"trait".padEnd(20)}${"n".padStart(3)}${"MAE".padStart(7)}${"exact".padStart(8)}${"within1".padStart(9)}${"QWK".padStart(8)}   gate`;
  console.log(head);
  console.log("  " + "-".repeat(head.length - 2));

  let passed = 0;
  let evaluated = 0;
  const rows: { trait: TraitId; mae: number; exact: number; within1: number; qwk: number | null; pass: boolean }[] = [];

  for (const [trait, pairs] of byTrait) {
    const def = TRAIT_MAP[trait];
    if (!def) continue;
    const n = pairs.length;
    const mae = pairs.reduce((a, p) => a + Math.abs(p.ref - p.pred), 0) / n;
    const exact = pairs.filter((p) => p.ref === p.pred).length / n;
    const within1 = pairs.filter((p) => Math.abs(p.ref - p.pred) <= 1).length / n;
    const qwk = quadraticWeightedKappa(pairs, def.max);
    const pass = qwk !== null ? qwk >= QWK_GATE : within1 >= WITHIN1_GATE;
    rows.push({ trait, mae, exact, within1, qwk, pass });
    evaluated++;
    if (pass) passed++;
  }

  rows.sort((a, b) => (a.pass === b.pass ? 0 : a.pass ? 1 : -1));
  for (const r of rows) {
    const qwkStr = r.qwk === null ? "  n/a" : r.qwk.toFixed(2).padStart(5);
    const line =
      `  ${TRAIT_MAP[r.trait].label.padEnd(20)}` +
      `${String(byTrait.get(r.trait)!.length).padStart(3)}` +
      `${r.mae.toFixed(2).padStart(7)}` +
      `${(r.exact * 100).toFixed(0).padStart(7)}%` +
      `${(r.within1 * 100).toFixed(0).padStart(8)}%` +
      `${qwkStr.padStart(8)}` +
      `   ${r.pass ? "PASS" : "FAIL"}`;
    console.log(line);
  }

  console.log("  " + "-".repeat(head.length - 2));
  console.log(`\n  Gate: QWK >= ${QWK_GATE}  (or within-1 >= ${WITHIN1_GATE * 100}% when N is too small for a stable kappa)`);
  console.log(`  Result: ${passed}/${evaluated} traits pass.\n`);

  console.log("  ⚠  These numbers run on ILLUSTRATIVE SEED DATA. They demonstrate the");
  console.log("     methodology, not product readiness. The real go/no-go needs a");
  console.log("     double-marked corpus of real scripts and the Claude judge enabled.\n");

  // Non-zero exit if most traits fail, so this can gate CI later.
  process.exit(passed >= Math.ceil(evaluated / 2) ? 0 : 1);
}

main().catch((e) => {
  console.error("calibration failed:", e);
  process.exit(2);
});
