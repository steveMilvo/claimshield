# Opus Build Brief — Synthexiq SaaS Expansion

You are being handed a complete build pack to extend Synthexiq with 7 enterprise
SaaS products. Your job is to implement them in order, producing working,
testable, paying-customer-ready increments each week.

## Read These First (in this order)

1. `synthexiq-buildpack/README.md` — index of the whole pack
2. `synthexiq-buildpack/roadmap/12-week-plan.md` — the build sequence you'll follow
3. `synthexiq-buildpack/pricing/access-model.md` — what the customer experience must be
4. All 8 files in `synthexiq-buildpack/skills/` — the agent prompts
5. All 4 files in `synthexiq-buildpack/workflows/` — the orchestrations
6. All 3 files in `synthexiq-buildpack/integrations/` — the engineering work

## Your Mission

Ship Compliance Autopilot to a first paying AU customer by end of Week 4.
Then expand to 7 products by Week 12. Use the existing Synthexiq platform
(9 modules: Agent Builder, Skill Creator, Workflow Orchestration, Memory,
API Connector, Knowledge Base, etc.). Do not build a new platform.

## Platform You're Building On

- **Synthexiq** — existing agentic platform (synthexiq.com), single-domain
  path-based product structure (/compliance, /ciso, /ship, /incident, etc.)
- **Anthropic API** — primary LLM. Default to `claude-opus-4-7` for
  agent execution, `claude-haiku-4-5-20251001` for fast/cheap classifier tasks
  and `claude-sonnet-4-6` for everything in between
- **Stripe** — billing
- **PostgreSQL** — primary store (assumed already in Synthexiq)
- **Vector DB** — knowledge base (assumed already in Synthexiq)

## What You Need to Build (Engineering)

Three integration services, in order of priority:

1. **GitHub App + webhook handler** — `synthexiq-buildpack/integrations/github-app.md` has working code. Stand up the webhook handler, register the app, install on test repo. Without this, nothing else works for code-related products.

2. **Playwright service** — `synthexiq-buildpack/integrations/playwright-service.md` has working `server.js`. Required for QA Testing, Design Critique, and any browser-based workflows. Run behind private network, never expose to internet.

3. **Docker sandbox orchestrator** — `synthexiq-buildpack/integrations/docker-sandbox.md` has working code. Required for QA to actually execute test suites. Build the three base images (Node, Python, Ruby) first.

Each integration exposes tools to Synthexiq via the API Connector. The tool
schemas are in the integration files — register them exactly as specified.

## What You Need to Configure (No Engineering)

These take minutes, do them first:

- Import all 8 skill files from `synthexiq-buildpack/skills/` into Synthexiq's
  Skill Creator. The YAML frontmatter maps to Synthexiq skill metadata.
- Create 6 agents in Agent Builder: CEO Agent, CISO Agent, Compliance Agent,
  Engineering Manager, QA Lead, Tech Writer Agent, Incident Commander Agent,
  Designer. Assign skills per the `agents:` field in each skill file.
- Load AU compliance standards into the Knowledge Base:
  - NDIS Practice Standards 2021
  - Aged Care Quality Standards 2019
  - Privacy Act 1988 (Australian Privacy Principles)

## Hard Rules

1. **Ship-Ready before code review** — eat your own cooking. Use the
   Ship-Ready workflow on the Synthexiq codebase itself from Week 3 onward.

2. **No new platforms** — every new capability goes into Synthexiq's existing
   modules. If you find yourself building a new orchestrator, stop and use
   Workflow Orchestration instead.

3. **Path-based products, not subdomains** — every product lives at
   `synthexiq.com/<product>`. Single login. One dashboard shows everything.

4. **Lite tier never disappears** — when a trial ends, the product
   downgrades to lite, never to "no access". Read the access model file
   for the exact lite-tier limits per product.

5. **Compliance first** — do not build CISO or Ship-Ready landing pages
   before Compliance Autopilot has a paying customer. The roadmap order
   is the order. Don't optimise for engineering aesthetics over revenue.

6. **AU market entry** — Compliance Autopilot is positioned for AU
   (NDIS, Aged Care, Privacy Act). Use Australian English in all
   customer-facing copy. Pricing in AUD.

## Decision Authority

- **Auto-decide** anything that is mechanical (file paths, library choices,
  refactoring, formatting, test coverage)
- **Auto-decide** anything that's taste-level but reasonable (UX micro-copy,
  notification timing defaults, lite-tier specific limits)
- **Ask the user** for:
  - Brand naming changes (don't rename Synthexiq without approval)
  - Pricing changes (the file has specific dollar amounts — don't change them without approval)
  - Any deviation from the 12-week roadmap order
  - Decisions to skip a product
  - Anything affecting the Anthropic API cost model
  - Architectural decisions that affect more than one product

## Success Criteria

**End of Week 4:**
- [ ] Compliance Autopilot live at synthexiq.com/compliance
- [ ] Stripe billing functional (Starter / Business / Enterprise plans)
- [ ] 14-day no-card trial flow working
- [ ] Daily check + audit pack both working on real data
- [ ] At least 1 paying customer in NDIS or Aged Care vertical

**End of Week 8:**
- [ ] Security Continuous live at synthexiq.com/ciso
- [ ] Ship-Ready live at synthexiq.com/ship
- [ ] Incident Commander live at synthexiq.com/incident
- [ ] Cross-product upgrade prompts firing
- [ ] $20k MRR

**End of Week 12:**
- [ ] All 7 products live
- [ ] Diligence AI one-off purchase flow working (Stripe checkout)
- [ ] Real Estate / Aged Care / NDIS OS bundles installable in one click
- [ ] Master dashboard showing all products + lite tiers + upgrade prompts
- [ ] $50k MRR

## How to Report Progress

After each completed roadmap week, produce:

```
Week N Report
─────────────
Shipped:
  - [thing] — [link or commit ref]

In progress:
  - [thing] — [% complete]

Blocked:
  - [thing] — [what's needed]

Decisions made (auto-decided):
  - [decision] — [one-line rationale]

Decisions needing user input:
  - [question]

Revenue this week:
  - New customers: N
  - MRR delta: $X
  - Total MRR: $X

Next week's focus:
  - [item from roadmap]
```

## Tools Available to You

You have full access to:
- Read, Edit, Write — file operations
- Bash — for running tests, git, deployment commands
- WebFetch — for researching APIs, libraries, standards
- Anthropic API — to test agent behaviour
- Synthexiq dashboard (manual configuration of skills, agents, workflows)
- Stripe dashboard (billing setup)
- GitHub (the repo you're committing to)

## Code Quality Bar

- Every PR runs through the Ship-Ready pipeline (once Week 2 is done)
- Every commit follows conventional commits format
- No commented-out code in main
- Type checking + tests must pass before merge
- Security: never commit `.env`, never expose secrets, never run untrusted code outside the Docker sandbox

## Start Now

Begin by reading `synthexiq-buildpack/roadmap/12-week-plan.md` Week 1, then
read `synthexiq-buildpack/integrations/github-app.md` and `synthexiq-buildpack/integrations/playwright-service.md`.

Confirm scope by replying with:
1. Your understanding of what you're shipping in Week 1
2. Any blockers or missing access you need before starting
3. Your first three concrete actions

Then proceed.
