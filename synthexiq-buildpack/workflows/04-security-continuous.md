# Workflow: Security Continuous (CISO)
# Build this in Synthexiq Workflow Orchestration

---
name: Security Continuous
description: >
  Always-on security monitoring. Full 14-phase audit weekly. Light scan on
  every deploy. Dependency check daily. Monthly executive report.
trigger: Multiple — see schedule below
price: $4,000/org/month
---

## Schedule

```
Daily (6am):    Dependency scan — new CVEs against your package tree
On every PR:    Light security scan — phases 1-5 only (5 min)
On every deploy: Config + secrets scan (2 min)
Weekly (Monday): Full 14-phase audit
Monthly (1st):  Executive security report with trend
```

## Workflow A — Daily Dependency Scan

```
[6:00am daily]
   │
   ▼
[Step 1] PULL DEPENDENCY MANIFEST
   Action: Read package.json / requirements.txt / Gemfile / go.mod
   Action: Compare against yesterday's manifest — what changed?
   │
   ▼
[Step 2] CVE CHECK
   Agent: CISO Agent
   Action: Cross-reference all dependencies against CVE database
   Action: Check for newly published CVEs since yesterday
   Output: new CVEs found, severity, affected package, fix version
   │
   ▼
[Step 3] ROUTE
   Branch A: No new CVEs → log pass, sleep
   Branch B: MEDIUM CVEs → add to weekly digest
   Branch C: HIGH/CRITICAL CVEs → [GATE: Immediate Alert]
   │
   ▼
[GATE: Immediate Alert — HIGH/CRITICAL CVE]
   Message:
     🔴 New HIGH vulnerability in your dependencies
     Package: [name@version]
     CVE: [CVE-XXXX-XXXXX] — CVSS [score]
     Attack: [one-line exploit description]
     Fix: npm install [package@safe-version]
   [Apply Fix ✅]  [I'll handle it 🙋]  [Mark as accepted risk ⚠️]
```

## Workflow B — PR Security Scan (light, on every PR)

```
[PR opened/updated]
   │
   ▼
[Step 1] DIFF EXTRACT
   Action: Get git diff for this PR
   │
   ▼
[Step 2] LIGHT SECURITY SCAN
   Agent: CISO Agent
   Skill: Security Audit — Phases 1, 3, 4, 5, 8 only
   (Architecture, Secrets, Dependencies, CI/CD, LLM Security)
   Mode: Daily (8/10 confidence threshold)
   Duration: ~3 minutes
   │
   ▼
[Step 3] POST RESULT TO PR
   Action: Post security scan result as PR comment
   Format:
     🛡 Security Scan: PASS / ⚠ N findings
     [summary of any findings with file:line]
   Branch: if HIGH+ findings → block merge until resolved
```

## Workflow C — Weekly Full Audit

```
[Monday 8:00am]
   │
   ▼
[Step 1] FULL 14-PHASE AUDIT
   Agent: CISO Agent
   Skill: Security Audit — all 14 phases
   Mode: Comprehensive (2/10 confidence)
   Duration: 45-90 minutes
   │
   ▼
[Step 2] TREND COMPARISON
   Action: Compare to last week's findings
   Output: New findings / Resolved findings / Ongoing findings
   │
   ▼
[Step 3] REPORT GENERATION
   Agent: Tech Writer Agent
   Action: Generate structured weekly security report
   Action: Save to .synthexiq/security-reports/[date]-weekly.pdf
   │
   ▼
[Step 4] ROUTE BY RESULT
   Branch A: No HIGH+ findings → send report, update score
   Branch B: HIGH+ findings → [GATE: Human Review]
   │
   ▼
[GATE: Weekly Review]
   Send report to security owner / CISO
   List all HIGH+ findings requiring action
   Include suggested remediation order (quick wins first)
   [Assign to team →]  [Mark as accepted risk →]
```

## Workflow D — Monthly Executive Report

```
[1st of month, 9:00am]
   │
   ▼
[Step 1] AGGREGATE MONTH DATA
   Action: Pull all weekly reports from last month
   Action: Pull all CVE alerts
   Action: Pull compliance audit results (if Compliance Autopilot connected)
   │
   ▼
[Step 2] EXECUTIVE REPORT
   Agent: CEO Agent + Tech Writer Agent
   Content:
     - Security score this month vs last month
     - Total findings: new / resolved / ongoing
     - Top 3 risks and their status
     - Dependencies updated
     - Compliance status (if applicable)
     - Recommended priorities for next month
   Format: PDF, board-ready, plain English
   │
   ▼
[Step 3] DISTRIBUTE
   Action: Email to configured exec recipients
   Action: Post summary to Slack (#security or #leadership)
```
