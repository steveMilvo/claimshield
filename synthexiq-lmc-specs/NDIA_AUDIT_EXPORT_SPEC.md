# NDIA Audit Export Format
## AI Launchpad LMC — evidence format for NDIS Capacity Building claims

**Purpose:** When the NDIA (National Disability Insurance Agency) audits the AI Launchpad provider for **Capacity Building — Skill Development** claims, the provider must produce timestamped evidence proving each claimed session actually happened and met the line-item criteria.

This spec defines the export format the provider produces from the SynthexIQ `billing_events` table and supporting records.

**Retention:** 7 years from the date of the last service interaction (NDIS Practice Standards 2021, Records and Information Management).

---

## What an NDIA auditor will ask for

In a typical audit, the auditor specifies a window (e.g. April–June 2026) and a participant cohort. They expect, per claimed event:

1. **Identification** — participant + provider + worker
2. **Timestamps** — opened at, closed at, duration (proves it happened in the claim period)
3. **Line item** — exact NDIS price-guide line item code
4. **Outcome** — what the participant did, what the worker reviewed
5. **Audit trail** — a link to the underlying record (skill output, message text, replied template)
6. **Worker identity** — qualified support worker, with their qualifications on file
7. **Service category mapping** — Capacity Building — Skill Development (subcategory)

The export below is structured to answer all of those in one row.

---

## Export schema (CSV — the NDIA's preferred format)

**Filename convention:**
`ndis-audit-export_<providerABN>_<weekStarting>_<exportTimestamp>.csv`

Example: `ndis-audit-export_12345678901_2026-04-01_20260408T091500Z.csv`

**Columns (in this exact order):**

| # | Column | Type | Source | Example |
|---|---|---|---|---|
| 1 | `record_id` | uuid | generated at export | `f47ac10b-58cc-...` |
| 2 | `event_id` | int | `billing_events.id` | `12847` |
| 3 | `provider_abn` | string(11) | provider config | `12345678901` |
| 4 | `provider_registration_id` | string | provider config | `4-3KL5MNO` |
| 5 | `participant_ndis_number` | string(9) | `users.ndis_number` | `430123456` |
| 6 | `participant_full_name` | string | `users.full_name` | `Sarah Khouri` |
| 7 | `participant_date_of_birth` | date | `users.dob` | `1989-03-14` |
| 8 | `worker_full_name` | string | `users.full_name` (SW row) | `Lisa Thompson` |
| 9 | `worker_role` | enum | `users.role` | `support_worker` |
| 10 | `worker_qualification_ref` | string | `users.qualification_ref` | `CHCDIS003-2024-0042` |
| 11 | `service_date` | date (AU) | `billing_events.triggered_at` (date portion) | `2026-04-03` |
| 12 | `service_start_time` | time (24h AEST) | `billing_events.triggered_at` | `10:45` |
| 13 | `service_end_time` | time (24h AEST) | `billing_events.closed_at` | `11:03` |
| 14 | `service_duration_minutes` | int | `billing_events.duration_seconds / 60` | `18` |
| 15 | `ndis_line_item_code` | string | per the NDIS Pricing Arrangements catalog | `09_006_0117_6_3` |
| 16 | `ndis_line_item_label` | string | catalog lookup | `Capacity Building — Skill Development — Individual Skill Development` |
| 17 | `service_category` | string | fixed | `Capacity Building` |
| 18 | `service_sub_category` | string | fixed | `Improved Daily Living Skills` |
| 19 | `service_delivery_mode` | enum | `event.delivery_mode` | `async_telegram_review` / `sync_voice_call` / `sync_video_call` / `in_person_field_visit` / `group_workshop` |
| 20 | `learning_module_ref` | string | `Module ${moduleNum}` / `Module 04B` | `Module 07 — Pricing My Stuff` |
| 21 | `touchpoint_label` | string | `Touchpoint A/B/C` | `Touchpoint B — Market Research Critique` |
| 22 | `participant_action` | text | summary from `learner_submissions` | `Ran ChatGPT competitor scan; submitted screenshot.` |
| 23 | `worker_action` | text | summary from SW reply | `Reviewed AI output, confirmed price range, suggested floor adjustment.` |
| 24 | `outcome_evidence_ref` | string | URL to audit_trail record | `/audit/ndis/2026/04/event-12847` |
| 25 | `template_id_used` | string | from SW dashboard | `TP-07-B` |
| 26 | `template_variant_used` | enum | `approve` / `tweak` / `reroute` / `safety` | `tweak` |
| 27 | `participant_consent_version` | string | `participant_consents.consent_text_version` | `v1.0` |
| 28 | `participant_consent_at` | datetime | `participant_consents.consented_at` | `2026-02-15T09:12:00+10:00` |
| 29 | `exported_at` | datetime | now | `2026-04-08T09:15:00+10:00` |
| 30 | `export_signature` | string(64) | HMAC-SHA256 of cols 1–29 with provider secret | `a4f8c1...` |

**Why column 30 (`export_signature`)?** Tamper-evidence. If a row is edited after export, the signature won't verify. The provider's secret is rotated annually, stored in the secrets manager, and audited.

---

## Worked example — single row

```csv
record_id,event_id,provider_abn,provider_registration_id,participant_ndis_number,participant_full_name,participant_date_of_birth,worker_full_name,worker_role,worker_qualification_ref,service_date,service_start_time,service_end_time,service_duration_minutes,ndis_line_item_code,ndis_line_item_label,service_category,service_sub_category,service_delivery_mode,learning_module_ref,touchpoint_label,participant_action,worker_action,outcome_evidence_ref,template_id_used,template_variant_used,participant_consent_version,participant_consent_at,exported_at,export_signature
f47ac10b-58cc-4372-a567-0e02b2c3d479,12847,12345678901,4-3KL5MNO,430123456,Sarah Khouri,1989-03-14,Lisa Thompson,support_worker,CHCDIS003-2024-0042,2026-04-03,10:45,11:03,18,09_006_0117_6_3,Capacity Building — Skill Development — Individual Skill Development,Capacity Building,Improved Daily Living Skills,async_telegram_review,Module 07 — Pricing My Stuff,Touchpoint B — Market Research Critique,Ran ChatGPT competitor scan; submitted screenshot of 3-tier price range.,Reviewed AI output; confirmed range fits suburb; suggested floor adjustment from $35 to $40.,/audit/ndis/2026/04/event-12847,TP-07-B,tweak,v1.0,2026-02-15T09:12:00+10:00,2026-04-08T09:15:00+10:00,a4f8c1b3d2e5...
```

---

## JSON variant (for systems that prefer it)

Some auditors will accept JSON; some won't. Generate both at export and let the auditor pick.

```json
{
  "export_metadata": {
    "provider_abn": "12345678901",
    "week_starting": "2026-04-01",
    "exported_at": "2026-04-08T09:15:00+10:00",
    "rows_total": 287,
    "schema_version": "1.0",
    "tamper_check_algorithm": "HMAC-SHA256"
  },
  "events": [
    {
      "record_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "event_id": 12847,
      "participant": {
        "ndis_number": "430123456",
        "full_name": "Sarah Khouri",
        "dob": "1989-03-14",
        "consent": { "version": "v1.0", "consented_at": "2026-02-15T09:12:00+10:00" }
      },
      "worker": {
        "full_name": "Lisa Thompson",
        "role": "support_worker",
        "qualification_ref": "CHCDIS003-2024-0042"
      },
      "service": {
        "date": "2026-04-03",
        "start_time": "10:45",
        "end_time": "11:03",
        "duration_minutes": 18,
        "ndis_line_item_code": "09_006_0117_6_3",
        "ndis_line_item_label": "Capacity Building — Skill Development — Individual Skill Development",
        "category": "Capacity Building",
        "sub_category": "Improved Daily Living Skills",
        "delivery_mode": "async_telegram_review"
      },
      "lmc_context": {
        "module_ref": "Module 07 — Pricing My Stuff",
        "touchpoint_label": "Touchpoint B — Market Research Critique",
        "participant_action": "Ran ChatGPT competitor scan; submitted screenshot of 3-tier price range.",
        "worker_action": "Reviewed AI output; confirmed range fits suburb; suggested floor adjustment.",
        "template_id_used": "TP-07-B",
        "template_variant_used": "tweak"
      },
      "outcome_evidence_ref": "/audit/ndis/2026/04/event-12847",
      "export_signature": "a4f8c1b3d2e5..."
    }
  ]
}
```

---

## NDIS line item code mapping

Map `billing_events.ndis_line_item` text to the code the NDIA expects in their pricing arrangements catalog. Maintain this mapping in a configuration table:

| Internal label | NDIS line item code | Catalog name |
|---|---|---|
| Capacity Building — Skill Development | `09_006_0117_6_3` | Individual Skill Development and Training |
| Capacity Building — Skill Development (group workshop) | `09_007_0117_6_3` | Group Skill Development and Training |
| Capacity Building — Field Support (Local SW visit) | `15_056_0128_1_3` | Field-based Support (Individual) |
| Affiliate Pathway (NOT NDIS-billable by default) | *not exported* | *redacted from NDIA exports* |

**Important:** the codes above are the structural format used by the NDIA. **Verify exact current codes against the current NDIS Pricing Arrangements and Price Limits document before going live.** Codes change between price guide releases (typically July each year).

---

## Reconciliation rules

When the provider's claim submission (lodged with the NDIA portal) is compared to this export:

1. **One claim line = one billing_events row.** Never aggregate. If the claim is for 18 minutes, the row's `service_duration_minutes` should equal 18 — not rounded up to 30.
2. **Sum of weekly export minutes** ≈ sum of weekly claim minutes (allow ±1 min per row for clock drift; reject larger discrepancies for investigation).
3. **Every claimed event must have `closed_at`.** No open events in the export — open events have no end time and aren't billable yet.
4. **`participant_consent_at` must precede `service_date`.** A service delivered before consent was given is not claimable.
5. **`worker_qualification_ref` must be present.** A claim from an unqualified worker is disallowed under NDIS Practice Standards.

The dashboard reconciliation view (`/sw/reports`) should run these checks before allowing the CSV export download.

---

## Privacy and data minimisation

Even though the auditor needs identifying information, the export should:

- Be generated on-demand, not stored long-term
- Be downloaded over HTTPS only
- Be delivered as a one-time download URL (24-hour expiry)
- Log every export (who exported, when, which rows, what date range) via `audit-trail-ndis`
- Redact any participant who has withdrawn consent (`participant_consents.withdrawn_at IS NOT NULL`) by replacing identifying columns with `[WITHDRAWN]` while keeping the event ID for accounting

The provider's privacy officer reviews every export before sending to the NDIA.

---

## tRPC endpoints Cowork needs to build

```ts
// Manager / billing officer only — not regular SW
trpc.ndia.previewExport.query({
  weekStarting: ISO8601, weekEnding: ISO8601, format: "csv" | "json"
})
→ {
    rowCount: number,
    minutesTotal: number,
    discrepancies: Array<{ eventId, issue }>,
    rowsRedactedForConsent: number
  }

trpc.ndia.generateExport.mutate({
  weekStarting, weekEnding, format,
  privacyOfficerApproval: { officerEmail, approvedAt }
})
→ { downloadUrl, expiresAt }   // 24-hour signed URL

trpc.ndia.listPastExports.query()
→ Array<{ exportId, generatedAt, generatedBy, format, rowCount, downloaded }>
```

---

## Acceptance criteria

- [ ] Exporting one week of events produces a valid CSV that passes a column-count check
- [ ] HMAC-SHA256 signature on each row verifies with the provider's secret
- [ ] Reconciliation runs find zero discrepancies on a clean test dataset
- [ ] Reconciliation runs flag any event with `closed_at IS NULL`
- [ ] Withdrawn-consent participants appear with `[WITHDRAWN]` columns but their event IDs are preserved
- [ ] Privacy officer approval is mandatory before the download URL is issued
- [ ] All exports are logged in `audit-trail-ndis` with 7-year retention
- [ ] CSV file is UTF-8 with BOM (Excel-friendly) and uses `\r\n` line endings
