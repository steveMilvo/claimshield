# ClaimShield

> Your AI-powered insurance claim negotiator.
> Fighting back, automatically.

This is the consumer web UI for ClaimShield (MilvoTech Pty Ltd). It scaffolds the MVP user experience described in the product positioning doc:

- **Landing page** — brand intro, how it works, pricing, FAQ.
- **/start** — guided claim flow: upload policy → describe loss → upload insurer letter → run analysis.
- **/analysis/[id]** — results: recoverable upside, findings, comparables, next steps, ClaimShield Score, generated appeal letter.
- **/cases** — saved-case dashboard. Each completed analysis is stored locally (browser `localStorage`) so you can reopen it later; cards show insurer, ClaimShield Score, and recoverable upside, with delete.
- **/legal** — disclaimers and data-handling notes.

Built with Next.js (App Router), TypeScript, Tailwind CSS. The `/start` flow uploads the policy + insurer letter to `POST /api/analyze`, which calls the Claude API (`claude-opus-4-7`, structured outputs) to parse the documents and produce the analysis; the result is saved to the local case store and shown at `/analysis/<id>`. `/analysis/demo` shows a static sample (`src/lib/mockAnalysis.ts`).

## Getting started

```bash
npm install
cp .env.example .env.local   # then set ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000. Without `ANTHROPIC_API_KEY`, `/start` will return an error on submit — `/analysis/demo` still works offline.

## What's next

- Move the case store server-side behind auth (currently `localStorage`, per-browser).
- Generate real downloadable documents (DOCX) from the appeal/demand/complaint text.
- AFCA complaint submission integration.
- Stripe for the pricing tiers.
