"use client";

import { useEffect, useState } from "react";
import type { PracticeLadder, PracticeRung, TraitId } from "@/lib/types";
import { TRAIT_MAP } from "@/lib/rubric";
import { cn } from "@/lib/cn";

const KIND_LABEL: Record<PracticeRung["kind"], string> = {
  worked_example: "1 · Watch the move",
  faded: "2 · You complete it",
  independent: "3 · Now on your own",
};

export function PracticePanel({
  trait,
  tag,
  topic,
  onDone,
}: {
  trait: TraitId;
  tag: string;
  topic: string;
  onDone: () => void;
}) {
  const [ladder, setLadder] = useState<PracticeLadder | null>(null);
  const [engine, setEngine] = useState<"llm" | "mock">("mock");
  const [error, setError] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trait, tag, topic }),
        });
        if (!res.ok) { if (alive) setError(true); return; }
        const data = await res.json();
        if (!alive) return;
        if (!data.ladder) { setError(true); return; }
        setLadder(data.ladder);
        setEngine(data.engine);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [trait, tag, topic]);

  const def = TRAIT_MAP[trait];

  if (error) {
    return (
      <div className="mt-4 rounded-2xl border border-line bg-card p-6 text-ink-muted">
        Couldn&apos;t build the practice. <button className="underline" onClick={onDone}>Back to draft</button>
      </div>
    );
  }

  if (!ladder) {
    return (
      <div className="mt-4 space-y-3">
        <div className="h-24 animate-pulse-soft rounded-2xl bg-paper" />
        <div className="h-40 animate-pulse-soft rounded-2xl bg-paper" />
      </div>
    );
  }

  return (
    <div className="mt-4 animate-fade-up">
      <div className="rounded-2xl border border-focus-200 bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-focus-700">
            Practice · {def.label}
          </p>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px]", engine === "llm" ? "bg-growth-50 text-growth-700" : "bg-paper text-ink-faint")}>
            {engine === "llm" ? "generated for you" : "example set"}
          </span>
        </div>
        <p className="mt-2 font-serif text-lg leading-snug text-ink-soft">{ladder.microLesson}</p>
      </div>

      <div className="mt-4 space-y-4">
        {ladder.rungs.map((rung, i) => (
          <div key={i} className="rounded-2xl border border-line bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                  rung.kind === "worked_example" && "bg-ink text-paper",
                  rung.kind === "faded" && "bg-focus-100 text-focus-700",
                  rung.kind === "independent" && "bg-growth-100 text-growth-700"
                )}
              >
                {KIND_LABEL[rung.kind]}
              </span>
              <span className="font-serif text-lg text-ink">{rung.title}</span>
            </div>
            <p className="mt-2 text-ink-soft">{rung.prompt}</p>

            {rung.exemplar && (
              <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-line bg-paper p-4 font-serif text-[15px] leading-relaxed text-ink">
                {rung.exemplar}
              </pre>
            )}

            {(rung.kind === "faded" || rung.kind === "independent") && (
              <div className="mt-3">
                {rung.stem && (
                  <p className="mb-2 rounded-lg bg-paper px-3 py-2 font-serif text-ink-soft">{rung.stem}</p>
                )}
                <textarea
                  value={answers[i] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                  placeholder="Write your attempt…"
                  className="thin-scroll min-h-[72px] w-full resize-y rounded-xl border border-line bg-paper px-3.5 py-2.5 font-serif text-ink outline-none focus:border-focus-300"
                />
                {rung.modelAnswer && (
                  <div className="mt-2">
                    <button
                      onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}
                      className="text-sm font-medium text-focus-600 hover:text-focus-700"
                    >
                      {revealed[i] ? "Hide a strong version" : "Compare with a strong version"}
                    </button>
                    {revealed[i] && (
                      <p className="mt-2 rounded-xl border border-growth-100 bg-growth-50 px-3.5 py-2.5 font-serif text-ink-soft">
                        {rung.modelAnswer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-ink-muted">Got the move? Take it straight back into your own draft.</p>
        <button
          onClick={onDone}
          className="rounded-xl bg-ink px-5 py-2.5 font-medium text-paper shadow-card transition hover:bg-ink-soft"
        >
          Back to my draft & revise →
        </button>
      </div>
    </div>
  );
}
