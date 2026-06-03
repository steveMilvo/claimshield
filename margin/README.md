# Margin

**The AI that builds a longitudinal, dimension-level model of how each student's _writing_ is developing — and turns every draft into targeted, faded practice that moves a real skill.**

Most tools grade an essay and stop. Margin treats the grade as the *thermostat* and the
practice loop as the *furnace*: it diagnoses a piece on every analytic-rubric trait, picks the
single highest-leverage move within the student's Zone of Proximal Development, teaches it with a
faded worked example, sends the student back to revise their own draft, and only counts a skill as
**mastered** when it **transfers to a new, unpractised prompt**.

This folder is the MVP for the **middle-school (Year 7–9) writing** tier, anchored to the
**NAPLAN** analytic writing rubric (AU), designed to port to NZ e-asTTle and US 6+1 Traits.

---

## The core loop

```
 Draft ──▶ Diagnose ──▶ Practise ──▶ Revise ──▶ Prove
   ▲           │            │           │          │
   └───────────┴── student writing model (per-trait Elo + misconception tags) ──┘
```

- **Draft** — a focused writing surface (`/write/[taskId]`).
- **Diagnose** — `POST /api/diagnose` scores every rubric trait, grounded in verbatim spans of the
  student's text, and tags misconceptions from a curated taxonomy.
- **Practise** — `POST /api/practice` builds a faded worked-example ladder
  (*worked example → faded → independent*) for one misconception.
- **Revise** — the student takes the move back into their own draft and re-checks.
- **Prove** — mastery requires sustained performance on **cold-write transfer prompts**, not the
  one that was practised.

## Pedagogy (named, evidence-based)

Formative assessment (Black & Wiliam) · worked-example effect & fading (Sweller, Renkl) ·
Zone of Proximal Development (Vygotsky) · mastery learning (Bloom) · deliberate practice (Ericsson) ·
transfer-gated evidence of mastery · spacing for conventions.

## Architecture (this MVP)

| Concern | Where |
|---|---|
| Analytic rubric (NAPLAN-aligned) + leverage weights | `src/lib/rubric.ts` |
| Misconception taxonomy | `src/lib/taxonomy.ts` |
| Student model (Elo updates, transfer-gated mastery, **ZPD focus selection**) | `src/lib/studentModel.ts` |
| Evaluator / scorer (LLM-as-judge + deterministic mock) | `src/lib/scoring.ts` |
| Faded worked-example generator (LLM + hand-authored mock ladders) | `src/lib/practice.ts` |
| API routes | `src/app/api/diagnose`, `src/app/api/practice` |
| Writing studio | `src/components/Studio.tsx` |
| Teacher class model | `src/app/teacher/page.tsx` |
| Server persistence (driver dispatch: JSON local / Postgres in prod) | `src/lib/server/store.ts`, `storeJson.ts`, `storePg.ts` |
| Identity / sessions + Google OAuth scaffold | `src/lib/server/identity.ts`, `src/app/api/auth/*` |
| Sign-in / roster | `src/app/signin/page.tsx` |
| Safeguarding triage (rules + optional LLM) + escalation | `src/lib/safeguarding.ts`, `src/app/api/alerts` |

### Safeguarding

A writing tool receives disclosures of harm. Margin runs a triage **before** scoring
(`src/lib/safeguarding.ts`): a deterministic rules net (always on) plus an optional LLM
classifier (when a key is set), taking the higher severity of the two.

- **Urgent** (active self-harm/suicidal intent, current abuse, credible threat): the AI's
  feedback is **suppressed**, the student sees a calm, non-clinical check-in with AU/NZ crisis
  lines, and a **teacher/DSL alert** is raised. The AI never counsels.
- **Concern**: feedback is still given (so the student isn't singled out), and a silent alert is
  raised for review.
- Alerts surface at the top of the teacher dashboard with the flagged passage and a
  *mark-reviewed* action. The human safeguarding lead always decides what happens next.

### LLM vs mock

The app runs **fully offline on a deterministic mock scorer** so the entire UX is demoable with no
key. Set `ANTHROPIC_API_KEY` (and optionally `MARGIN_MODEL`) in `.env.local` to switch on the
calibrated Claude judge for `/api/diagnose` and `/api/practice`. Both routes fall back to the mock
on any error so the loop never hard-fails.

> ⚠️ The mock scorer is a heuristic stand-in for demos — **not** the product's assessment engine.
> The real scorer is the calibrated LLM judge, and its reliability is the riskiest assumption (see
> roadmap). Do not cite mock scores as evidence of learning.

## Run it

```bash
cd margin
npm install
cp .env.example .env.local   # optional — add ANTHROPIC_API_KEY for the real judge
npm run dev                  # then open http://localhost:3100 in your browser
```

> Windows PowerShell: run the commands on separate lines (old PowerShell has no `&&`).
> The dev server does **not** auto-open a browser — go to `http://localhost:3100` yourself.

### Calibration harness (no browser needed)

The most important script in the repo. Measures how closely the scorer agrees with
human marks, per rubric trait — the go/no-go gate that must clear before the student
model can be trusted. Prints a table to your terminal:

```bash
npm run calibrate
```

Runs on the deterministic mock by default; set `ANTHROPIC_API_KEY` in `.env.local` to
calibrate the real Claude judge. Uses `fixtures/anchor-scripts.json` (illustrative seed
data — swap in a double-marked corpus of real scripts for a real readiness decision).

## Deploying

See [DEPLOY.md](./DEPLOY.md). Short version: deploy on **Railway** (set Root Directory to
`margin`, add the PostgreSQL plugin, reference its `DATABASE_URL`, add `ANTHROPIC_API_KEY`) or
**Vercel + Neon**. `railway.json` and a `PORT`-aware start command are committed. With no
`DATABASE_URL` it runs on the local JSON store — no database needed for dev.

## What's deliberately NOT here yet (roadmap)

- **Scorer calibration harness** — the kill-switch experiment: measure LLM-judge agreement with
  human NAPLAN markers (target quadratic-weighted κ ≥ ~0.6 per trait) **before** trusting the model.
- Google Classroom roster import (the OAuth login is done; roster sync is next).
- Encrypted/signed sessions (NextAuth or iron-session) to replace the base64 session cookie.
- Oral composition (Whisper STT) for the primary tier; senior exam-prep tier.
- Spaced retrieval scheduling for conventions; process/keystroke capture for academic integrity.
- Safeguarding: per-class escalation routing to the named DSL, audit export, and tuning the
  detector with a safeguarding lead (the current rules are a conservative starting net).

See the design doc in the conversation history for the full three-tier product, GTM, and risk
analysis.
