# Synthexiq SaaS Build Pack

This build pack contains everything needed to extend Synthexiq with 7 enterprise
workflow products built on gstack's MIT-licensed skill primitives.

## What's In This Pack

```
synthexiq-buildpack/
├── skills/           → Markdown skill files for Synthexiq Skill Creator
├── workflows/        → Workflow definitions (step-by-step orchestration specs)
├── pages/            → Landing page copy + structure for each product
├── ui/               → Dashboard, run-view, report-view component specs
├── integrations/     → GitHub App, Playwright, Docker sandbox, Slack specs
├── pricing/          → Pricing tiers, trial rules, bundle discounts
└── roadmap/          → 12-week implementation plan with sprint breakdown
```

## 7 Products to Build

| # | Product | Path | Monthly Price |
|---|---|---|---|
| 1 | Security Continuous (CISO) | /ciso | $4,000/org |
| 2 | Compliance Autopilot | /compliance | $999–$8,000/org |
| 3 | Ship-Ready Pipeline | /ship | $2,500/team |
| 4 | Incident Commander | /incident | $3,000/team |
| 5 | Founder Sprint | /founder | $1,500/seat |
| 6 | Diligence AI | /diligence | $25,000 one-off |
| 7 | Vertical OS Bundles | /bundles | $5,000–$15,000/org |

## Quick Start

1. Import all files from `/skills` into Synthexiq Skill Creator
2. Build workflows in `/workflows` using Synthexiq Workflow Orchestration
3. Stand up integrations per `/integrations` specs
4. Deploy landing pages per `/pages` specs
5. Configure pricing per `/pricing/access-model.md`
6. Follow `/roadmap/12-week-plan.md` for build sequence

## Core Dependencies

- Anthropic API (Claude Opus 4.8 recommended for all agent roles)
- Playwright service (browser automation — see integrations/playwright.md)
- GitHub App (code review + ship pipeline — see integrations/github-app.md)
- Docker sandbox (code execution — see integrations/docker-sandbox.md)
- Vector DB (knowledge base — likely already in Synthexiq)

## License

Skills derived from garrytan/gstack (MIT License).
Product design, workflows, and UI specs are proprietary to Synthexiq.
