# 12-Week Implementation Roadmap
# Build sequence for Synthexiq SaaS products

## Guiding Principles
- Ship something customers can pay for by end of Week 4
- Each week produces a working, testable increment
- Integrations before products — a product without integrations is a demo, not a service
- Compliance Autopilot first — clearest AU market fit, fastest enterprise close

---

## Weeks 1–2: Foundation

### Week 1
**Goal:** Synthexiq can talk to GitHub and run agents on real code

- [ ] Register GitHub App (30 min)
- [ ] Build webhook handler (integrations/github-app.md)
- [ ] Implement github_get_diff, github_post_comment, github_update_status tools
- [ ] Register tools in Synthexiq API Connector
- [ ] Import all 8 skill files into Synthexiq Skill Creator
- [ ] Smoke test: open a PR → Synthexiq receives webhook → Code Review skill runs → comment posted

**Deliverable:** Code Review runs end-to-end on a real repo

### Week 2
**Goal:** Add browser and code execution capabilities

- [ ] Stand up Playwright service (integrations/playwright-service.md)
- [ ] Register browser tools in Synthexiq API Connector
- [ ] Stand up Docker sandbox (integrations/docker-sandbox.md)
- [ ] Register sandbox_run tool
- [ ] Smoke test: QA Testing skill runs npm test in sandbox, posts results
- [ ] Build basic Ship-Ready workflow (workflows/01-ship-ready-pipeline.md)

**Deliverable:** Ship-Ready pipeline runs end-to-end

---

## Weeks 3–4: First Paid Product

### Week 3
**Goal:** Compliance Autopilot — daily check workflow working

- [ ] Build Compliance Autopilot Workflow A (daily check) in Workflow Orchestration
- [ ] Connect to a test records system via API Connector
- [ ] Configure NDIS and Aged Care standards in Knowledge Base
- [ ] Build alert routing (Slack + email)
- [ ] Smoke test: daily check runs, finds a gap, sends alert

**Deliverable:** Compliance daily check working on real data

### Week 4
**Goal:** Compliance Autopilot — audit pack + launch

- [ ] Build Compliance Autopilot Workflow B (full audit pack)
- [ ] Build PDF report generation
- [ ] Build Compliance landing page (/compliance)
- [ ] Set up Stripe for billing
- [ ] Set up trial activation flow (14-day, no credit card)
- [ ] **LAUNCH: Compliance Autopilot** — reach out to 10 NDIS/Aged Care contacts

**Deliverable:** First paying customer can sign up and use Compliance Autopilot

---

## Weeks 5–6: Security Product

### Week 5
**Goal:** Security Continuous — full 14-phase audit working

- [ ] Build Security Continuous Workflow C (weekly full audit)
- [ ] Connect CVE database API (NVD or Snyk API)
- [ ] Build weekly report generation
- [ ] Build executive summary section (CEO Agent skill)

### Week 6
**Goal:** Security Continuous — continuous monitoring + launch

- [ ] Build Workflow A (daily dependency scan)
- [ ] Build Workflow B (PR light scan — posts to GitHub status checks)
- [ ] Build Workflow D (monthly executive report)
- [ ] Build /ciso landing page
- [ ] Set up trial activation for CISO product
- [ ] **LAUNCH: Security Continuous**

**Deliverable:** Security Continuous live, first trial signups

---

## Weeks 7–8: Dev Team Products

### Week 7
**Goal:** Ship-Ready as a standalone product

- [ ] Polish Ship-Ready workflow (gates, notifications, auto-fix)
- [ ] Build /ship landing page
- [ ] Add Ship-Ready to Stripe billing
- [ ] Build cross-sell prompt: "Code Review subscriber? Try Ship-Ready free."

### Week 8
**Goal:** Incident Commander

- [ ] Build Incident Commander workflow (workflows/03-incident-commander.md)
- [ ] Connect monitoring webhooks (Datadog/PagerDuty via API Connector)
- [ ] Build parallel hypothesis sub-agent orchestration
- [ ] Build /incident landing page
- [ ] **LAUNCH: Incident Commander**

---

## Weeks 9–10: Platform & Dashboard

### Week 9
**Goal:** Unified dashboard with cross-sell built in

- [ ] Build master dashboard (UI spec: ui/dashboard.md)
- [ ] Show all products: subscribed / trialling / lite / untrialled
- [ ] Build lite tier usage meters and upgrade prompts
- [ ] Build 14-day trial activation flow (one-click, no card)
- [ ] Build trial-to-paid conversion emails (day 12, day 14)
- [ ] Build bundle discount logic in Stripe

### Week 10
**Goal:** Cross-product data sharing + upgrade trigger events

- [ ] Security score feeds into Compliance dashboard
- [ ] Ship-Ready failures trigger Incident Commander history entry
- [ ] Build cross-product alert: "Security found issues — Ship-Ready can fix them"
- [ ] Build upgrade trigger events (lite limit hit, trial day 12, feature gate)
- [ ] Build /pricing page with interactive plan selector

---

## Weeks 11–12: Vertical OS Bundles + Diligence AI

### Week 11
**Goal:** Diligence AI one-off product

- [ ] Build Diligence AI workflow (manual trigger, full scan)
- [ ] Build renovation cost estimator (pulls from security + code review)
- [ ] Build PDF report generation (board-ready format)
- [ ] Build /diligence landing page (one-off purchase via Stripe)
- [ ] Build Founder Sprint product (/founder landing page + workflow)

### Week 12
**Goal:** Vertical OS bundles as installable packages

- [ ] Package Real Estate OS: 9 agents + 15 skills + 5 workflows as one-click install
- [ ] Package Aged Care OS: existing + compliance + incident skills
- [ ] Package NDIS OS: existing + NDIS compliance + incident skills
- [ ] Build /bundles landing page with industry selector
- [ ] Build one-click bundle install (creates agents, skills, workflows automatically)
- [ ] **LAUNCH: Vertical OS bundles**

---

## Post-Week 12 Backlog (prioritise by revenue)

- Mobile QA (iOS/Android — requires physical device farm or BrowserStack)
- Annual billing (2 months free)
- SSO / SAML (Enterprise tier gate)
- On-prem deployment option
- Custom standard builder (let customers define their own compliance standards)
- Multi-workspace / MSP tier (manage multiple client orgs from one account)
- API access tier (let customers call Synthexiq workflows via their own code)

---

## Revenue Milestones

| End of Week | Target | How |
|---|---|---|
| 4 | $5k MRR | 2 Compliance Autopilot Business plan customers |
| 8 | $20k MRR | Compliance + CISO + Ship-Ready + first enterprise |
| 12 | $50k MRR | All 7 products live, bundle discounts driving expansion |
| Month 6 | $150k MRR | Vertical OS bundles + enterprise contracts + Diligence AI |

---

## Team Required

| Role | Weeks | Notes |
|---|---|---|
| Full-stack developer | 1–12 | Integrations + workflow builder + dashboard UI |
| Claude Code / AI assist | 1–12 | Use Ship-Ready on itself — eat your own cooking |
| Sales / founder | 4–12 | Compliance customers first — warm outreach, not ads |
| Compliance specialist | 5–12 | AU regulations expertise for NDIS/Aged Care content |
