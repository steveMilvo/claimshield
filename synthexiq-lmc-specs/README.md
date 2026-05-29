# AI Launchpad LMC — SynthexIQ Build Specs

Complete spec library for wiring AI Launchpad's Learning Module Content into the SynthexIQ platform.

Hand this entire directory to whoever is building the integration. Read in the order below — every spec assumes the earlier ones.

---

## What this is

A 21-module NDIS-funded eLMS for participants with disabilities. Each module has 3 billable "touchpoints" tracked via Telegram slash commands. SynthexIQ is the platform; this spec library is the build pack.

**Target customer:** NDIS participants with low literacy / low numeracy.
**Billing:** Capacity Building — Skill Development line items, with audit-grade timestamp evidence per touchpoint.
**Capacity:** 50 participants per support worker × 2.5 events/week = 125 events/week per SW, ~18 min average per event.

---

## Read in this order

### 1. Foundation
- **`CAPABILITY_AUDIT_REVISED.md`** — what SynthexIQ already has (cross-referenced against `AUDIT_NOTES.md` Rounds 1–6), what's partial, what needs building. Start here.

### 2. Build brief
- **`OPUS_BRIEF.md`** — the handover prompt for the session with the SynthexIQ codebase. Defines Priority 1–5 scope and non-negotiable architecture rules.

### 3. Database migrations
- **`drizzle/0012_billing_events.sql`** — billing_events + crisis_events
- **`drizzle/0013_participant_modules.sql`** — per-learner module state
- **`drizzle/0014_participant_consents.sql`** — Australian Privacy Principles consent records
- **`drizzle/0017_local_sw_visits.sql`** — local SW workforce + visits + travel claims
- **`drizzle/0018_alumni_records.sql`** — alumni records + check-in history

### 4. Server code
- **`server/lmc/triggerRouter.ts`** — trigger phrase parser, billing event creation, SW reply detection, module progression, crisis pre-check, SLA heartbeat

### 5. Front-end specs (platform-neutral)
- **`WEB_CLIENT_MODULE_PAGE_SPEC.md`** — participant-facing module pages
- **`SW_CASELOAD_DASHBOARD_SPEC.md`** — support worker dashboard

### 6. Content libraries
- **`SW_REPLY_TEMPLATES.md`** — 63 templates (one per touchpoint), keyed to trigger phrases

### 7. Operational specs
- **`NDIA_AUDIT_EXPORT_SPEC.md`** — billing evidence export format for NDIA audits
- **`LOCAL_SW_ACTIVATION_SPEC.md`** — field visit workflow (Modules 11, 16, 22)
- **`ALUMNI_PATHWAYS_SPEC.md`** — graduation, certificate, alumni network, three pathways

### 8. Learning content (in the parent directory)
- **`../AI_Launchpad_LMC_v3_Modules_05-24.md`** — the actual module content (Module 04B foundation + 20 official modules 05–24 + 6 opt-in pathway sub-modules CA-01 to CA-06)

---

## Priority order for the build

The OPUS_BRIEF defines Priority 1–5 as the minimum viable launch. Everything below extends or hardens that base.

### Priority 1 (deploy blocker)
Single-line fix in `agentRunner.ts:1048`.

### Priority 2 (NDIS billing foundation)
`billing_events` migration + slash command router + SW reply detection.

### Priority 3 (module progression)
`participant_modules` migration + module unlock logic + SLA heartbeat checks.

### Priority 4 (safety)
Crisis keyword pre-check in Telegram layer + `crisis_events` records.

### Priority 5 (privacy)
`participant_consents` migration + consent gate before first message processed.

### Priority 6 (front-end — parallel work)
Build the web client (module pages) and SW dashboard against the tRPC endpoints defined in their respective specs.

### Priority 7 (post-launch hardening)
- NDIA audit export (`NDIA_AUDIT_EXPORT_SPEC.md`) — needed before first NDIA audit window, not before first participant joins
- Local SW activation (`LOCAL_SW_ACTIVATION_SPEC.md`) — needed when first participant reaches Module 11
- Alumni records (`ALUMNI_PATHWAYS_SPEC.md`) — needed when first participant reaches Module 24

### Out of scope (Bucket 3 — descoped)
- Voice mode (Whisper STT + TTS)
- AI image comparison (Module 06 honesty check)
- Live caption transcription
- Right-to-erasure flow

---

## What this build pack delivers when complete

A working NDIS-funded eLMS that:

1. **Bills correctly.** Every billable interaction has a tamper-evident timestamp record under the right NDIS line item, exportable in the auditor's preferred format.
2. **Locks safely.** Participants can't run modules they haven't been consented to, prepared for, or unlocked from the prior step.
3. **Escalates fast.** Crisis indicators surface inside 5 minutes; on-call SW is notified before the agent even sees the message.
4. **Saves SW time.** 63 reply templates + caseload dashboard make the 50:1 ratio sustainable inside a 38-hour week.
5. **Continues after graduation.** Alumni records track post-program engagement; pathways open meaningful next steps (deeper business, paid peer support, or opt-in affiliate with proper conflict-of-interest controls).
6. **Stays inside Australian data residency.** Fly.io Sydney + consent versioning + audit retention.
7. **Doesn't break SynthexIQ.** All LMC-specific code lives in `server/services/bundles/ndis.ts` and `server/services/lmc/`. Core files (agentRunner, telegramWebhook, telegramPoller, _core/index.ts) are touched only for the specific fixes listed in OPUS_BRIEF Priority 1–4.

---

## File index

```
synthexiq-lmc-specs/
├── README.md                                  ← you are here
├── CAPABILITY_AUDIT_REVISED.md                ← what exists vs what to build
├── OPUS_BRIEF.md                              ← Priority 1–5 build brief
├── WEB_CLIENT_MODULE_PAGE_SPEC.md             ← participant front-end
├── SW_CASELOAD_DASHBOARD_SPEC.md              ← support worker front-end
├── SW_REPLY_TEMPLATES.md                      ← 63 SW reply templates
├── NDIA_AUDIT_EXPORT_SPEC.md                  ← NDIS audit export format
├── LOCAL_SW_ACTIVATION_SPEC.md                ← local SW field visit flow
├── ALUMNI_PATHWAYS_SPEC.md                    ← graduation + alumni + pathways
├── drizzle/
│   ├── 0012_billing_events.sql                ← billing + crisis tables
│   ├── 0013_participant_modules.sql           ← per-learner module state
│   ├── 0014_participant_consents.sql          ← APP consent records
│   ├── 0017_local_sw_visits.sql               ← local SW workforce + visits
│   └── 0018_alumni_records.sql                ← alumni + check-ins
└── server/
    └── lmc/
        └── triggerRouter.ts                   ← slash command router + module logic
```

---

## Companion files (parent directory)

- `../AI_Launchpad_LMC_v3_Modules_05-24.md` — the actual learning content
- `../SynthexIQ_Capability_Audit.md` — original capability audit (pre-AUDIT_NOTES cross-reference)

---

*All specs in this library are platform-neutral and framework-agnostic. No development-environment identifiers are embedded in the code or migrations.*
