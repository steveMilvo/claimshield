"use client";

import {
  SKILLS,
  sdReport,
  skillDetection,
  dprimeBand,
  criterionPosture,
  masteryToTier,
  type GameState,
  type SkillKey,
} from "@/lib/game";

const TONE: Record<string, string> = {
  bubble: "#FF7BA9",
  sunny: "#FFC44D",
  sky: "#5BC8F5",
  mint: "#3FD3A7",
};

export default function PipReport({
  state,
  onClose,
}: {
  state: GameState;
  onClose: () => void;
}) {
  const sd = sdReport(state);
  const band = dprimeBand(sd.dprime);
  const posture = criterionPosture(sd.criterion);

  const dPct = Math.max(2, Math.min(100, (sd.dprime / 3) * 100));
  const cPct = Math.max(2, Math.min(98, ((sd.criterion + 1.5) / 3) * 100));

  const summary = buildSummary(state, sd.dprime);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Pip report for grown-ups"
      onClick={onClose}
    >
      <div
        className="my-6 w-full max-w-2xl animate-pop rounded-xl2 bg-cream p-6 shadow-soft sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">Pip Report</h2>
            <p className="text-ink/60">For grown-ups · evidence of real skill, not time spent</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white px-3 py-1.5 text-lg shadow-soft"
            aria-label="Close report"
          >
            ✕
          </button>
        </div>

        {/* headline metrics */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* d' */}
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold uppercase tracking-wide text-ink/50">
                Spotting skill (d′)
              </span>
              <span className="font-display text-3xl font-bold" style={{ color: TONE[band.tone] }}>
                {sd.dprime.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full" style={{ width: `${dPct}%`, background: TONE[band.tone] }} />
            </div>
            <p className="mt-2 font-display text-lg font-semibold">{band.label}</p>
            <p className="text-sm text-ink/55">
              Can the child tell Pip’s <b>mistakes</b> from its <b>true</b> answers? Higher = more discerning.
            </p>
          </div>

          {/* criterion */}
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            <span className="text-sm font-bold uppercase tracking-wide text-ink/50">Trust balance</span>
            <div className="relative mt-6 h-3 w-full rounded-full bg-gradient-to-r from-bubble/50 via-mint/50 to-sky/50">
              <div
                className="absolute -top-2 h-7 w-1.5 -translate-x-1/2 rounded-full bg-ink"
                style={{ left: `${cPct}%` }}
                aria-hidden
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-ink/50">
              <span>Skeptical</span>
              <span>Balanced</span>
              <span>Trusting</span>
            </div>
            <p className="mt-2 font-display text-lg font-semibold">{posture.label}</p>
            <p className="text-sm text-ink/55">{posture.note}</p>
          </div>
        </div>

        {/* tally */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Good catches" value={sd.hits} tone="#3FD3A7" />
          <Stat label="Missed" value={sd.misses} tone="#FF7BA9" />
          <Stat label="False alarms" value={sd.falseAlarms} tone="#FFC44D" />
          <Stat label="Trusted true" value={sd.correctRejections} tone="#5BC8F5" />
        </div>

        {/* per-skill */}
        <h3 className="mt-6 font-display text-xl font-bold">By skill</h3>
        <div className="mt-2 space-y-2">
          {SKILLS.map((s) => {
            const det = skillDetection(state, s.key as SkillKey);
            const m = state.mastery[s.key];
            const tier = masteryToTier(m);
            return (
              <div key={s.key} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
                <span className="text-2xl" aria-hidden>{s.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold">{s.label}</span>
                    <span className="text-sm text-ink/50">grows {s.part}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full rounded-full" style={{ width: `${Math.round(m * 100)}%`, background: s.color }} />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <div className="font-display text-lg font-bold" style={{ color: s.color }}>
                    {det.rate === null ? "—" : `${Math.round(det.rate * 100)}%`}
                  </div>
                  <div className="text-xs text-ink/45">
                    {det.trials === 0 ? "no tries yet" : `caught · tier ${tier}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* auto summary */}
        <div className="mt-5 rounded-2xl bg-grape/10 p-4">
          <h3 className="font-display text-lg font-bold text-grapeDark">What this tells you</h3>
          <p className="mt-1 text-ink/80">{summary}</p>
          <p className="mt-2 text-xs text-ink/50">
            d′ and criterion come from signal-detection theory: they separate genuine discernment from a
            “say-wrong-to-everything” strategy — the core of the build spec’s mastery loop.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-soft">
      <div className="font-display text-2xl font-bold" style={{ color: tone }}>{value}</div>
      <div className="text-xs text-ink/55">{label}</div>
    </div>
  );
}

function buildSummary(state: GameState, dprime: number): string {
  const tried = SKILLS.map((s) => ({
    s,
    det: skillDetection(state, s.key as SkillKey),
    m: state.mastery[s.key],
  })).filter((x) => x.det.trials > 0);

  if (tried.length === 0) return "No turns played yet — start teaching Pip to see results.";

  const strongest = [...tried].sort((a, b) => b.m - a.m)[0];
  const weakest = [...tried].sort((a, b) => a.m - b.m)[0];

  const overall =
    dprime >= 1.8
      ? "is clearly able to tell AI mistakes from true answers"
      : dprime >= 1.0
      ? "is getting good at telling AI mistakes from true answers"
      : dprime >= 0.5
      ? "is starting to tell AI mistakes from true answers"
      : "is still learning to tell AI mistakes from true answers";

  let out = `This learner ${overall}. Strongest so far: ${strongest.s.kidLabel.toLowerCase()}.`;
  if (weakest.s.key !== strongest.s.key) {
    out += ` Give more practice on: ${weakest.s.kidLabel.toLowerCase()}.`;
  }
  return out;
}
