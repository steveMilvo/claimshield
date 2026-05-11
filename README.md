# ClaimShield

> Your AI-powered insurance claim negotiator.
> Fighting back, automatically.

This is the consumer web UI for ClaimShield (MilvoTech Pty Ltd). It scaffolds the MVP user experience described in the product positioning doc:

- **Landing page** — brand intro, how it works, pricing, FAQ.
- **/start** — guided claim flow: upload policy → describe loss → upload insurer letter → run analysis.
- **/analysis/[id]** — results: recoverable upside, findings, comparables, next steps, ClaimShield Score, generated appeal letter.
- **/legal** — disclaimers and data-handling notes.

Built with Next.js (App Router), TypeScript, Tailwind CSS. Analysis is currently powered by mock data (`src/lib/mockAnalysis.ts`) so the flow is clickable end-to-end without a backend.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's next

- Wire the upload step to a real parsing backend (LegisPro / SynthexIQ orchestration).
- Replace `mockAnalysis` with live results from the analysis API.
- AFCA complaint submission integration.
- Auth + saved cases.
