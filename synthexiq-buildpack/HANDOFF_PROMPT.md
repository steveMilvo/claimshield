# Copy-Paste Handoff Prompt for Opus

Use this exact prompt to hand the build pack to a fresh Opus session
(Claude Code, web app, or API). It is self-contained — Opus needs no
prior context from this conversation.

---

## THE PROMPT (copy below this line)

You are taking over an active SaaS build for **Synthexiq** (synthexiq.com),
an existing agentic platform that operates similar to Claude Code but
runs directly on the Anthropic API.

Your job is to ship 7 enterprise SaaS workflow products by extending
Synthexiq's existing 9 modules (Agent Builder, Skill Creator, Workflow
Orchestration, Memory System, API Connector, Knowledge Base, plus
plug-and-play industry bundles).

Everything you need is in the `synthexiq-buildpack/` directory of this
repository. The complete build brief, including:

- 8 production-ready agent skill files (Code Review, Security Audit,
  QA Testing, Sprint Planner, AU Compliance Audit, Incident Commander,
  Diligence AI, Founder Sprint)
- 4 multi-step workflow orchestration specs (Ship-Ready Pipeline,
  Compliance Autopilot, Incident Commander, Security Continuous)
- 3 integration specs with working code (Playwright browser service,
  GitHub App + webhooks, Docker code execution sandbox)
- Complete pricing model with trials, lite tiers, bundle discounts
- 12-week implementation roadmap with revenue milestones

**Start by reading `synthexiq-buildpack/OPUS_BRIEF.md`** — that file has
your full mission brief, hard rules, decision authority, success criteria,
and reporting format.

Then read the files in this order:
1. `synthexiq-buildpack/README.md`
2. `synthexiq-buildpack/roadmap/12-week-plan.md`
3. `synthexiq-buildpack/pricing/access-model.md`
4. All 8 files in `synthexiq-buildpack/skills/`
5. All 4 files in `synthexiq-buildpack/workflows/`
6. All 3 files in `synthexiq-buildpack/integrations/`

## Constraints

- **Anthropic API only** — do not introduce OpenAI, Gemini, or other LLM
  providers. Default model: `claude-opus-4-7`. Use `claude-haiku-4-5-20251001`
  for cheap classifier tasks, `claude-sonnet-4-6` for mid-tier.
- **Build on Synthexiq's existing platform** — do not create a new agent
  orchestrator, skill registry, or memory layer.
- **Path-based products** — every product lives at `synthexiq.com/<product>`,
  not subdomains. Single login, one dashboard.
- **AU market focus for Compliance Autopilot** — Australian English,
  AUD pricing, NDIS / Aged Care / Privacy Act 1988 standards.
- **Lite tiers are permanent** — when a trial ends, products downgrade
  to a hobbled-but-functional tier, never disappear.
- **Compliance first** — do not build CISO or Ship-Ready landing pages
  before Compliance Autopilot has a paying customer.

## What's Already Decided (don't re-litigate)

- Single-domain path-based product structure
- The 7 products and their target prices (in `pricing/access-model.md`)
- The 14-day no-credit-card trial model
- Bundle discounts: 20% / 30% / 40% off at 2 / 3 / 4+ products
- The 12-week build sequence

## What's Open for You to Decide

- Implementation details (file structure, library choices, deploy targets)
- UX micro-copy and notification timing defaults
- Specific lite-tier limit values within reason
- Test coverage approach and tooling
- Any technical trade-off that doesn't change pricing, scope, or sequence

## What Requires User Approval

- Renaming Synthexiq or any product
- Changing pricing
- Skipping a product
- Deviating from the 12-week roadmap order
- Architectural decisions affecting more than one product
- Anything that materially affects Anthropic API cost

## Your First Reply

After reading the brief and supporting files, respond with:

1. **Your understanding** of Week 1's goal in one paragraph
2. **Any blockers** — access you need, decisions you need clarified
3. **Your first three concrete actions** (e.g., "Register GitHub App at github.com/settings/apps/new", "Build webhook handler in services/github-webhook/", "Import skill files into Synthexiq")

Then proceed to ship. Report progress at the end of each completed roadmap
week using the format specified in OPUS_BRIEF.md.

## Quality Bar

- Conventional commits
- Type checking + tests pass before merge
- Never commit secrets
- Use the Ship-Ready pipeline on yourself once Week 2 is complete
- Production code only — no stubs, no TODOs in shipped paths
