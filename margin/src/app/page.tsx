"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { TASKS } from "@/lib/tasks";
import { overallRating } from "@/lib/studentModel";
import type { StudentModel } from "@/lib/types";
import { cn } from "@/lib/cn";

const LOOP = [
  { k: "Draft", d: "Write a real piece — typed, in one focused surface." },
  { k: "Diagnose", d: "Scored on every rubric trait, grounded in your words." },
  { k: "Practise", d: "One high-leverage move, modelled then faded." },
  { k: "Revise", d: "Take the move back into your own draft." },
  { k: "Prove", d: "Mastery only when it transfers to a new prompt." },
];

export default function Home() {
  const [name, setName] = useState<string>("");
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    fetch("/api/student/me")
      .then((r) => r.json())
      .then((d) => {
        const s = d.student as StudentModel;
        setName(s.displayName);
        setOverall(Math.max(overallRating(s, "persuasive"), overallRating(s, "narrative")));
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/signin" className="rounded-lg px-3 py-1.5 text-ink-muted hover:bg-paper hover:text-ink">
              {name ? name : "Sign in"}
            </Link>
            <Link href="/teacher" className="rounded-lg px-3 py-1.5 text-ink-muted hover:bg-paper hover:text-ink">
              Teacher view
            </Link>
            <a href="#start" className="rounded-lg bg-ink px-3.5 py-1.5 font-medium text-paper hover:bg-ink-soft">
              Start writing
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-16 pb-10">
        <p className="animate-fade-up text-sm font-medium uppercase tracking-[0.18em] text-pencil-500">
          Middle-school writing · NAPLAN-aligned
        </p>
        <h1 className="mt-4 max-w-3xl animate-fade-up font-serif text-[2.6rem] leading-[1.08] tracking-tight text-ink sm:text-[3.4rem]">
          Writing that actually
          <span className="relative whitespace-nowrap">
            {" "}gets better
            <svg className="absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden>
              <path d="M2 7 Q 60 1 100 5 T 198 4" stroke="#C2683B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          .
        </h1>
        <p className="mt-5 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-soft">
          Most tools grade an essay and stop. Margin builds a living, trait-by-trait model of
          how <span className="text-ink">your</span> writing is developing — then turns every
          draft into one targeted, faded practice that moves a real skill. The grade is the
          thermostat. The practice is the furnace.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3" id="start">
          <a href="#tasks" className="rounded-xl bg-focus-500 px-5 py-2.5 font-medium text-white shadow-card transition hover:bg-focus-600">
            Choose a writing task
          </a>
          {name && (
            <span className="text-sm text-ink-muted">
              Writing as <span className="font-medium text-ink-soft">{name}</span>
              {overall > 0 && <> · rating {overall}/100</>} ·{" "}
              <Link href="/signin" className="underline hover:text-ink">switch</Link>
            </span>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-12">
        <div className="grid gap-3 rounded-2xl border border-line bg-paper p-4 paper-grain sm:grid-cols-5">
          {LOOP.map((s, i) => (
            <div key={s.k} className="relative rounded-xl bg-card/70 p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper">
                  {i + 1}
                </span>
                <span className="font-serif text-lg text-ink">{s.k}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-ink-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tasks" className="mx-auto max-w-5xl px-5 pb-20">
        <h2 className="font-serif text-2xl text-ink">Pick a prompt</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Two text types for now: persuasive and narrative. Each has an equated parallel prompt
          we use to test whether a skill really <em>transfers</em>.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {TASKS.map((t) => (
            <Link
              key={t.id}
              href={`/write/${t.id}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-line bg-card p-5 shadow-card transition hover:shadow-lift"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                    t.textType === "persuasive" ? "bg-focus-50 text-focus-700" : "bg-pencil-100 text-pencil-600"
                  )}
                >
                  {t.textType}
                </span>
                <span className="text-xs text-ink-faint">Year {t.year} · ~{t.targetWords} words</span>
              </div>
              <h3 className="mt-3 font-serif text-xl text-ink">{t.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-ink-muted">{t.prompt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-focus-600">
                Open studio
                <svg width="16" height="16" viewBox="0 0 16 16" className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                  <path d="M3 8h9M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-line/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-8 text-xs text-ink-faint">
          <Logo withWord className="mb-1 text-ink-muted" />
          <p>Prototype · the loop runs fully offline on a deterministic mock scorer. Add an ANTHROPIC_API_KEY to switch on the calibrated LLM judge.</p>
          <p>Pedagogy: formative assessment, worked-example effect, ZPD, mastery learning, transfer-gated evidence.</p>
        </div>
      </footer>
    </main>
  );
}
