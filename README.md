# Pip — train your AI

> Adaptive, individually-measured **AI-literacy for primary students** (ages 5–11).
> Children don't *use* an AI — they *train a deliberately-fallible AI apprentice*,
> learning to direct it, catch its mistakes, and correct it.

**Working title:** *Pip* (the apprentice the child trains is "Pip"). Naming TBD.

This repository holds the **planning and specification docs** for the product.
It is not application code.

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

## The two sacred design rules

1. **Pre-generate + verify the item bank offline** — it's what makes the product
   safe (no unplanned hallucinations reach children), cheap, and measurable.
2. **Score with d′ + criterion, not hit rate** — it's what makes the outcome
   claim defensible (distinguishes a discerning child from one who rejects
   everything).
