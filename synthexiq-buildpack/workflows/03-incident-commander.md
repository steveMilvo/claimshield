# Workflow: Incident Commander
# Build this in Synthexiq Workflow Orchestration

---
name: Incident Commander
description: >
  Automated production incident response. Triages, diagnoses, drafts fix,
  gets human approval, applies, monitors, writes post-mortem.
trigger: Monitoring webhook / Manual declaration / On-call alert
price: $3,000/team/month
estimated_duration: 5-45 min depending on severity
---

## Workflow

```
[TRIGGER — error spike / manual / alert]
   │
   ▼
[Step 1] TRIAGE
   Agent: Incident Commander Agent
   Skill: Incident Commander (06-incident-commander.md)
   Action: Classify SEV1 / SEV2 / SEV3 / SEV4
   Action: If SEV1 or SEV2 → page on-call human immediately (do not wait)
   Output: severity + one-line description
   │
   ▼
[Step 2] EVIDENCE COLLECTION
   Agent: Incident Commander Agent
   Action: Pull error logs (last 30 min)
   Action: Pull recent deployments (last 4 hours)
   Action: Pull infrastructure metrics (CPU, memory, DB, error rate, latency)
   Action: Check monitoring dashboards via API Connector
   Output: evidence package with timeline
   │
   ▼
[Step 3] PARALLEL HYPOTHESES
   Agent: Incident Commander Agent (spawns 3-5 sub-agents in parallel)
   Each sub-agent investigates one hypothesis:
     Sub-agent A: "Was it a bad deploy?"
     Sub-agent B: "Is it a DB issue?"
     Sub-agent C: "Is it an external dependency?"
     Sub-agent D: "Is it a traffic/load issue?"
     Sub-agent E: "Is it a config change?"
   Each returns: evidence for / evidence against / confidence score
   │
   ▼
[Step 4] ROOT CAUSE DETERMINATION
   Agent: Incident Commander Agent
   Action: Synthesise sub-agent findings
   Action: Mark each hypothesis CONFIRMED / REFUTED / INCONCLUSIVE
   Action: Identify most likely root cause
   │
   ▼
[Step 5] FIX PROPOSAL
   Agent: Incident Commander Agent + Engineering Manager
   Action: Draft minimal fix for root cause
   Action: Assess blast radius
   Action: Prepare rollback plan
   │
   ▼
[GATE: Human Approval] (SEV1/SEV2 always — SEV3/SEV4 if fix is large)
   Notification: Slack DM + SMS to on-call
   Message:
     🔴 INCIDENT: [one-line description]
     Duration: [X minutes]
     Root cause: [one sentence]
     Proposed fix: [specific change]
     Blast radius: [what else could be affected]
     Rollback: [how to undo in <2 min]
   
   [Apply Fix ✅]  [Suggest Alternative ✏️]  [I'll handle it 🙋]
   
   Timeout: 10 min for SEV1, 30 min for SEV2. If no response, escalate.
   │
   ▼
[Step 6] APPLY FIX
   Agent: Engineering Manager
   Action: Apply approved fix
   Action: Monitor error rate for 10 minutes
   Branch A: Error rate drops → proceed to post-mortem
   Branch B: Error rate stays/rises → REVERT, re-enter Step 3
   │
   ▼
[Step 7] POST-MORTEM
   Agent: Tech Writer Agent
   Skill: Incident Commander (post-mortem section)
   Action: Generate structured post-mortem
   Action: Save to .synthexiq/incident-reports/[date]-[sev]-[slug].md
   Action: Send to team via configured channel
   │
   ▼
[END] Update incident log, notify resolution
```

## Configuration

```yaml
monitoring_webhooks:
  - provider: "datadog"
    url: "https://app.datadoghq.com/api/v1/webhooks"
    trigger_on: "error_rate_spike | p99_latency | service_down"
  - provider: "pagerduty"
    passthrough: true

escalation:
  sev1:
    page_immediately: true
    contacts: ["oncall@company.com", "+61400000000"]
    approval_timeout_minutes: 10
  sev2:
    page_immediately: true
    approval_timeout_minutes: 30
  sev3:
    page_immediately: false
    resolve_autonomously: true
  sev4:
    page_immediately: false
    resolve_autonomously: true
    include_in_daily_digest: true

notify:
  slack_channel: "#incidents"
  email: "eng@company.com"
  sms: true

post_mortem:
  auto_generate: true
  required_for_severity: ["sev1", "sev2"]
  due_hours_after_resolution: 24
```
