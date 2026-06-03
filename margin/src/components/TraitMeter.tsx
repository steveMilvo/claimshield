"use client";

import { cn } from "@/lib/cn";
import type { TraitState } from "@/lib/types";
import { TRAIT_MAP } from "@/lib/rubric";

export function TraitMeter({
  state,
  focus = false,
  delta,
}: {
  state: TraitState;
  focus?: boolean;
  delta?: number;
}) {
  const def = TRAIT_MAP[state.trait];
  const seen = state.history.length > 0;
  const target = 75; // mastery threshold on the 0..100 scale (≈ rubric 75%)

  return (
    <div
      className={cn(
        "rounded-xl border px-3.5 py-3 transition-colors",
        focus
          ? "border-focus-300 bg-focus-50"
          : state.mastered
          ? "border-growth-100 bg-growth-50"
          : "border-line bg-card"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-sm font-medium text-ink-soft">{def.label}</span>
          {state.mastered && (
            <span className="shrink-0 rounded-full bg-growth-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-growth-700">
              Mastered
            </span>
          )}
          {focus && !state.mastered && (
            <span className="shrink-0 rounded-full bg-focus-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Working on
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 tabular-nums">
          {typeof delta === "number" && delta !== 0 && (
            <span className={cn("text-xs font-semibold", delta > 0 ? "text-growth-600" : "text-danger")}>
              {delta > 0 ? "+" : ""}
              {delta}
            </span>
          )}
          <span className="text-sm font-semibold text-ink">{seen ? state.rating : "—"}</span>
        </div>
      </div>

      <div className="relative mt-2 h-2 rounded-full bg-line">
        {/* mastery threshold marker */}
        <div className="absolute top-[-2px] bottom-[-2px] w-px bg-ink-faint/60" style={{ left: `${target}%` }} aria-hidden />
        <div
          className={cn(
            "h-2 rounded-full transition-[width] duration-700 ease-out",
            state.mastered ? "bg-growth-500" : focus ? "bg-focus-500" : "bg-ink-faint"
          )}
          style={{ width: `${seen ? Math.max(3, state.rating) : 0}%` }}
        />
      </div>
    </div>
  );
}
