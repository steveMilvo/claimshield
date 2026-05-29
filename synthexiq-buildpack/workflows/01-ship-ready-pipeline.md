# Workflow: Ship-Ready Pipeline
# Build this in Synthexiq Workflow Orchestration

---
name: Ship-Ready Pipeline
description: End-to-end automated release pipeline. Code Review → QA → Deploy → Monitor.
trigger: On PR opened / On manual run
price: $2,500/team/month
estimated_duration: 15-25 minutes per run
---

## Workflow Steps (Sequential)

```
[START]
   │
   ▼
[Step 1] BRANCH CHECK
   Agent: Engineering Manager
   Skill: (inline check)
   Action: Verify branch has changes against base. Abort if clean.
   Output: diff summary, file count, change type classification
   │
   ▼
[Step 2] CODE REVIEW
   Agent: QA Lead
   Skill: Code Review (01-code-review.md)
   Input: git diff from Step 1
   Action: Run Pass 1 (critical) + Pass 2 (informational)
   Output: findings list, AUTO-FIX list, ASK list
   Branch: if CRITICAL findings → [GATE: Human Approval]
           if AUTO-FIX only → continue
   │
   ▼
[Step 3] AUTO-FIX (conditional)
   Agent: Engineering Manager
   Skill: (inline)
   Action: Apply all AUTO-FIX items from Step 2
   Action: Commit with message "fix: auto-fixes from code review"
   Output: list of changes made
   │
   ▼
[Step 4] QA TESTING
   Agent: QA Lead
   Skill: QA Testing (03-qa-testing.md)
   Tier: Standard (configurable)
   Action: Run test suite, triage failures, fix + commit each
   Output: QA report, regression tests added
   Branch: if CRITICAL failures → [GATE: Human Approval]
   │
   ▼
[Step 5] SECURITY SCAN (LIGHT)
   Agent: CISO Agent
   Skill: Security Audit — Phases 1-5 only (fast scan)
   Mode: Daily (8/10 confidence threshold)
   Action: Quick scan of the diff for obvious security issues
   Output: findings, if any
   Branch: if HIGH+ findings → [GATE: Human Approval]
   │
   ▼
[Step 6] SHIP
   Agent: Engineering Manager
   Skill: (inline)
   Action: Open PR with auto-generated description
   PR description includes: what changed, test results, security scan result
   Action: Request review (configurable: auto-merge or await approval)
   │
   ▼
[Step 7] DEPLOY MONITOR (post-merge)
   Agent: Incident Commander Agent
   Skill: (inline)
   Action: Watch error rate for 10 minutes post-deploy
   Action: Compare key metrics to pre-deploy baseline
   Output: deploy health report
   Branch: if error rate rises >20% → trigger Incident Commander workflow
   │
   ▼
[Step 8] RETRO
   Agent: Engineering Manager
   Skill: (inline)
   Action: Generate brief sprint note: what shipped, time taken, issues found
   Action: Save to memory system for trend tracking
   │
   ▼
[END] Notify via Slack/email/Telegram
```

## Gates (Human Approval Points)

```
GATE: Human Approval
─────────────────────
Triggered by: CRITICAL code review finding / CRITICAL QA failure / HIGH security finding

Notification: Slack DM + Email to configured approver

Message format:
  🚨 Ship-Ready paused — approval needed
  
  Pipeline: [repo] / [branch]
  Paused at: [step name]
  
  Issue:
    [finding description]
    [file:line]
    [recommended fix]
  
  Options:
    ✅ Apply recommended fix and continue
    ✏️  I'll fix it — resume when ready
    ❌ Cancel this run
  
  [Approve →]  [Fix myself →]  [Cancel →]

Timeout: 4 hours. If no response, cancel run and notify.
```

## Configuration Options

```yaml
repo: "owner/repo"
base_branch: "main"
trigger: "on_pr | manual | scheduled"
schedule: "0 9 * * 1-5"  # 9am weekdays
qa_tier: "quick | standard | exhaustive"
security_scan: "none | light | full"
auto_merge: false
notify:
  slack_channel: "#dev-team"
  email: "team@company.com"
  telegram: false
auto_fix_minor: true
deploy_monitor_minutes: 10
```

## Outputs Stored
- `.synthexiq/ship-reports/[date]-[pr-number].md` — full run report
- PR description auto-generated with test results
- Retro note appended to memory system
