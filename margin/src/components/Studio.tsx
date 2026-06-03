"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { TraitMeter } from "@/components/TraitMeter";
import { RadialScore } from "@/components/RadialScore";
import { PracticePanel } from "@/components/PracticePanel";
import type { WritingTask } from "@/lib/tasks";
import { TASK_MAP } from "@/lib/tasks";
import type { Diagnosis, StudentModel } from "@/lib/types";
import { TRAIT_MAP, traitsFor } from "@/lib/rubric";
import { TAXONOMY_MAP } from "@/lib/taxonomy";
import {
  applyDiagnosis,
  overallRating,
  selectFocusTrait,
} from "@/lib/studentModel";
import {
  seedClassIfEmpty,
  getActiveId,
  getStudent,
  saveStudent,
} from "@/lib/store";
import { cn } from "@/lib/cn";

type Phase = "write" | "diagnosed" | "practice";

export function Studio({ task }: { task: WritingTask }) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("write");
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [engine, setEngine] = useState<"llm" | "mock">("mock");
  const [model, setModel] = useState<StudentModel | null>(null);
  const [coldDone, setColdDone] = useState(false);
  const [lastFocusBand, setLastFocusBand] = useState<number | null>(null);
  const [focusDelta, setFocusDelta] = useState<number | null>(null);
  const [practised, setPractised] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const editsRef = useRef(0);

  useEffect(() => {
    seedClassIfEmpty();
    setModel(getStudent(getActiveId()));
  }, []);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const parallel = task.parallelForm ? TASK_MAP[task.parallelForm] : undefined;

  const focusScore = diagnosis?.scores.find((s) => s.trait === diagnosis.focusTrait);
  const focusDef = diagnosis ? TRAIT_MAP[diagnosis.focusTrait] : undefined;
  const lowConfidence = diagnosis ? diagnosis.overallConfidence < 0.55 : false;

  async function runDiagnose() {
    if (words < 20 || !model) return;
    setLoading(true);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          textType: task.textType,
          taskId: task.id,
          model,
        }),
      });
      const data = await res.json();
      const diag: Diagnosis = data.diagnosis;
      setEngine(data.engine);

      const isCold = !coldDone; // first submission of this task instance is cold
      const newBand = diag.scores.find((s) => s.trait === diag.focusTrait)?.band ?? 0;
      if (lastFocusBand !== null && diag.focusTrait && phase !== "write") {
        // (not used path)
      }
      // delta vs previous focus band (revision improvement)
      if (lastFocusBand !== null) setFocusDelta(newBand - lastFocusBand);
      setLastFocusBand(newBand);

      const updated = applyDiagnosis(model, diag, {
        taskId: task.id,
        textType: task.textType,
        cold: isCold,
        t: Date.now(),
      });
      setModel(updated);
      saveStudent(updated);
      setColdDone(true);
      setDiagnosis(diag);
      setPhase("diagnosed");
    } finally {
      setLoading(false);
    }
  }

  if (!model) {
    return <div className="grid min-h-screen place-items-center text-ink-muted">Loading studio…</div>;
  }

  const overall = overallRating(model, task.textType);

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-line/70 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-4">
            <Link href="/"><Logo /></Link>
            <span className="hidden text-sm text-ink-muted sm:inline">
              {task.textType === "persuasive" ? "Persuasive" : "Narrative"} · Year {task.year}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                engine === "llm" ? "bg-growth-50 text-growth-700" : "bg-paper text-ink-muted"
              )}
              title={engine === "llm" ? "Calibrated Claude judge" : "Deterministic mock scorer (no API key)"}
            >
              {engine === "llm" ? "LLM judge" : "Mock engine"}
            </span>
            <Link href="/teacher" className="text-sm text-ink-muted hover:text-ink">Teacher view</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-7 lg:grid-cols-[1fr_360px]">
        {/* Left: prompt + writing surface OR practice */}
        <section>
          <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-pencil-500">
              {task.title}
            </p>
            <p className="mt-1.5 font-serif text-lg leading-snug text-ink-soft">{task.prompt}</p>
          </div>

          {phase === "practice" && focusScore && focusDef ? (
            <PracticePanel
              trait={diagnosis!.focusTrait}
              tag={diagnosis!.focusTag}
              topic={task.title}
              onDone={() => {
                setPractised(true);
                setPhase("write");
              }}
            />
          ) : (
            <div className="mt-4">
              {/* Writing surface */}
              <div className="rounded-2xl border border-line bg-paper paper-grain p-1.5 shadow-card">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    editsRef.current += 1;
                  }}
                  placeholder={
                    task.textType === "persuasive"
                      ? "State your position, then build your case paragraph by paragraph…"
                      : "Open on a moment, not a summary. Put us inside the scene…"
                  }
                  spellCheck
                  className="prose-write ruled thin-scroll min-h-[420px] w-full resize-y rounded-xl bg-transparent px-5 py-4 outline-none"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm text-ink-muted">
                  <span className={cn("tabular-nums", words >= task.targetWords && "text-growth-600")}>
                    {words} / {task.targetWords} words
                  </span>
                  {practised && (
                    <span className="rounded-full bg-pencil-100 px-2.5 py-0.5 text-xs font-medium text-pencil-600">
                      Now revise using the move, then re-check
                    </span>
                  )}
                </div>
                <button
                  onClick={runDiagnose}
                  disabled={words < 20 || loading}
                  className={cn(
                    "rounded-xl px-5 py-2.5 font-medium shadow-card transition",
                    words < 20 || loading
                      ? "cursor-not-allowed bg-line text-ink-faint"
                      : "bg-focus-500 text-white hover:bg-focus-600"
                  )}
                >
                  {loading ? "Reading your writing…" : coldDone ? "Re-check my draft" : "Get feedback"}
                </button>
              </div>
              {words < 20 && (
                <p className="mt-2 text-xs text-ink-faint">Write at least 20 words to get a diagnosis.</p>
              )}
            </div>
          )}
        </section>

        {/* Right: the margin — competency model + notes */}
        <aside className="space-y-4">
          {/* Competency snapshot */}
          <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">{model.displayName}</p>
                <p className="font-serif text-lg text-ink">Writing model</p>
              </div>
              <RadialScore value={overall} label={task.textType} />
            </div>
            <div className="mt-3 space-y-2">
              {traitsFor(task.textType)
                .slice()
                .sort((a, b) => b.leverage - a.leverage)
                .map((d) => (
                  <TraitMeter
                    key={d.id}
                    state={model.traits[d.id]}
                    focus={diagnosis?.focusTrait === d.id}
                    delta={diagnosis?.focusTrait === d.id ? focusDelta ?? undefined : undefined}
                  />
                ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Diagnosis margin notes (full-width band under the studio) */}
      {phase === "diagnosed" && diagnosis && focusScore && focusDef && (
        <section className="mx-auto max-w-6xl animate-fade-up px-5 pb-16">
          {lowConfidence && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-warn/40 bg-pencil-100/60 px-4 py-3 text-sm text-pencil-600">
              <span aria-hidden>⚑</span>
              <p>
                The scorer wasn&apos;t fully confident here (often: the piece is short). This
                diagnosis is <strong>flagged for teacher review</strong> before it changes mastery.
              </p>
            </div>
          )}

          {/* The focus move — the one thing to work on */}
          <div className="rounded-2xl border border-focus-200 bg-focus-50 p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-focus-700">
                  Your next move · highest leverage
                </p>
                <h3 className="mt-1 font-serif text-2xl text-ink">{focusDef.label}</h3>
              </div>
              <button
                onClick={() => setPhase("practice")}
                className="rounded-xl bg-focus-500 px-5 py-2.5 font-medium text-white shadow-card transition hover:bg-focus-600"
              >
                Practise this move →
              </button>
            </div>
            <p className="mt-3 max-w-2xl text-ink-soft">
              {TAXONOMY_MAP[diagnosis.focusTag]?.studentFraming ?? focusScore.note}
            </p>
            {focusScore.evidence.length > 0 && (
              <p className="mt-3 border-l-2 border-pencil-300 pl-3 font-serif text-ink-soft">
                <span className="evidence">{focusScore.evidence[0]}</span>
              </p>
            )}
          </div>

          {/* All other trait notes — the margin */}
          <h4 className="mt-7 mb-3 font-serif text-lg text-ink">Margin notes</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosis.scores
              .filter((s) => s.trait !== diagnosis.focusTrait)
              .map((s) => {
                const def = TRAIT_MAP[s.trait];
                return (
                  <div key={s.trait} className="rounded-xl border border-line bg-card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink-soft">{def.label}</span>
                      <span className="text-xs tabular-nums text-ink-muted">
                        {s.band}/{def.max}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-snug text-ink-muted">{s.note}</p>
                    {s.evidence[0] && (
                      <p className="mt-2 border-l-2 border-line pl-2 font-serif text-[13px] text-ink-faint">
                        “{s.evidence[0]}”
                      </p>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Transfer CTA */}
          {practised && parallel && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-growth-100 bg-growth-50 p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-growth-700">
                  Prove it transfers
                </p>
                <p className="mt-1 max-w-xl text-ink-soft">
                  You&apos;ve practised the move and revised. Mastery only counts when it shows up on a
                  <strong> new, unpractised prompt</strong>. Try the parallel task as a cold write.
                </p>
              </div>
              <Link
                href={`/write/${parallel.id}`}
                className="rounded-xl bg-growth-600 px-5 py-2.5 font-medium text-white shadow-card transition hover:bg-growth-700"
              >
                Cold-write: {parallel.title} →
              </Link>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
