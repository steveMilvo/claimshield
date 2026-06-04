"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { TASKS } from "@/lib/tasks";
import { overallRating } from "@/lib/studentModel";
import type { StudentModel } from "@/lib/types";
import { cn } from "@/lib/cn";

const RESEARCH: {
  quote: string;
  author: string;
  source: string;
  year: string;
  note: string;
  href?: string;
  featured?: boolean;
}[] = [
  {
    quote:
      "Margin is not merely an automated grading tool; it is a pedagogical engine built on decades of cognitive science and educational research. By enforcing deliberate practice, targeting the Zone of Proximal Development, managing cognitive load through worked examples, and demanding transfer-gated mastery, Margin ensures that writing instruction actually compounds.",
    author: "Steve Milverton MSL",
    source: "Margin: The Pedagogical Engine for Writing Instruction that Compounds",
    year: "2026",
    note: "The full analysis — how each design decision maps to a named, replicated finding in cognitive science and education research.",
    href: "/research/margin-pedagogical-engine.pdf",
    featured: true,
  },
  {
    quote:
      "The research shows clearly that formative assessment does improve learning. The gains in achievement appear to be among the largest ever reported for educational interventions.",
    author: "Black & Wiliam",
    source: "Assessment and Classroom Learning",
    year: "1998",
    note: "Effect size d ≈ 0.70 — among the largest in K–12 research. Margin diagnoses every trait before the student ever sees a score.",
  },
  {
    quote:
      "The zone of proximal development defines those functions that have not yet matured but are in the process of maturation — the buds or flowers of development, rather than the fruits.",
    author: "Lev Vygotsky",
    source: "Mind in Society",
    year: "1978",
    note: "Margin's focus-trait selector picks the highest-leverage reachable skill — not the absolute weakest, and not one already out of reach.",
  },
  {
    quote:
      "The optimal instructional sequence is gradual: a fully worked example, then a completion problem, then an independent problem.",
    author: "Alexander Renkl",
    source: "Worked-Out Examples: Instructional Explanations Support Learning by Self-Explanations",
    year: "2002",
    note: "Every practice session runs the same three rungs: see the move fully worked, complete a partial version, then apply it in your own draft.",
  },
  {
    quote:
      "The 2 sigma problem: the search for methods of group instruction as effective as one-to-one tutoring.",
    author: "Benjamin Bloom",
    source: "Educational Researcher",
    year: "1984",
    note: "A trait is never marked mastered on the practised prompt. Transfer to a new, cold-write prompt is required.",
  },
  {
    quote:
      "Deliberate practice involves considerable, specific, and sustained effort to do something you cannot do well — or even at all.",
    author: "Ericsson, Krampe & Tesch-Römer",
    source: "The Role of Deliberate Practice in the Acquisition of Expert Performance",
    year: "1993",
    note: "One trait. One move. Grounded in a verbatim span of the student's own text. Revision is the practice.",
  },
];

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

      {/* ── Research foundations ─────────────────────────────────────── */}
      <section className="border-t border-line/70 bg-paper paper-grain">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pencil-500">
                Evidence base
              </p>
              <h2 className="mt-2 font-serif text-2xl text-ink">
                Research this is built on
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                Every design decision in Margin traces to a named, replicated finding. These are not decorations — they are constraints that the architecture had to satisfy.
              </p>
            </div>
            <a
              href="/research/margin-pedagogical-engine.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-focus-200 bg-focus-50 px-4 py-2.5 text-sm font-medium text-focus-700 shadow-card transition hover:bg-focus-100 hover:shadow-lift"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M10 2v4h4M6 9h4M6 11.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Read the research paper
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESEARCH.map((r) => (
              <figure
                key={r.author + r.year}
                className={cn(
                  "group relative rounded-2xl border p-5 shadow-card transition hover:shadow-lift",
                  r.featured
                    ? "border-focus-200 bg-focus-50/60 sm:col-span-2 lg:col-span-3"
                    : "border-line bg-card"
                )}
              >
                {/* margin-rule accent */}
                <div className={cn(
                  "absolute left-0 top-6 bottom-6 w-[3px] rounded-full transition-opacity",
                  r.featured
                    ? "bg-focus-500 opacity-80 group-hover:opacity-100"
                    : "bg-focus-300 opacity-60 group-hover:opacity-100"
                )} />

                <blockquote className="pl-4">
                  <p className={cn(
                    "font-serif leading-snug text-ink",
                    r.featured ? "text-[17px] sm:text-[18px]" : "text-[15px]"
                  )}>
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </blockquote>

                <figcaption className="mt-4 pl-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold text-ink-soft">
                      {r.author}{" "}
                      <span className="font-normal text-ink-faint">· {r.year}</span>
                    </p>
                    {r.href ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 block text-xs italic text-focus-600 hover:underline"
                      >
                        {r.source}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-xs italic text-ink-faint">{r.source}</p>
                    )}
                    <p className="mt-3 text-[12px] leading-snug text-pencil-500 border-t border-line pt-3">
                      {r.note}
                    </p>
                  </div>
                  {r.featured && (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-focus-500 px-3.5 py-2 text-xs font-semibold text-white shadow-card transition hover:bg-focus-600"
                    >
                      Download PDF
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                        <path d="M6.5 2v7M3.5 6l3 3 3-3M2 11h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-8 text-xs text-ink-faint">
          <Logo withWord className="mb-1 text-ink-muted" />
          <p>Prototype · the loop runs fully offline on a deterministic mock scorer. Add an <code className="font-mono">ANTHROPIC_API_KEY</code> to switch on the calibrated LLM judge.</p>
          <p>
            Pedagogy: formative assessment (Black &amp; Wiliam) · worked-example effect &amp; fading (Sweller, Renkl) ·
            ZPD (Vygotsky) · mastery learning (Bloom) · deliberate practice (Ericsson) · transfer-gated evidence of mastery.
          </p>
        </div>
      </footer>
    </main>
  );
}
