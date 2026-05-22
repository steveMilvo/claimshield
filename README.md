# Founder Tax Blueprint

> AI-powered tax structure and exit planning for Australian entrepreneurs.
> A MilvoTech Pty Ltd product · A SynthexIQ Ecosystem product.

This is the consumer web UI for Founder Tax Blueprint. It generates comprehensive scenario-based tax structuring reports for Australian founders, modelled against their specific circumstances and chosen exit strategy under current AU tax law including the 2026–27 Federal Budget changes.

## What it does

- **Landing page** (`/`) — product overview, the structuring problem, how it works, what's in the report, FAQ.
- **Guided questionnaire** (`/start`) — 6 sections, ~33 questions covering personal context, business idea, financial projections, growth/capital/international, exit strategy, and preferences.
- **Generate report** (`POST /api/generate-report`) — runs the codified tax rule engine against the answers, then calls Claude to produce a structured 9-section JSON report.
- **Report viewer** (`/report/[id]`) — renders the report with structure matrix, exit analysis, irreversibility map, action checklist, accountant brief, and full disclaimers. Print-friendly.
- **Legal** (`/legal`) — TASA-compliant disclaimers.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Anthropic SDK.

## Architecture

- **Tax rule engine** (`src/lib/taxRules.ts`) — codified ATO rates, thresholds, and concessions. Individual marginal rates (2026–27 with legislated cuts), company tax (25%/30%), CGT pre- and post-2027 (indexation + 30% minimum rate), Division 152 eligibility, DTA withholding rates.
- **Claude API** generates narrative and scenario analysis only — never the numbers. All figures come from the rule engine, baked into the prompt.
- **No database** — reports are stored in `localStorage` per browser. Suitable for the MVP; move server-side behind auth for production.

## Getting started

```bash
npm install
cp .env.example .env.local   # then set ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3100. Without `ANTHROPIC_API_KEY`, the `/start` flow will return an error on submit.

## Important — Professional Use

All reports constitute **general information only** and do not constitute personal tax advice or a tax agent service under the Tax Agent Services Act 2009 (Cth). MilvoTech Pty Ltd is not a registered tax agent. Reports are designed to be used by registered tax agents, or provided by end users to a TPB-registered tax agent for professional review before any action is taken.

## Roadmap

- Streaming report generation (currently 3–4 minute synchronous response)
- Server-side report persistence with user auth
- B2B Practice Edition (white-label for accounting firms)
- Quick Compare free tier (sole trader vs Pty Ltd snapshot)
- PDF export with branded template
