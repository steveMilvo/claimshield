# Pip — train your AI

> Adaptive, individually-measured **AI-literacy for primary students** (ages 5–11).
> Children don't *use* an AI — they *train a deliberately-fallible AI apprentice*,
> learning to direct it, catch its mistakes, and correct it.

**Working title:** *Pip* (the apprentice the child trains is "Pip"). Naming TBD.

This repository holds the **planning/specification docs** *and* a **runnable
prototype** of the core loop.

## Run the prototype

```bash
npm install
npm run dev      # http://localhost:3000  → click "Start teaching Pip"
```

A playable build of the **"Catch Pip's Mistake"** loop (Next.js + TypeScript +
Tailwind). The child directs Pip, Pip answers — sometimes with a *planted*
mistake — and the child catches it, taps the wrong words, and teaches Pip the
fix. **Pip's avatar visually evolves** as per-skill mastery grows (eyes ↔
spotting made-up facts, smile ↔ fairness, body ↔ no-bragging, book ↔ checking
sources). Runs fully offline — hard-coded item bank, browser text-to-speech, no
API keys. `public/pip-evolution.svg` shows the five growth stages.

## The core insight

Every other AI-in-education product puts the child *below* the AI (the AI is the
smart tutor; the child receives). That structurally breeds dependence and is hard
to assess. **Pip inverts the power relationship:** the child is the boss/teacher,
the AI is the eager, error-prone apprentice. This single inversion solves three
problems at once — pedagogy (the *protégé effect*), the dependence/cheating
tension (you can't offload thinking to an apprentice you must supervise), and
measurement (planted errors make "did the child catch it?" a clean, scorable
signal of critical-AI skill).

## Strategic choices (locked)

| Decision | Choice |
|---|---|
| Region | **Australia + New Zealand first**, pre-wired for US / UK / Canada |
| Go-to-market | **Teacher-led B2B2C** |
| Team / budget | **Lean** (2–4 people, < A$500k) |
| v1 tier | **Primary (5–11)** — go deep; middle/senior are roadmap |
| v1 slice | **Ages 8–9, "Catch Pip's Mistake" critical-judgement loop** |

## Documents

- [`docs/01-product-design.md`](docs/01-product-design.md) — full product design
  across all three tiers (primary / middle / senior): AI-skills framework,
  competitive white space, personalization engine, architecture, safety, GTM, risks.
- [`docs/02-build-spec-catch-pips-mistake.md`](docs/02-build-spec-catch-pips-mistake.md)
  — build-ready spec for the **ages 8–9 "Catch Pip's Mistake" loop**: error-spec
  schema, generation+verifier pipeline, student model & d′ scoring, UX, pilot
  protocol, and a week-by-week plan to a 31 Aug 2026 classroom pilot.
- [`docs/03-pip-avatar-and-workshop.md`](docs/03-pip-avatar-and-workshop.md)
  — Pip's avatar evolution + the customisation menu ("Pip Workshop"): how
  appearance is a readout of real mastery, the choose-freely / earn-detail model,
  the slot/tier/option system, equity guardrails, and the buildable rig spec.

## The two sacred design rules

1. **Pre-generate + verify the item bank offline** — it's what makes the product
   safe (no unplanned hallucinations reach children), cheap, and measurable.
2. **Score with d′ + criterion, not hit rate** — it's what makes the outcome
   claim defensible (distinguishes a discerning child from one who rejects
   everything).
