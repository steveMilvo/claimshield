# Pricing & Access Model
# Implement this in Synthexiq's billing and dashboard layers

## Plans

### Starter — $49/seat/month
Included products (full access):
- Code Review (50 PR reviews/month, 1 repo)
- Doc-as-Code (auto-docs for 1 repo)
- Founder Sprint (1 sprint/month)
- Auto-Retro (1 retro/month)

Lite tier (permanent, included for all subscribers):
- Security Audit: 1 scan/month, top 5 findings only
- Compliance: 1 standard, weekly check, no audit pack
- QA Testing: 5 runs/month
- Ship-Ready: 5 PR reviews/month, no auto-deploy
- Incident Commander: view past incidents only

### Pro — $199/seat/month
Everything in Starter, plus full access to:
- Sprint Planner (unlimited)
- QA Testing (unlimited runs)
- Design Critique (unlimited)
- Incident Commander (live response + auto-fix)
- Ship-Ready Pipeline (unlimited, all repos)
- Founder Sprint (unlimited)
- Browser automation (Playwright service)

Lite tier on:
- Security Continuous: weekly scan, no executive report
- Compliance Autopilot: 1 standard, no audit pack

### Enterprise — $999/seat/month
Everything in Pro, plus:
- Security Continuous (full — all phases, executive reports)
- Compliance Autopilot (all standards, audit pack on demand)
- Diligence AI (2 engagements/month)
- Mobile QA
- SSO + audit logs
- SLA (99.9% uptime guarantee, 4-hour response)
- Custom industry bundles
- On-prem deployment option

### Vertical OS Bundles — Flat org pricing
- Real Estate OS: $2,000/org/month
- Aged Care OS: $3,000/org/month
- NDIS OS: $4,000/org/month
- Custom vertical: from $5,000/org/month

All bundles include: Sprint Planner + Compliance Autopilot (relevant standard) +
Code Review + QA Testing + Auto-Retro + Incident Commander (SEV3/4 autonomous only)

### One-Off Engagements (no subscription required)
- Diligence AI (full repo): $25,000 flat
- Security Audit (one-off): $2,500–$5,000 depending on codebase size
- AU Compliance Audit Pack (one-off): $2,000–$10,000
- Pre-Launch QA Pack: $499

---

## Bundle Discounts (multi-product subscriptions)

| Active products | Discount |
|---|---|
| 1 | Full price |
| 2 | 20% off all |
| 3 | 30% off all |
| 4+ | 40% off all (Pro plan required) |

---

## Trial Rules

### Free Trial (14 days)
- Activated with one click from dashboard — no credit card required
- Available for every product not currently subscribed
- Full access during trial (same as paid tier)
- Pro subscribers get 30-day trials on new products
- Enterprise subscribers get full access to all products during contract

### Trial Extension
- Trial automatically extends by 1 day for each day the product is actively used
- Max extension: 7 extra days (21 days total)
- Rationale: reward engagement, reduce churn from "ran out of time to evaluate"

### Trial to Paid Conversion
- Day 12: Email "Your trial ends in 2 days — here's what you've found so far"
- Day 14: "Trial ended — subscribe to keep your findings and continue monitoring"
- Work done during trial is preserved if they subscribe within 7 days
- If not subscribed within 7 days: data archived (recoverable on subscribe)

### Permanent Lite Tier
After trial ends, product downgrades to lite (not removed entirely):
- Keeps them in the ecosystem
- Creates natural upgrade moment when they hit limits
- Removes the hard wall that drives churn

---

## Upgrade Trigger Events

These events should show an upgrade prompt in the UI:

1. Lite tier limit hit (e.g. 6th PR review of the month)
   Prompt: "You've used all 5 free reviews. Upgrade to Pro for unlimited."

2. Cross-product alert
   Prompt: "Security scan found 3 issues. Ship-Ready can auto-fix these — try it free."

3. Trial day 12
   Email + in-app: "2 days left — your [product] trial has found [N] issues."

4. Feature gate
   When agent would do something requiring higher tier, show exactly what it
   would do and what it costs to unlock. Never a generic "upgrade" message.

---

## Billing Implementation Notes

- Stripe for payments (subscription + one-off)
- Seat-based: charge per named user, not per workspace
- Org billing: one invoice, org admin manages seats
- Usage-based for lite tier limits: track PR reviews, scans, sprints per billing period
- Annual plan: 2 months free (equivalent to 17% discount)
- Refund policy: 30-day money-back, no questions asked

---

## Dashboard Access Rules

```
User logs in → single dashboard
├── Shows ALL products (not just subscribed ones)
├── Subscribed products: full access badge + [Open →]
├── Trialling products: trial badge + days remaining + [Open →]
├── Lite tier: usage meter + [Upgrade →] when near limit
└── Untrialled products: [Try Free for 14 days →]
```

Cross-product data sharing (with user consent):
- Security score feeds into Compliance Autopilot dashboard
- Ship-Ready failures feed into Incident Commander history
- Compliance gaps feed into Security Continuous score
- All data visible from one dashboard view
