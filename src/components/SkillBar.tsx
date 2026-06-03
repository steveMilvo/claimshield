"use client";

import { SKILLS, masteryToTier, type Skills } from "@/lib/game";

export default function SkillBars({ mastery }: { mastery: Skills }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SKILLS.map((s) => {
        const m = mastery[s.key];
        const tier = masteryToTier(m);
        return (
          <div
            key={s.key}
            className="rounded-2xl bg-white/70 p-3 shadow-soft backdrop-blur"
            title={`${s.label} — grows ${s.part}`}
          >
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <span aria-hidden>{s.emoji}</span>
              <span className="truncate">{s.kidLabel}</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.round(m * 100)}%`, background: s.color }}
              />
            </div>
            <div className="mt-1.5 flex gap-1" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{ background: i < tier ? s.color : "rgba(43,37,64,0.12)" }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
