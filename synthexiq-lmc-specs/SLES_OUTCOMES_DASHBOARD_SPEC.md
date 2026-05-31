# SLES Outcomes Dashboard — Spec
## The audit-defence layer for AI Launchpad SLES delivery

**For:** the team building the SLES outcomes capture + reporting layer on top of SynthexIQ
**Purpose:** Capture, surface, and export the evidence that justifies each $22k of NDIS SLES funding per participant — so an NDIA auditor sees outcomes, not just hours.
**Reads from:** `billing_events`, `participant_modules`, money tracker entries, customer records, community contacts, bot interaction logs
**Writes to:** new `sles_monthly_snapshots` + `sles_annual_reports` tables (migration 0016)

---

## Why this dashboard exists

SLES is outcome-funded. The NDIA does not pay $22,000/year per participant for hours logged — they pay for documented progression toward an employment-equivalent outcome. Without an outcomes dashboard, AI Launchpad cannot defend the funding at audit.

The dashboard captures eight outcome dimensions monthly, rolls them into an annual report, and produces an NDIA-grade PDF the planner can sign off at plan review.

---

## The eight outcome dimensions

Captured automatically every month for every active SLES participant. Each maps to one or more billable LMC modules.

| # | Dimension | Source data | LMC modules that feed it |
|---|---|---|---|
| 1 | **Business income earned** | Money tracker entries (`tracker_entries.amount_in`) | 10, 12, 17, 25, 27, 29, 30 |
| 2 | **Work-equivalent activity hours** | Sum of `billing_events.duration_seconds` + structured cohort time + customer-facing activity time | All modules |
| 3 | **Customer count (lifetime + monthly)** | Distinct customers from tracker entries + customer database | 09, 11, 26, 29, 30 |
| 4 | **Independent task completion ratio** | % of touchpoints where SW reply used APPROVE variant only (no TWEAK or REROUTE) | All modules |
| 5 | **Communication interaction count** | Customer DMs + market conversations + bot-mediated exchanges | 08, 09, 15, 18, 21, 23, 32 |
| 6 | **Money management progression** | Tracker accuracy score (auto-evaluated) + 3-bucket adherence | 10, 27, 33 |
| 7 | **Community connections made** | New contacts from Module 11/16 + market stallholder relationships from 29 | 11, 16, 29, 34 |
| 8 | **Skill progression score** | Module completion rate + quiz pass rate + safety-gate certifications | All modules |

A ninth optional dimension for participants in Year 2:
| 9 | **Leadership / mentor activity** | Mentor check-in logs from Module 34 | 34 |

---

## Database design — Migration 0016

```sql
-- File: drizzle/0016_sles_outcomes.sql

CREATE TABLE sles_monthly_snapshots (
  id                              INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  participant_email               VARCHAR(255)   NOT NULL,
  snapshot_month                  DATE           NOT NULL COMMENT 'First day of the month being snapshotted (YYYY-MM-01)',
  captured_at                     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  program_year                    TINYINT UNSIGNED NOT NULL COMMENT '1 or 2 for SLES Year 1 / Year 2',

  -- Dimension 1: Business income earned (cents to avoid float issues)
  income_earned_cents             INT UNSIGNED   NOT NULL DEFAULT 0,
  income_earned_cumulative_cents  INT UNSIGNED   NOT NULL DEFAULT 0,

  -- Dimension 2: Work-equivalent activity hours
  activity_hours_billable         DECIMAL(5,2)   NOT NULL DEFAULT 0 COMMENT 'Sum of billing_events.duration_seconds / 3600 for this month',
  activity_hours_structured       DECIMAL(5,2)   NOT NULL DEFAULT 0 COMMENT 'Cohort time + self-paced module activity (auto-logged)',
  activity_hours_customer_facing  DECIMAL(5,2)   NOT NULL DEFAULT 0 COMMENT 'Markets, customer interactions, community time',
  activity_hours_total            DECIMAL(6,2)   GENERATED ALWAYS AS
                                    (activity_hours_billable + activity_hours_structured + activity_hours_customer_facing) STORED,

  -- Dimension 3: Customers
  customer_count_new              SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'New unique customers this month',
  customer_count_repeat           SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Returning customers this month',
  customer_count_lifetime         SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Cumulative unique customers since enrolment',

  -- Dimension 4: Independent task completion (0.00 - 1.00)
  independence_ratio              DECIMAL(4,3)   NOT NULL DEFAULT 0 COMMENT '% of this month''s touchpoints with APPROVE-only SW response',

  -- Dimension 5: Communication interactions
  comms_customer_count            SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  comms_community_count           SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  comms_supplier_count            SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  -- Dimension 6: Money management
  money_tracker_accuracy_pct      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '% of tracker entries auto-validated against bank statement',
  bucket_adherence_pct            TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '% of monthly income split per the 3-bucket rule (Module 27)',

  -- Dimension 7: Community connections
  community_new_connections       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  community_active_connections    TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Connections still actively maintained',

  -- Dimension 8: Skill progression
  modules_completed_this_month    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  modules_completed_cumulative    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  quiz_pass_rate_pct              TINYINT UNSIGNED NOT NULL DEFAULT 0,
  safety_gates_passed             TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Count of hard safety gates passed (04B-C, 04C-C, 21-A, etc.)',

  -- Dimension 9 (Year 2 only): Leadership / mentor
  mentor_checkins_this_month      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  mentor_total_minutes            SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  -- Free-text narrative (captured monthly by SW, optional)
  sw_narrative_note               TEXT           NULL COMMENT 'SW narrative observation for the month (optional)',
  participant_self_reflection     TEXT           NULL COMMENT 'Participant''s own monthly check-in answer (optional)',

  PRIMARY KEY (id),
  UNIQUE KEY uq_sms (participant_email, snapshot_month),
  INDEX idx_sms_month (snapshot_month),
  INDEX idx_sms_year  (program_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE sles_annual_reports (
  id                    INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  participant_email     VARCHAR(255)   NOT NULL,
  program_year          TINYINT UNSIGNED NOT NULL COMMENT '1 or 2',
  report_period_start   DATE           NOT NULL,
  report_period_end     DATE           NOT NULL,
  generated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  generated_by          VARCHAR(255)   NOT NULL COMMENT 'Email of SW or manager who triggered generation',

  -- Headline outcome metrics for the audit
  total_income_cents              INT UNSIGNED  NOT NULL,
  total_activity_hours            DECIMAL(7,2)  NOT NULL,
  total_customers_served          SMALLINT UNSIGNED NOT NULL,
  final_independence_ratio        DECIMAL(4,3)  NOT NULL,
  modules_completed               TINYINT UNSIGNED NOT NULL,
  safety_gates_passed             TINYINT UNSIGNED NOT NULL,

  -- Narrative
  goals_set_at_intake             TEXT          NOT NULL,
  goal_progress_summary           TEXT          NOT NULL,
  participant_voice_summary       TEXT          NULL COMMENT 'Participant''s own words about their year',
  sw_observation                  TEXT          NOT NULL,

  -- Sign-offs (audit requirement)
  participant_signed_at           DATETIME      NULL,
  participant_signed_method       ENUM('in_person','video','voice_recording','typed') NULL,
  guardian_signed_at              DATETIME      NULL COMMENT 'If participant has nominee/guardian',
  sw_signed_at                    DATETIME      NULL,
  manager_signed_at               DATETIME      NULL COMMENT 'Required before NDIA submission',

  -- Outputs
  pdf_url                         VARCHAR(500)  NULL COMMENT 'Signed URL to the rendered PDF',
  ndia_submitted_at               DATETIME      NULL,
  ndia_acknowledged_at            DATETIME      NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_sar (participant_email, program_year),
  INDEX idx_sar_period (report_period_start, report_period_end),
  INDEX idx_sar_submitted (ndia_submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE sles_goals (
  id                    INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  participant_email     VARCHAR(255)   NOT NULL,
  set_at_intake         BOOLEAN        NOT NULL DEFAULT FALSE,
  goal_category         ENUM(
                          'income',
                          'customers',
                          'independence',
                          'community',
                          'skills',
                          'health_wellbeing',
                          'leadership',
                          'transition'
                        ) NOT NULL,
  goal_text             VARCHAR(500)   NOT NULL,
  target_value          VARCHAR(100)   NULL COMMENT 'Free-text target (e.g. "$300/wk", "10 customers", "open my own market stall")',
  target_date           DATE           NULL,
  status                ENUM('active','achieved','adjusted','dropped') NOT NULL DEFAULT 'active',
  achieved_at           DATETIME       NULL,
  adjusted_reason       TEXT           NULL,
  created_at            DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_sg_participant (participant_email),
  INDEX idx_sg_status      (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Monthly capture flow

The bot runs a monthly scheduler job (`captureSlesMonthlySnapshots`) on the 1st of each month at 02:00 AEST.

For each active SLES participant:

1. Query the prior month's data:
   - Sum tracker entries → income
   - Sum closed billing_events.duration_seconds → billable hours
   - Sum auto-logged cohort attendance + module activity → structured hours
   - Sum customer-facing activity logs (market days, on-the-day sale support) → customer-facing hours
   - Count distinct customer IDs in tracker entries → customer count
   - Compute independence ratio from SW reply variants
   - Count communication interactions
   - Compute money tracker accuracy (compare to optional bank import)
   - Compute 3-bucket adherence
   - Count community connections
   - Count modules completed
   - Compute quiz pass rate
   - Count safety gates passed
   - Count mentor checkins (Year 2)

2. Write one `sles_monthly_snapshots` row.

3. Send the SW a Telegram summary:
> *"Monthly snapshot for [PARTICIPANT] is captured. Income: $X, Hours: Y, Customers: Z. Want to add a SW narrative? [/add_narrative_pp_email_YYYY_MM]"*

4. Send the participant a simplified version:
> *"Hi [NAME]! Here's your [MONTH] summary: $[X] earned, [Y] customers, [Z] hours of business activity. Want to tell me how you felt about the month? Just reply with a sentence."*

The participant's reply (if any) is captured into `participant_self_reflection`.

---

## tRPC endpoints

```ts
// Participant view (read-only)
trpc.sles.myMonthlySummary.query({ month: ISO8601 })
  → { snapshot, encouragingNarrative }   // bot-generated 1-line summary

trpc.sles.myProgress.query()
  → { yearToDateIncome, totalHours, customerCount, modulesComplete, goalProgress }

trpc.sles.myGoals.query()
  → Goal[]

trpc.sles.respondToMonthlyPrompt.mutate({ snapshotId, reflection: string })


// SW view
trpc.sles.sw.caseloadOutcomes.query({ swEmail?: string })
  → Array<{
      participantEmail, firstName,
      thisMonth: SnapshotSummary,
      lastMonth: SnapshotSummary,
      trend: 'up' | 'steady' | 'down',
      flagged: boolean,                // true if any dimension dropped significantly
      flagReason?: string
    }>

trpc.sles.sw.participantOutcomes.query({ participantEmail })
  → { last12Months: Snapshot[], goals: Goal[], annualReportDue: boolean }

trpc.sles.sw.addNarrative.mutate({ snapshotId, narrative: string })

trpc.sles.sw.addGoal.mutate({ participantEmail, goal: GoalInput })
trpc.sles.sw.updateGoal.mutate({ goalId, status, achievedAt? })


// Manager view
trpc.sles.manager.cohortOutcomes.query({ programYear?: 1 | 2 })
  → {
      totalParticipants, avgIncomeThisQuarter, avgIndependenceRatio,
      participantsFlagged: number,
      participantsOnTrack: number,
      bottomQuartileForReview: Participant[]
    }

trpc.sles.manager.generateAnnualReport.mutate({
  participantEmail, programYear, finalReview: { sw, manager, goalProgress }
})
  → { reportId, pdfUrl, awaitingSignatures }


// Audit export
trpc.sles.audit.exportCohortReports.query({
  periodStart: ISO8601, periodEnd: ISO8601, format: 'pdf_bundle' | 'csv' | 'json'
})
  → { downloadUrl, expiresAt }
```

---

## UI surfaces

### Participant view — "My Progress" (`/my-progress`)

Calm, encouraging, plain language. Year 6 reading level.

- Big number: **"$[X] earned this month"** + a smiley if up from last month
- "[Y] customers met"
- "[Z] hours of work"
- A progress bar for the most recent goal
- A "see my year" button → opens a year-to-date chart (simple, no jargon)
- "Tell me about your month" prompt — voice input enabled

**Do NOT show:** independence ratio (could feel judgmental), quiz pass rate (could feel exam-like), bottom-quartile flags, manager-view metrics. The participant's view is for celebration and reflection, not assessment.

### SW view — "Caseload Outcomes" (`/sw/outcomes`)

Operational, scannable. 50 rows.

| Participant | Year | Income MTD | Hours MTD | Customers | Independence | Modules | Trend | Flag |
|---|---|---|---|---|---|---|---|---|
| Sarah K. | Y1 | $480 | 32h | 8 | 0.62 | 9/24 | ↑ | — |
| Tom M. | Y1 | $0 | 4h | 0 | 0.21 | 2/24 | ↓ | 🟡 |
| Aisha O. | Y2 | $1,200 | 38h | 18 | 0.89 | 28/36 | ↑ | — |

Click row → participant outcomes detail.

Flag column rules:
- 🟡 if any dimension dropped >40% month-over-month
- 🔴 if income = 0 AND activity hours < 10 for 2 consecutive months (genuine engagement risk)
- ⚪ neutral if dimensions tracking acceptably

Flagged rows get auto-surfaced to the manager weekly digest.

### Manager view — "Cohort Outcomes" (`/manager/outcomes`)

Aggregate, for NDIA reporting + operational management.

- Cohort overview: total active, by program year, by intake
- Quarterly aggregate per dimension
- Quarterly outcomes vs cohort target (configurable — e.g. *"Y1 cohort target: 60% of participants earning $200+/month by Month 6"*)
- "Bottom quartile for review" list — participants in the worst-performing 25% on the composite outcomes score; manager reviews monthly to confirm SW is adjusting plan or pivoting pathway
- "Annual reports due this quarter" list
- Export buttons for NDIA submission

### Annual report PDF (the audit artifact)

8-page A4 PDF, generated by `trpc.sles.manager.generateAnnualReport`. Sections:

1. **Cover page** — participant name, program year, period, AI Launchpad branding, certificate ID
2. **Executive summary** (1 page) — headline metrics + 4-line narrative
3. **Goals set at intake vs achieved** (1 page) — table of goals and progress
4. **Outcome dimension trends** (2 pages) — chart per dimension across the 12 monthly snapshots
5. **Participant's own voice** (1 page) — direct quotes from their monthly self-reflections + Module 23 story extract
6. **SW observation** (1 page) — narrative summary from the SW
7. **Next year plan** (1 page) — Year 2 goals OR post-SLES transition plan
8. **Sign-offs** — participant, guardian (if any), SW, manager — each with timestamp and method

This document is what the NDIA planner reviews at plan review. It is what justifies the next year of SLES funding (Year 1 → Year 2) or the transition to ongoing Capacity Building / Skill Maintenance (Year 2 → Alumni).

---

## Audit grade — what makes this report defensible

The NDIA auditor's job is to verify funded outcomes happened. Six features make the report audit-grade:

1. **Tamper-evident provenance.** Every monthly snapshot row has a `captured_at` timestamp + the data was auto-computed from `billing_events` and tracker entries (which themselves have audit trails). Manual override is not possible; SW narrative is additive, not corrective.
2. **Goal-anchored narrative.** Goals are set at intake, frozen, then tracked. The auditor can see what was promised and what was delivered.
3. **Participant voice.** The report includes the participant's own words (monthly reflections + Module 23 story). This is not the provider speaking on the participant's behalf.
4. **Multiple sign-offs.** Participant + guardian (if applicable) + SW + manager. No single party can falsify.
5. **Continuous monthly trail, not annual summary.** 12 monthly snapshots beat 1 annual claim every time.
6. **Independent computation.** The independence ratio + activity hours come from the operational data (`billing_events`, SW template variant, tracker entries). The auditor can verify by cross-checking source tables.

When asked "how do you know this participant achieved an employment-equivalent outcome?", the SW or manager opens the report and points to:
- Income: $4,200 over the year, evidenced by tracker entries
- Hours: 380 hours of structured business activity (billable + structured + customer-facing)
- Customers: 47 unique customers served, evidenced by distinct customer records
- Independence: started at 0.21, ended at 0.78 (huge progression)
- Goals: 5/6 goals achieved; 1 adjusted with reason documented
- Voice: 8 monthly reflections from the participant, all in their own words

That is the SLES outcome. The funding is defended.

---

## Computational details

### Independence ratio computation

```typescript
function computeIndependenceRatio(participantEmail: string, month: Date): number {
  const events = await db.query(`
    SELECT template_variant_used
      FROM billing_events
     WHERE participant_email = ?
       AND status = 'closed'
       AND closed_at >= ? AND closed_at < ?
  `, [participantEmail, monthStart(month), monthEnd(month)]);

  if (events.length === 0) return 0;

  const approveOnly = events.filter(e => e.template_variant_used === 'approve').length;
  return approveOnly / events.length;
}
```

Year 1 expectation: starts at 0.1–0.3, rises to 0.5–0.7 by Module 12.
Year 2 expectation: starts at 0.5–0.7, rises to 0.7–0.9 by Module 36.

### Activity hours composition

```
activity_hours_billable     = SUM(closed billing_events.duration_seconds) / 3600
activity_hours_structured   = SUM(auto-logged module activity) / 3600
activity_hours_customer_facing = SUM(market day logs + on-the-day customer activity) / 3600
activity_hours_total        = sum of above (DB-computed column)
```

Auto-logged module activity is timestamped by the bot when the participant opens a module page and engages with the steps. There's an idle-cutoff (5 min of no interaction = stop logging) to prevent inflated hours from leaving the tab open.

### Bucket adherence

For each calendar month, after the participant's primary income flows in:
```
expected_materials = month_income × bucket_pct_materials
expected_save      = month_income × bucket_pct_save
expected_pay_self  = month_income × bucket_pct_pay_self

actual_materials   = SUM(tracker entries categorised as "materials" this month)
actual_save        = SUM(transfers to savings account this month)
actual_pay_self    = SUM(transfers from business to personal account this month)
```

Bucket adherence = average of the three category adherence ratios.

### Quiz pass rate

```
quiz_pass_rate_pct = (correct quiz answers this month) / (quiz questions answered this month) × 100
```

Quiz answers are stored in `quiz_responses` (already exists in the platform per Web Client Module Page spec).

---

## Privacy and consent

- Outcomes data uses identifying info (email, name). Stored under existing audit-trail-ndis 7-year retention.
- Participant must have consented to `billing_audit` consent type (per migration 0014) before any snapshot row is written. The capture job skips participants without active consent.
- Participant has the right to view their full snapshot history via `/my-progress`.
- Snapshots cannot be deleted by SW or manager. Withdrawn consent → snapshots redacted to `[WITHDRAWN]` for identifying columns (same pattern as NDIA Audit Export Spec).

---

## Acceptance criteria

- [ ] Monthly scheduler runs `captureSlesMonthlySnapshots` on the 1st of each month
- [ ] Snapshot insert is idempotent — re-running for the same (participant, month) updates the row instead of duplicating
- [ ] Independence ratio matches manual computation against `billing_events.template_variant_used`
- [ ] Activity hours = billable + structured + customer-facing, verified by DB-computed column
- [ ] Participant `/my-progress` page renders without showing manager-only metrics (independence ratio, quartile flags)
- [ ] SW caseload view sorts flagged rows to the top
- [ ] Annual report PDF generates within 10 seconds
- [ ] PDF includes all 8 sections with the correct data per the spec
- [ ] Sign-offs gated correctly — `ndia_submitted_at` cannot be set without `manager_signed_at`
- [ ] Withdrawn-consent participants disappear from new snapshots; existing snapshots redact identifying columns but keep aggregate counts
- [ ] All snapshot reads are within the SW's caseload (managers see all; SWs see only their own)
- [ ] Goal updates create an `audit-trail-ndis` log entry

---

## What this dashboard does NOT do

- Tax calculation or Centrelink income reporting — those happen through Module 27 + Module 33 + the participant's accountant
- Crisis or safety tracking — those use `crisis_events` (already in migration 0012)
- Operational SW workload / billing reconciliation — handled by the SW dashboard
- Real-time dashboards — monthly snapshots are the cadence by design; real-time would invite gaming the metrics
- AI-generated narrative for the annual report — the narrative is SW-written, with optional AI assistance. AI suggesting what to write about a participant's outcome creates audit risk.

---

## Implementation sequencing

This is best built after Priorities 1–5 from the OPUS_BRIEF are live. The dashboard depends on:
- `billing_events` populating cleanly (Priority 2)
- `participant_modules` tracking module state (Priority 3)
- Consent records gating who's eligible for capture (Priority 5)

Once those are live, build in order:
1. Migration 0016 + Drizzle schema additions
2. Monthly snapshot capture job (cron in heartbeatScheduler)
3. tRPC endpoints (participant, SW, manager)
4. Participant `/my-progress` UI
5. SW caseload outcomes view
6. Manager cohort + bottom-quartile review
7. Annual report PDF generator
8. NDIA audit export integration

---

*This dashboard is the single artifact that secures the SLES revenue model. Build it before the first NDIA plan review cycle (typically 9 months after first enrolment).*
