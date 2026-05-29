# SynthexIQ Capability Audit — Revised After AUDIT_NOTES Review

**Updated:** May 2026 — cross-referenced against `AUDIT_NOTES.md` (Rounds 1–6)
**Purpose:** Show what SynthexIQ already has (✅), what's partially there (🟡), and what still needs building (🔴) for AI Launchpad LMC.

---

## Key Architecture Facts (from AUDIT_NOTES)

- **Stack:** Express + tRPC + React + Drizzle ORM (MySQL) + TypeScript
- **Hosting:** Fly.io — **Sydney region** ✅ resolves J1 (Australian data residency)
- **Telegram:** `telegramWebhook.ts` + `telegramPoller.ts` — full inbound routing working
- **Agent runner:** `server/services/agentRunner.ts` (2000 lines) — DO NOT RESTRUCTURE
- **NDIS bundle:** `server/services/bundles/ndis.ts` — 14 agents, 20 skills, 10 workflows
- **Billing:** Stripe + `billing_subscriptions` table + `pricingTier` enum on users
- **Auth:** JWT (hardened — no hardcoded fallbacks in production)
- **Scheduler:** `heartbeatScheduler.ts` + `monthlyBudgetReset`
- **Migrations:** Drizzle-kit, up to `0011_billing_subscriptions.sql`
- **Env vars:** 38+ documented in `.env.example`

---

## Section A — Core Bot Infrastructure

| # | Capability | Status | Evidence |
|---|---|---|---|
| A1 | Telegram bot 24/7 | ✅ YES | `telegramWebhook.ts`, `telegramPoller.ts`, Fly.io `auto_stop_machines` |
| A2 | Slash command parsing | 🔴 NOT YET | No `/submit_modNN_[a\|b\|c]` router exists — **Priority 2 build** |
| A3 | Free-text vs slash command differentiation | 🟡 PARTIAL | Specialist routing exists; LMC trigger firewall missing |
| A4 | Persistent database | ✅ YES | MySQL + Drizzle ORM |
| A5 | Send text/media on demand | ✅ YES | `sendTelegram()` used throughout |
| A6 | Push notification to specific SW | ✅ YES | Specialist routing by `assignedAgentId` or fallback list |
| A7 | 50+ concurrent learners | 🟡 PARTIAL | No caseload cap tested; Fly.io scales but not validated |

---

## Section B — NDIS Billing Audit Trail (CRITICAL)

| # | Capability | Status | Notes |
|---|---|---|---|
| B1 | Event start timestamp on trigger phrase | 🔴 NOT YET | No trigger phrase system exists — **Priority 2** |
| B2 | Event end timestamp on SW reply | 🔴 NOT YET | Needs SW reply detection hook — **Priority 2** |
| B3 | NDIS line item tag on each event | 🔴 NOT YET | Needs `billing_events` table — **Priority 2** |
| B4 | Tamper-proof/append-only audit log | 🟡 PARTIAL | `audit-trail-ndis` skill exists (7-year retention per NDIS standards) but is agent-level, not DB-level |
| B5 | Export in NDIA-acceptable format | 🔴 NOT YET | No export route — post-Priority-3 |
| B6 | Reconcile with claim submissions | 🔴 NOT YET | Manual for now |
| B7 | Flag events with no SW reply | 🔴 NOT YET | Needs SLA timer on open events — post-Priority-3 |
| B8 | Separate line item for Local Field Visits | 🔴 NOT YET | Post-Priority-3 |
| B9 | Group workshop billing | 🔴 NOT YET | Post-Priority-3 |
| B10 | Weekly recurring billable event (Money Tracker) | 🟡 PARTIAL | `heartbeatScheduler.ts` exists; not wired for LMC events |

---

## Section C — Support Worker Workflow

| # | Capability | Status | Notes |
|---|---|---|---|
| C1 | Caseload view (50 participants) | 🔴 NOT YET | No dashboard exists for SW queue |
| C2 | Queue of pending touchpoints | 🔴 NOT YET | Needs `billing_events` table + API |
| C3 | Templated reply library | 🟡 PARTIAL | Agent skills have templates; no SW quick-reply UI |
| C4 | SLA timer — alert if no reply in X hours | 🔴 NOT YET | Needs heartbeat check on open `billing_events` |
| C5 | SW manually logs free-text as billable | 🔴 NOT YET | Admin form needed |
| C6 | Reassign touchpoint to different SW | 🔴 NOT YET | Post-Priority-3 |
| C7 | On-call roster for after-hours crises | 🟡 PARTIAL | `severity=critical → Xena + supervisor <5 min` pattern exists in NDIS bundle; no formal rota table |

---

## Section D — Module Progression & State

| # | Capability | Status | Notes |
|---|---|---|---|
| D1 | Per-learner module state tracking | 🔴 NOT YET | No `participant_modules` table — **Priority 3** |
| D2 | Module unlock only when all 3 touchpoints replied | 🔴 NOT YET | Needs unlock logic — **Priority 3** |
| D3 | Cohort-level progress view | 🔴 NOT YET | Post-Priority-3 |
| D4 | 48-hour nudge for stuck learners | 🟡 PARTIAL | `heartbeatScheduler.ts` exists; not wired for LMC nudges |
| D5 | Overdue SW reply reminder | 🔴 NOT YET | Needs open `billing_events` heartbeat check |

---

## Section E — AI-Powered User Assistance

| # | Capability | Status | Notes |
|---|---|---|---|
| E1 | LLM Q&A in plain English | ✅ YES | `agentRunner.ts` + Participant Guide agent |
| E2 | Send copy-paste prompt for current module | 🟡 PARTIAL | Knowledge base search exists; not wired to LMC module prompts |
| E3 | Resend lost prompt | 🟡 PARTIAL | Bot can search KB; not a one-command shortcut |
| E4 | Explain marketplace/rejection questions | ✅ YES | Agent answers via KB |
| E5 | Image analysis (photo quality) | 🟡 PARTIAL | agentRunner supports vision models; skill not written for photo QC |
| E6 | Image comparison (honesty check) | 🔴 NOT YET | Post-Priority-3 |

---

## Section F — Reading Buddy & Accessibility (New Module 19)

| # | Capability | Status | Notes |
|---|---|---|---|
| F1 | PDF/photo → plain English via Claude | 🟡 PARTIAL | Vision model support exists in agentRunner; skill not written |
| F2 | Voice-mode (STT + TTS) | 🔴 NOT YET | Post-Priority-3 |
| F3 | Image description for low-vision | 🟡 PARTIAL | Vision model available; skill not written |
| F4 | Live captions for hearing-impaired | 🔴 NOT YET | Post-Priority-3 |
| F5 | Scam detection on forwarded messages | 🟡 PARTIAL | Agent could classify; no dedicated skill |

---

## Section G — Self-Advocacy (New Module 21)

| # | Capability | Status | Notes |
|---|---|---|---|
| G1 | Draft formal email from rough input | ✅ YES | Any agent can do this via existing LLM |
| G2 | Role-play hard conversation | ✅ YES | Claude in chat mode handles this |
| G3 | Store drafts for review before sending | 🟡 PARTIAL | Memory/KB write works; no dedicated "drafts" UX |

---

## Section H — Website Integration (New Module 20)

| # | Capability | Status | Notes |
|---|---|---|---|
| H1 | Surface link to Carrd/Wix AI/Framer | ✅ YES | Just a link — bot can send it |
| H2 | Help learner choose a website tool | ✅ YES | Agent Q&A |

---

## Section I — Safety, Escalation & Duty of Care

| # | Capability | Status | Notes |
|---|---|---|---|
| I1 | Crisis keyword detection | 🟡 PARTIAL | `participant-enquiry-triage` skill has this INSIDE the agent (runs after LLM call); **need pre-check in Telegram layer BEFORE agent** — **Priority 4** |
| I2 | Escalate to on-call SW within 5 min | 🟡 PARTIAL | Pattern exists (`severity=critical → Xena + supervisor`); no formal on-call table |
| I3 | Lifeline / 13YARN links on crisis detection | 🟡 PARTIAL | Likely in triage skill runbook; not in pre-check |
| I4 | Abuse disclosure → Commission report flow | 🟡 PARTIAL | NDIS QSC reportable-incident framework in `participant-enquiry-triage` |
| I5 | Log every interaction for duty-of-care | ✅ YES | `audit-trail-ndis` 7-year retention |
| I6 | AI never diagnoses/prescribes (guardrail) | ✅ YES | Hard rules in NDIS skill runbooks |

---

## Section J — Privacy, Data & Hosting

| # | Capability | Status | Notes |
|---|---|---|---|
| J1 | Australian data residency | ✅ YES | **Fly.io Sydney** — RESOLVED |
| J2 | Consent records per participant | 🔴 NOT YET | No `participant_consents` table — **Priority 5** |
| J3 | Right to erasure | 🔴 NOT YET | Post-Priority-3 |
| J4 | Encryption at rest and in transit | ✅ YES | Fly.io TLS + MySQL at rest |
| J5 | Australian Privacy Principles compliance | 🟡 PARTIAL | Sydney hosting helps; no documented APPs compliance review |

---

## Section K — Local Support Worker Field Visits

| # | Capability | Status | Notes |
|---|---|---|---|
| K1 | "Book Local Visit" button | 🔴 NOT YET | Post-Priority-3 |
| K2 | Geographic SW matching | 🔴 NOT YET | Post-Priority-3 |
| K3 | Calendar booking with confirmations | 🔴 NOT YET | Post-Priority-3 |
| K4 | Travel claim logging | 🔴 NOT YET | Post-Priority-3 |

---

## Section L — UI / Front-end Integration

| # | Capability | Status | Notes |
|---|---|---|---|
| L1 | "Send to SW" button pre-fills trigger phrase in Telegram | 🔴 NOT YET | Web-client work; needs testing on iOS/Android |
| L2 | Copy-to-clipboard on AI prompt blocks | 🔴 NOT YET | Web-client work |
| L3 | Module page reflects live touchpoint state | 🔴 NOT YET | Needs tRPC endpoint over `billing_events` + `participant_modules` |
| L4 | Voice-input on text fields | 🔴 NOT YET | Browser Web Speech API — web-client work |

---

## Priority Summary

**Priority 1 (Deploy blocker):**
- agentRunner.ts line 1048 path fix (one line)

**Priority 2 (NDIS billing foundation):**
- `0012_billing_events.sql` migration
- Slash command router (trigger phrase → billing_event creation + SW notify)
- SW reply detection → billing_event close

**Priority 3 (Module progression):**
- `0013_participant_modules.sql` migration
- Module state management: unlock logic, completion check, next-module unlock
- Heartbeat SLA check on open events (48hr nudge + overdue SW alert)

**Priority 4 (Safety — must ship before first real participant):**
- Crisis keyword pre-check in Telegram layer (before agent call)
- `0015_crisis_events.sql` migration

**Priority 5 (Compliance — must ship before going live):**
- `0014_participant_consents.sql` migration
- Consent check gate on first participant Telegram message

**Post-Priority-3 / Later:**
- SW caseload dashboard (C1, C2)
- Local field visit booking (K1–K4)
- Voice mode (F2)
- NDIA audit export format (B5)
- Right to erasure (J3)
