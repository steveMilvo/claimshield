# Alumni Network & Pathways Spec
## AI Launchpad LMC — what happens after Module 24

**Purpose:** Define the alumni system, certificate generation, and the three opt-in pathways graduates can choose at Module 24. Builds on the existing Module 23 (Telling Your Story) and Module 24 (Graduation) content.

**Scope:** This spec covers everything that happens between the participant completing Module 24 Touchpoint C and continuing engagement with the program as an alumni.

---

## The three pathways at graduation

Each graduate picks one (or NONE) at Module 24 Touchpoint B. The choice is logged in `alumni_records.pathway_chosen` with an explicit conflict-of-interest disclosure check for Pathway C.

| Code | Name | Description | Estimated income | Time commitment |
|---|---|---|---|---|
| **A** | Deeper Business | Continue with monthly SW check-ins, optional advanced modules (markets, wholesale, online ads), quarterly group workshops | Own business revenue | 8–15 hr/wk |
| **B** | Paid Peer Support | Train and certify as an NDIS peer-support worker, then take paid work supporting new participants | $35–$60/hr AU | 5–20 hr/wk |
| **C** | Optional Affiliate (Compliance Agent) | Promote MilvoTech apps for monthly recurring commission. **Earns the program operator commission.** Opt-in only; explicit COI disclosure. | Commission-based, variable | Variable |
| **NONE** | Just Keep Going | Continue running the business with no formal pathway. Always a valid choice. | Own business revenue | Self-paced |

The participant can change pathway later by talking to their alumni SW (one of the existing caseload SWs continues to handle them post-graduation, just with much lower touchpoint frequency).

---

## Database additions

### Migration 0018 — alumni records

```sql
-- File: drizzle/0018_alumni_records.sql

CREATE TABLE alumni_records (
  id                       INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  participant_email        VARCHAR(255)   NOT NULL,
  graduated_at             DATETIME       NOT NULL,
  certificate_id           CHAR(36)       NOT NULL COMMENT 'UUID — printed on the certificate',
  pathway_chosen           ENUM('A_deeper_business','B_peer_support','C_affiliate','NONE') NOT NULL,
  pathway_chosen_at        DATETIME       NOT NULL,
  pathway_coi_disclosed_at DATETIME       NULL COMMENT 'Set when pathway = C; SW logs that they verbally disclosed COI',
  pathway_coi_disclosed_by VARCHAR(255)   NULL COMMENT 'SW email who disclosed',
  alumni_sw_email          VARCHAR(255)   NOT NULL COMMENT 'Same caseload SW continues, lighter touch',
  business_continues       BOOLEAN        NOT NULL DEFAULT TRUE,
  business_name            VARCHAR(255)   NULL,
  business_website_url     VARCHAR(255)   NULL,
  alumni_directory_opt_in  BOOLEAN        NOT NULL DEFAULT FALSE COMMENT 'Show in public alumni directory',
  twelve_month_plan_url    VARCHAR(255)   NULL,
  last_check_in_at         DATETIME       NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_alumni_email (participant_email),
  INDEX idx_alumni_pathway (pathway_chosen),
  INDEX idx_alumni_directory (alumni_directory_opt_in)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE alumni_check_ins (
  id                  INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  alumni_email        VARCHAR(255)   NOT NULL,
  check_in_kind       ENUM('monthly_bot','quarterly_sw','annual_review') NOT NULL,
  triggered_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at        DATETIME       NULL,
  business_status     ENUM('thriving','steady','struggling','paused','closed') NULL,
  pathway_status      ENUM('on_track','adjusting','switched','dropped') NULL,
  notes               TEXT           NULL,
  follow_up_required  BOOLEAN        NOT NULL DEFAULT FALSE,

  PRIMARY KEY (id),
  INDEX idx_aci_alumni (alumni_email),
  INDEX idx_aci_followup (follow_up_required, triggered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Graduation flow — what happens at Module 24 TP-C

When the regular SW logs Touchpoint C of Module 24 as complete (post-graduation event), the system:

1. Reads the participant's pathway choice from Touchpoint B's submission record
2. Creates an `alumni_records` row with `graduated_at = NOW()`, `pathway_chosen = …`, `alumni_sw_email = current SW`
3. Generates a certificate (see next section)
4. Adds the participant to the alumni Telegram channel (or creates the channel membership token)
5. Adds the participant to the alumni directory IF they opt in (asked at certificate handover)
6. Schedules the first `alumni_check_ins` row at +30 days
7. Updates `participant_modules` Module 24 row with `completed_at = NOW()`
8. Sends graduation message via the bot:

> 🎓 **CONGRATULATIONS [NAME]!**
>
> Your certificate is ready. Tap below to view and print.
>
> You're now an Alumni — the alumni Telegram channel is unlocked, and monthly check-ins begin in 30 days.
>
> Your pathway: **[CHOSEN PATHWAY]**. Your next step this week: [SPECIFIC FROM TP-24-B TEMPLATE].
>
> Thank you for trusting the process. We're proud of you. 💙

---

## Certificate generation

### What the certificate contains

- Participant's full name (large, centered)
- "AI Launchpad Graduate" title
- Graduation date (long format: "Twenty-ninth of May, Two Thousand and Twenty-Six")
- Certificate ID (UUID, printed in small monospace at the bottom for verification)
- Business name (if `business_continues = TRUE` and they have one)
- A QR code linking to a public verification page at `/verify/cert/:certificateId` that confirms authenticity but reveals no PII beyond what's already on the cert
- Program signature block (program manager + provider name + ABN)

### Format
- PDF, A4, single page, print-safe (no bleed required)
- Generated server-side at the moment graduation is logged
- Stored in object storage with a signed-URL pattern (cert is shareable but not indexable)

### tRPC endpoint
```ts
trpc.lmc.alumni.viewCertificate.query({ alumniEmail })
→ { certificateId, pdfDownloadUrl, expiresAt, verificationUrl }
```

### Verification page
A public route `/verify/cert/:certificateId` returns a simple page:
- Certificate is valid ✅
- Issued to: [FIRST INITIAL]. [LAST NAME] (`S. K.` not `Sarah Khouri` — partial PII)
- Issued on: [DATE]
- By: AI Launchpad / [PROVIDER NAME]
- Pathway taken: [PATHWAY NAME] (if alumni opted to make public)

If the certificate is revoked (e.g. discovered fraud, alumni request), the page shows: *"This certificate was withdrawn on [DATE]."*

---

## Alumni Telegram channel

A single dedicated Telegram channel (not a group — channel = one-way broadcast with comments enabled). Bot is the channel admin.

### Posts
- Monthly: a digest from the program team (1–3 tips, 1 alumni spotlight, 1 new tool announcement)
- Weekly: an "alumni question" thread (peer support, opt-in to respond)
- Ad-hoc: emergency program updates (rare)

### Membership
- All graduates auto-added on graduation
- Membership token stored in `alumni_records`; can be revoked if alumni breaches conduct rules
- Lurking is fine; alumni are never required to post

---

## Monthly alumni check-in (bot-driven)

30 days after graduation, then monthly thereafter, the bot DMs each alumni:

> Hi [NAME], it's been [X] weeks since you graduated! Quick check-in — just tap a reply:
>
> 1️⃣ Thriving — business going well
> 2️⃣ Steady — keeping it going
> 3️⃣ Struggling — could use some support
> 4️⃣ Paused — taking a break
> 5️⃣ Closed — business has ended
>
> Free chat is always open if you want to talk. Your alumni SW [NAME] is here. 💙

The reply creates a new `alumni_check_ins` row with `check_in_kind = 'monthly_bot'` and the appropriate `business_status`. If 3️⃣ or 4️⃣ or 5️⃣: sets `follow_up_required = TRUE` → triggers the alumni SW to reach out within 5 working days.

If no response for 14 days: the alumni SW gets a nudge.
If no response for 30 days: a single "Are you okay?" message (handled extra gently — no pressure).

### Quarterly SW check-in
Every 3 months, the alumni SW books a 15-min voice call with the alumni (billable as a separate Skill Maintenance line item, if the participant's plan allows post-graduation capacity-building support).

### Annual review
12 months post-graduation, a longer review (45 min) covering the year, the 12-month plan from Module 24, and what the next 12 months look like.

---

## Pathway A — Deeper Business

### What it provides
- Monthly SW check-ins (as above)
- Quarterly group workshops (60 min, 4 alumni × 15 min billable each, same as Module 12 model)
- Access to "advanced module" content (markets, wholesale, online advertising) — released as the alumni reaches readiness, not all at once
- Eligibility to feature in the alumni spotlight on the Telegram channel

### Bot commands
- `/advanced_modules` — list available advanced modules
- `/book_quarterly_workshop` — opt into the next group session
- `/alumni_spotlight_apply` — apply to be featured

### Billing
Continued as Capacity Building — Skill Development, lighter touchpoint frequency. Provider must confirm the participant's plan supports ongoing capacity-building post-graduation.

---

## Pathway B — Paid Peer Support

### What it provides
The alumni starts a separate journey to become a paid NDIS peer-support worker. Distinct from the AI Launchpad program — this is a real workforce pathway.

### Steps
1. **Peer support readiness assessment** — a 1-hour conversation with the alumni SW + program manager to verify the alumni is ready (mental health stable, lived experience can be shared without re-traumatisation, communication skills, comfort with disclosure)
2. **NDIS Peer Support Worker training enrolment** — external (provider does not deliver the certification; signposts to TAFE / Mental Health First Aid / lived-experience pathways)
3. **Mentorship matching** — paired with an existing peer-support worker for shadowing
4. **First paid placements** — through the provider's own peer-support program (if available) or signposted to external providers

### Honest scope
- The provider does **NOT** guarantee employment as a peer-support worker. The pathway is a real route, but jobs depend on the worker's qualifications, their state's workforce supply, and the participant's individual fit.
- Peer support is not for everyone. The readiness assessment is a real gate — not all who choose Pathway B will be cleared to proceed.
- All assessments are documented; reasons for "not yet" outcomes are explained respectfully and a re-assessment date offered.

### Bot commands
- `/peer_support_info` — full pathway info pack
- `/peer_support_readiness` — books the readiness assessment

---

## Pathway C — Optional Affiliate (Compliance Agent)

### Conflict-of-interest controls (mandatory)
1. Pathway C may only be chosen at Module 24 TP-B if **the SW has logged COI disclosure** (`pathway_coi_disclosed_at` not null)
2. The disclosure script (from SW Reply Template TP-24-B variant) must be read out loud during the sync voice call
3. Pathway C activity is **NOT NDIS-billable by default** — bot enforces this via `/submit_capath_NN_*` trigger phrase routing (existing in trigger router)
4. A 30-day "cooling off" window applies: alumni cannot start CA-01 until 30 days after graduation. Window exists to defuse any subtle post-graduation pressure.

### What it provides
- Access to Sub-Modules CA-01 to CA-06 (the relocated old Modules 18–23)
- The affiliate dashboard (existing MilvoTech infrastructure)
- A commission tracker showing monthly recurring revenue from referrals
- Quarterly check-ins with the program manager (NOT the regular alumni SW, who could be perceived as pushing) about pathway sustainability

### Pathway exit
At any time the alumni can:
- Pause `/pause_affiliate_pathway` — stops new referrals from being attributed; existing recurring commission continues
- Exit `/exit_affiliate_pathway` — full withdrawal, no future commission

Pathway exit triggers a satisfaction survey and an offer of an alternative pathway.

---

## Bot commands summary (for reference)

| Command | What it does | When it works |
|---|---|---|
| `/my_journey` | Shows the alumni's milestones, certificate link, current pathway | Any time post-graduation |
| `/join_alumni` | Joins the alumni Telegram channel | First 24h after graduation |
| `/12_month_check` | Pulls up the alumni's 12-month plan from Module 24 | Any time |
| `/advanced_modules` | Pathway A — lists available advanced modules | Pathway A only |
| `/book_quarterly_workshop` | Pathway A — opts into the next workshop | Pathway A only |
| `/alumni_spotlight_apply` | Apply to be featured in the channel | Any pathway |
| `/peer_support_info` | Pathway B info pack | Any time |
| `/peer_support_readiness` | Book Pathway B readiness assessment | Pathway B selected or considering |
| `/start_ca_pathway` | Unlocks Sub-Module CA-01 (Pathway C only) | 30 days post-graduation + Pathway C selected |
| `/pause_affiliate_pathway` | Pause Pathway C activity | Pathway C only |
| `/exit_affiliate_pathway` | Full withdrawal from Pathway C | Pathway C only |

---

## Honest scope notes

1. **Alumni engagement decays.** Plan for it. Most graduates will engage actively for 3–6 months, then become quieter. That's fine and normal. The monthly bot check-in is the low-cost engagement layer; the quarterly SW call is the high-value layer.
2. **Pathway switches happen.** A graduate may pick Pathway A, then move to Pathway B 6 months later. Build the data model to support that — `alumni_records.pathway_chosen` is a snapshot, but track history in `alumni_check_ins.pathway_status`.
3. **Certificates have weight.** Treat them as legitimate credentials. Make the verification page solid and the certificate hard to fake (UUID + signed PDF + public verification).
4. **Pathway C is structurally compromised by its own design.** No matter how good the COI controls are, the program operator earns money when alumni pick it. We've built in: cooling-off window, mandatory verbal disclosure, separate non-billable trigger phrases, separate check-in officer, pause and exit commands. Audit-log everything. If a regulator audits Pathway C engagement, the COI safeguards must hold up.

---

## tRPC endpoints

```ts
// Graduate flow
trpc.lmc.alumni.completeGraduation.mutate({ participantEmail, pathwayChosen, coiDisclosed }) → { certificateId, alumniRecordId }
trpc.lmc.alumni.viewCertificate.query({ alumniEmail })
trpc.lmc.alumni.directoryOptIn.mutate({ optIn: boolean })

// Alumni self-service
trpc.lmc.alumni.myJourney.query()
trpc.lmc.alumni.myPathway.query()
trpc.lmc.alumni.switchPathway.mutate({ newPathway, reason })

// Check-ins
trpc.lmc.alumni.respondToCheckIn.mutate({ checkInId, businessStatus, pathwayStatus, notes })

// Pathway A
trpc.lmc.alumni.advancedModules.query()
trpc.lmc.alumni.bookQuarterlyWorkshop.mutate({ workshopDate })

// Pathway B
trpc.lmc.alumni.peerSupportInfo.query()
trpc.lmc.alumni.bookReadinessAssessment.mutate({ preferredDate })

// Pathway C
trpc.lmc.alumni.startCaPathway.mutate()       // checks 30-day window + COI flag
trpc.lmc.alumni.pauseAffiliatePathway.mutate({ reason })
trpc.lmc.alumni.exitAffiliatePathway.mutate({ reason, satisfactionSurvey })

// Public verification (no auth)
trpc.public.verifyCertificate.query({ certificateId })
```

---

## Acceptance criteria

- [ ] Module 24 TP-C completion creates an `alumni_records` row and generates a PDF certificate
- [ ] Certificate verification page works with no auth, reveals partial PII only
- [ ] Pathway C selection at TP-B requires `coiDisclosed = true` — endpoint rejects otherwise
- [ ] Pathway C `start_ca_pathway` blocked for 30 days after graduation
- [ ] Monthly bot check-in fires at 30, 60, 90… days post-graduation
- [ ] Business status "struggling/paused/closed" triggers alumni SW follow-up within 5 working days
- [ ] Alumni Telegram channel membership added automatically; revocable on conduct breach
- [ ] Alumni can switch pathway at any time via SW conversation
- [ ] Pathway switch history is recoverable from `alumni_check_ins` rows
- [ ] All alumni activity captured in the 7-year audit retention via audit-trail-ndis
