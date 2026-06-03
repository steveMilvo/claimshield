"use client";

import { cn } from "@/lib/cn";

/** A calm progress ring for the overall writing rating. */
export function RadialScore({
  value,
  label,
  sublabel,
  className,
}: {
  value: number; // 0..100
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r={r} fill="none" stroke="#E7E2D6" strokeWidth="8" />
        <circle
          cx="46"
          cy="46"
          r={r}
          fill="none"
          stroke="#6B5CF0"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 46 46)"
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-serif text-2xl leading-none text-ink tabular-nums">{value || "—"}</span>
        {label && <span className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-muted">{label}</span>}
      </div>
      {sublabel && <span className="sr-only">{sublabel}</span>}
    </div>
  );
}
