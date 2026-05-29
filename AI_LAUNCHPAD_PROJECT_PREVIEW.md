# AI Launchpad — What We Built (Project Preview)

**Branch:** `claude/bold-brahmagupta-CzPNY`
**Repo (note: needs to move):** `stevemilvo/claimshield`
**Total lines added:** **8,187** across **14 files**
**Build time:** this session
**Status:** Spec library complete. No code shipped. Ready for handover to Cowork to implement against the SynthexIQ codebase.

---

## 30-second summary

A 21-module NDIS-funded eLMS that uses ChatGPT / Claude / Gemini to help disabled adults start and run real microbusinesses. Every learning activity produces real billable evidence for Capacity Building — Skill Development claims. 63 templates make the 50-participant SW caseload sustainable. Three pathways open after graduation. Built to extend the existing SynthexIQ agent platform, not replace it.

---

## Commit journey (9 commits, in order)

```
1. e3f6df6  Add AI Launchpad LMC v3 Modules 05–23 with full NDIS billing framework
2. 0ee9a9c  Add SynthexIQ capability audit spec for AI Launchpad LMS
3. be3f77a  Restructure v3: replace Compliance Agent with Mastery & Life Library
4. a75ba42  Add SynthexIQ LMC build specs: Priority 1-5 migrations, trigger router, Opus brief
5. 194b552  Add Module 04B — AI Tools Tour (bridge from Module 04 to Module 05)
6. 06ad3d0  Add 63 SW reply template library for AI Launchpad LMC touchpoints
7. b493d28  Strip Replit identifiers; add web-client and SW dashboard specs
8. b93a7ea  Complete LMC spec library: NDIA export, local SW visits, alumni pathways
9. 7e3189c  Add Railway deploy spec for SynthexIQ
```

---

## What's in the repo

```
AI_Launchpad_LMC_v3_Modules_05-24.md     4,179 lines   ← the curriculum
SynthexIQ_Capability_Audit.md              193 lines   ← original capability audit
synthexiq-lmc-specs/                     3,815 lines   ← build pack for Cowork
├── README.md                              176 lines     index of everything
├── CAPABILITY_AUDIT_REVISED.md            199 lines     what exists vs to build
├── OPUS_BRIEF.md                          243 lines     Priority 1–5 build brief
├── WEB_CLIENT_MODULE_PAGE_SPEC.md         296 lines     participant front-end
├── SW_CASELOAD_DASHBOARD_SPEC.md          414 lines     SW dashboard
├── SW_REPLY_TEMPLATES.md                  669 lines     63 SW reply templates
├── NDIA_AUDIT_EXPORT_SPEC.md              284 lines     NDIS audit export format
├── LOCAL_SW_ACTIVATION_SPEC.md            308 lines     field visit workflow
├── ALUMNI_PATHWAYS_SPEC.md                314 lines     graduation + pathways
├── RAILWAY_DEPLOY_SPEC.md                 328 lines     Railway deploy guide
├── drizzle/
│   ├── 0012_billing_events.sql             42 lines     billing + crisis tables
│   ├── 0013_participant_modules.sql        24 lines     module state
│   ├── 0014_participant_consents.sql       26 lines     APP consent records
│   ├── 0017_local_sw_visits.sql            85 lines     local SW + visits + travel
│   └── 0018_alumni_records.sql             44 lines     alumni + check-ins
└── server/lmc/
    └── triggerRouter.ts                   388 lines     slash command router
```

---

## The curriculum (Module 04B + 20 official + 6 opt-in)

```
FOUNDATION (must complete before Module 05)
└── 04B — AI Tools Tour
        Bridge to Steve's Modules 01-04. Sets up ChatGPT + Claude/Gemini
        accounts, voice input, 5 Golden Safety Rules with sync SW sign-off.

PART 1 — Microenterprise Library (8 modules, 05-12)
├── 05 — Selling Online
├── 06 — Product Photos & Descriptions
├── 07 — Pricing My Stuff
├── 08 — Social Media 101
├── 09 — My First Sale
├── 10 — Money Basics
├── 11 — Growing My Business        (local SW field visit at TP-C)
└── 12 — My Business Review          (group workshop at TP-C)

PART 2 — Affiliate Library (5 modules, 13-17)
├── 13 — Affiliate Marketing Basics
├── 14 — Choose Your Products
├── 15 — Social Media for Affiliates
├── 16 — Community Networking        (local SW field visit at TP-B)
└── 17 — Track and Grow

PART 3 — Mastery & Life Library (7 modules, 18-24)
├── 18 — Customer Care with AI       (business deepening)
├── 19 — AI Reading Buddy            🟢 LIFE: decode any scary letter
├── 20 — Your Online Home            (real website via Carrd/Wix AI/Framer)
├── 21 — Hard Conversations & Self-Advocacy  🟢 LIFE
├── 22 — AI for Health & Wellbeing   🟢 LIFE: GP prep, glossary, reminders
├── 23 — Telling Your Story          (about-me + peer-support signpost)
└── 24 — Graduation: Your Next 12 Months

PART 4 — Optional Pathway: Compliance Agent (Affiliate) — opt-in, post-graduation
├── CA-01 — Understanding NDIS Compliance
├── CA-02 — Running an AI Audit Scan
├── CA-03 — Pricing & Closing the Deal
├── CA-04 — Managing Compliance Clients
├── CA-05 — Field Compliance Tools
└── CA-06 — Selling the Full Stack
```

Each module has the same 8-section structure: Goal · 15s intro video prompt · What to Do (5 steps) · What You Will Make · Open Activity with real AI prompts · 3 Billable Touchpoints · Bot Help · Check-In · Quiz. Plus an "AI Superpower" sidebar naming what's newly possible for a participant with a disability.

---

## The billing model (the heart of the design)

```
50 participants per SW
× 2.5 billable events per participant per week
= 125 events per SW per week
÷ 38 hours
= 18 minutes per event average

3 touchpoints per module
× 21 modules
= 63 trigger phrases
× 1 SW reply template each
= 63 templates in the SW library
```

Every billable interaction:
1. Participant types `/submit_modNN_x` in Telegram
2. SynthexIQ bot stamps `triggered_at` in `billing_events` table
3. Bot notifies the assigned SW
4. SW opens the matching template (TP-NN-X), customises, sends
5. Bot stamps `closed_at`, computes `duration_seconds`
6. Bot advances `participant_modules` state; unlocks next module when all 3 touchpoints close
7. Weekly: CSV export with HMAC-SHA256 tamper signature, NDIS line item codes, all required NDIA columns

NDIS Line Item: **Capacity Building — Skill Development** (code `09_006_0117_6_3` — verify against current price guide).

---

## Safety controls (NDIS critical path)

| Concern | How it's handled |
|---|---|
| Australian data residency | Fly.io Sydney recommended (RAILWAY caveat: no AU region) |
| Crisis detection | Pre-check in Telegram layer BEFORE agent; <5min escalation to on-call SW |
| Consent (APP compliance) | `participant_consents` table, 4 consent types, versioned text, guardian/SW witness support |
| Conflict of interest (Pathway C) | 30-day cooling-off, mandatory verbal disclosure, non-billable triggers, separate check-in officer, pause/exit always available |
| AI getting things wrong | 5 Golden Rules taught in Module 04B; never diagnose / never prescribe; SW fact-checks Reading Buddy translations |
| Data minimisation | Visit addresses obscured to suburb + cross street; PII redacted on certificate verification (`S. K.` not `Sarah Khouri`) |
| Audit retention | 7 years via existing `audit-trail-ndis` skill (already in SynthexIQ Round 5) |
| Worker qualifications | WWVP check + first aid expiry tracked per local SW; expired = no match |

---

## What Cowork has to build (Priority order)

```
PRIORITY 1 — Deploy blocker        (1 hour)
└── Fix agentRunner.ts line 1048

PRIORITY 2 — NDIS billing          (1-2 days)
├── 0012_billing_events.sql migration
├── Slash command router (trigger phrase parser)
├── SW reply detection → close billing_event
└── DB helpers in server/db.ts

PRIORITY 3 — Module progression    (1 day)
├── 0013_participant_modules.sql migration
├── Module unlock logic
├── Heartbeat SLA check (48hr nudge)
└── tRPC endpoints for web client + SW dashboard

PRIORITY 4 — Safety                (1 day)
├── Crisis keyword pre-check in Telegram layer
├── crisis_events table (in 0012 migration)
└── On-call SW notification

PRIORITY 5 — Consent               (1 day)
├── 0014_participant_consents.sql migration
└── Consent gate before first Telegram message processed

PRIORITY 6 — Web client + dashboard (2-3 weeks, parallel)
├── Web client: 21 module pages per spec
└── SW dashboard: 6 pages per spec

PRIORITY 7 — Post-launch hardening (when needed)
├── NDIA audit export (before first NDIA audit window)
├── Local SW activation (before first Module 11 reached)
└── Alumni records (before first Module 24 reached)
```

Estimated MVP-to-first-paying-participant: **3–4 weeks** with one full-time engineer who knows the SynthexIQ codebase.

---

## What's NOT in the build (descoped Bucket 3)

- Voice mode (Whisper STT + TTS) — accessibility unlock for non-typists, but needs separate audio infrastructure
- AI image comparison (Module 06 honesty check — SW reviews manually for now)
- Live caption transcription
- Right-to-erasure self-service flow (manual via privacy officer for now)
- SW caseload mobile native app (web dashboard works on mobile, just not optimised)

---

## Open questions (asked, not yet answered)

1. **Which repo should this live in?** The work was committed to `stevemilvo/claimshield`; you've flagged it should be AI Launchpad.
2. **Railway Singapore or Fly.io Sydney for SynthexIQ deploy?** Railway spec is written; Sydney is the AU-residency-safe option.
3. **Pricing on the Synthexiq buildpack (other branch)** — you flagged Claude's pricing as unrealistic; needs your reset.
4. **Modules 13–17 (Affiliate Library) conflict of interest** — same structural concern as the old 18–23 you asked to move. Want them also relocated to opt-in, or are generic affiliate skills OK because they're transferable?

---

## Sample of what a module looks like (Module 19 — AI Reading Buddy)

> **Goal:** Turn any scary letter (Centrelink, NDIS, landlord, doctor, bill, contract) into plain Year-3 English in under a minute — and know what to do next.
>
> **🟢 AI Superpower:** A participant with dyslexia, low literacy, or English as a second language can now read and act on every official letter that lands in their mailbox. Independence. Wasn't possible 3 years ago — these letters used to require a support worker, a family member, or sit unopened for months.
>
> **The prompt (copy-paste):**
> ```
> You are my Reading Buddy. I find official letters hard to read.
>
> Please:
> 1. Tell me in 1 sentence what this letter is about (Year 3 reading level).
> 2. List the 3 most important things the letter says, as bullet points...
> [full 14-line prompt in the LMC doc]
> ```
>
> **3 Billable Touchpoints:**
> - A — First Decode Review (15 min, async). SW fact-checks every number, date, instruction.
> - B — Action Plan Coaching (10 min, async or voice call). SW confirms the chosen next step.
> - C — Action Complete & Skill Sign-Off (15 min, async + voice note). SW logs Reading Buddy Certified milestone.

---

## How to actually preview this

Three things you can do right now:

1. **Read the markdown.** Every file is plain markdown. Open in any editor or render in any markdown viewer. The LMC document and the spec library are designed to be readable end-to-end.
2. **Push the branch to GitHub web preview.** `claude/bold-brahmagupta-CzPNY` is already pushed. View at `https://github.com/stevemilvo/claimshield/tree/claude/bold-brahmagupta-CzPNY` — GitHub renders all the markdown, including tables and code blocks.
3. **Generate a PDF** if you want a single readable artefact. I can run a markdown-to-PDF conversion on any of the major files (LMC v3 modules, OPUS_BRIEF, SW_REPLY_TEMPLATES) and send the result. Tell me which one(s).

A working app preview won't exist until Cowork lays Priorities 1–6 on top of SynthexIQ and we deploy. That's the next 3–4 weeks of build, not this session's work.
