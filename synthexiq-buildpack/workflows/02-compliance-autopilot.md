# Workflow: Compliance Autopilot
# Build this in Synthexiq Workflow Orchestration

---
name: Compliance Autopilot
description: >
  Continuous compliance monitoring for AU regulated industries.
  Daily checks, auto-updated docs, on-demand audit packs.
trigger: Daily schedule + On document/record change + Manual
price: $999–$8,000/org/month depending on standards
estimated_duration: 5 min (daily check) / 2 hours (full audit pack)
---

## Workflow A — Daily Check (runs every morning at 6am)

```
[START — 6:00am daily]
   │
   ▼
[Step 1] COLLECT CHANGES
   Agent: Compliance Agent
   Action: Pull all records/documents changed since last check
   Sources: connected records system, document store, config changes
   Output: change manifest with timestamps
   │
   ▼
[Step 2] COMPLIANCE CHECK
   Agent: Compliance Agent
   Skill: Compliance Audit AU (05-compliance-audit.md)
   Mode: Daily Check
   Standards: configured per org (NDIS / Aged Care / Privacy Act / custom)
   Action: Check each change against applicable clauses
   Output: gap list with severity
   │
   ▼
[Step 3] ROUTE BY RESULT
   Branch A: No gaps found → log pass, update compliance score, sleep
   Branch B: LOW/MEDIUM gaps → compile advisory, send daily digest
   Branch C: HIGH/CRITICAL gaps → [GATE: Immediate Alert]
   │
   ▼
[Step 4A — Advisory] DAILY DIGEST
   Agent: Tech Writer Agent
   Action: Write plain-English summary of any LOW/MEDIUM gaps
   Action: Include specific remediation steps and deadlines
   Action: Send via configured channel (email / Slack / Telegram)
   │
   ▼
[Step 4B — Alert] IMMEDIATE ALERT (HIGH/CRITICAL)
   Action: Page compliance manager immediately
   Message: specific clause, specific gap, required action, deadline
   Action: Block any related workflow from proceeding (if connected)
   │
   ▼
[Step 5] UPDATE SCORE
   Action: Update organisation compliance score
   Action: Append to trend log for monthly report
   │
   ▼
[END] Log to audit trail
```

## Workflow B — Full Audit Pack (on demand)

```
[START — manual trigger]
   │
   ▼
[Step 1] SCOPE CONFIRMATION
   Agent: Compliance Agent
   Action: Confirm which standards, date range, and record sets to cover
   [GATE: Human confirms scope before proceeding]
   │
   ▼
[Step 2] COMPREHENSIVE SCAN
   Agent: Compliance Agent
   Skill: Compliance Audit AU — Full Audit Pack mode
   Action: Scan all records against all applicable standard clauses
   Action: Document what was checked, what passed, what failed
   Duration: ~90 minutes for typical organisation
   │
   ▼
[Step 3] EVIDENCE COMPILATION
   Agent: Tech Writer Agent
   Action: Format findings into audit-ready document
   Action: One section per standard, one entry per clause
   Action: Include evidence citations (record IDs, document names, dates)
   │
   ▼
[Step 4] EXECUTIVE SUMMARY
   Agent: CEO Agent
   Action: Write plain-English summary for board/leadership
   Action: Highlight top 3 risks, overall score, trend vs last audit
   │
   ▼
[Step 5] GENERATE PACK
   Action: Compile into formatted PDF
   Action: Save to .synthexiq/compliance-reports/[date]-audit-pack.pdf
   Action: Notify requester with download link
   │
   ▼
[END]
```

## Workflow C — Document Auto-Update

```
[TRIGGER — regulation or policy update detected]
   │
   ▼
[Step 1] IDENTIFY IMPACT
   Agent: Compliance Agent
   Action: Identify which internal documents are affected by the change
   Output: list of documents needing update
   │
   ▼
[Step 2] UPDATE DOCUMENTS
   Agent: Tech Writer Agent
   Action: Update each affected document to reflect new requirements
   Action: Track changes clearly
   [GATE: Human reviews changes before saving]
   │
   ▼
[Step 3] NOTIFY
   Action: Alert compliance manager of updates made
   Action: Log change with effective date to audit trail
```

## Configuration

```yaml
standards:
  - ndis_practice_standards_2021
  - aged_care_quality_standards_2019
  - privacy_act_1988
  # - custom: "path/to/custom-standard.md"

daily_check:
  time: "06:00"
  timezone: "Australia/Sydney"
  notify_on_pass: false
  notify_on_low: "daily_digest"
  notify_on_high: "immediate"

notify:
  compliance_manager: "compliance@company.com"
  slack_channel: "#compliance"
  telegram: false

audit_pack:
  auto_schedule: "quarterly"  # or: monthly / on_demand_only
  format: "pdf"
  include_evidence: true

connected_systems:
  records: "https://your-records-api.com"
  documents: "google_drive | sharepoint | local"
```
