# ER Advisor — Integration Guide

How to embed ER Advisor (the cited HR/ER advisory module in this repo) into
another app — in particular the L&D app, for the "learn → do" loop described in
`er-advisor-spec.md` §10.

The entire integration surface is **one HTTP endpoint**. The module is
deliberately self-contained (`src/app/advisor/*`, `src/app/api/advisor/*`,
`src/lib/advisor/*`) so it can be lifted wholesale or called as a service.

---

## 1. The endpoint — `POST /api/advisor`

Stateless: send the full running conversation each turn. Returns either a
clarifying-questions turn or a grounded, verified answer.

### Request

```jsonc
{
  // Required. The whole conversation transcript so far.
  "messages": [
    { "role": "user", "content": "An employee 4 months in, casual, keeps showing up late. Can I let them go?" }
    // ...prior assistant + user turns, in order
  ],

  // Optional. The org's own policies — the private second KB layer. When
  // present, the advisor cross-references them against the legislation and
  // flags where company policy demands MORE than the legal floor.
  "policies": [
    { "title": "Disciplinary Procedure", "text": "3.4.5 Before terminating for performance, the manager must issue at least two written warnings and allow a four-week improvement period…" }
  ]
}
```

- `messages[].role` — `"user"` (the manager) or `"assistant"` (a prior ER Advisor reply).
- Resend the entire `messages` array every turn; the server keeps no session.
- `policies[].text` — paste the policy body. Keep clause numbers (e.g. `3.4.5`) so
  they can be cited as `Disciplinary Procedure, cl 3.4.5`.

### Response — two shapes, discriminated by `mode`

**`clarify`** — the advisor needs more facts before advising:

```jsonc
{
  "mode": "clarify",
  "reply": "A couple of quick questions so I can be precise…",
  "questions": ["Is the employee on an award or enterprise agreement?", "How many staff does the business employ?"],
  "facts": { "employeeType": "casual", "award": null, "tenureMonths": 4, "smallBusiness": null, "issue": "conduct" }
}
```

**`advise`** — grounded, verified guidance:

```jsonc
{
  "mode": "advise",
  "reply": "Here's where you stand…",
  "facts": { "employeeType": "casual", "tenureMonths": 4, "smallBusiness": true, "issue": "conduct" },
  "answer": {
    "summary": "On these facts the employee can't bring an unfair dismissal claim, but general protections still apply…",
    "claims": [
      {
        "claim": "A small-business employee must complete 12 months before they are protected from unfair dismissal.",
        "citationLabel": "s.383 Fair Work Act 2009 (Cth)",
        "supported": "supported",          // "supported" | "partial" (never "unsupported" — those are stripped)
        "sourceQuote": "if the employer is a small business employer — 12 months",
        "note": null
      }
    ],
    "droppedCount": 0,                       // claims withheld because they couldn't be grounded
    "nextSteps": [{ "title": "Document the lateness", "detail": "Keep dated records before any conversation." }],
    "riskFlags": [{ "level": "high", "detail": "General protections (s.340) has no minimum period — dismissal could still be challenged." }],
    "asAtDate": "2026-06-01",                // KB version the answer was grounded against
    "sources": [
      { "citationLabel": "s.383 Fair Work Act 2009 (Cth)", "title": "Meaning of minimum employment period", "url": "https://www.legislation.gov.au/...", "version": "2026-06-01", "kind": "legislation" },
      { "citationLabel": "Disciplinary Procedure, cl 3.4.5", "title": "Disciplinary Procedure", "url": null, "version": "company policy", "kind": "company" }
    ]
  }
}
```

Notes:
- `claims` only ever contains `supported` / `partial` items — anything the
  verification pass couldn't ground is removed server-side; `droppedCount` tells
  you how many.
- `sources[].kind` is `"legislation"` or `"company"`. Company sources have
  `url: null` (no public link).

### Errors

Non-2xx responses are `{ "error": "<message>" }`. The most common is a missing
API key (see §3).

---

## 2. Two integration shapes

**Option A — lift the module (recommended for the L&D embed).**
Copy these into the L&D app's Next.js codebase:
- `src/app/advisor/*` — the chat UI (or build your own against the contract)
- `src/app/api/advisor/route.ts` — the endpoint
- `src/lib/advisor/*` — KB, policy KB, prompts, types, jurisdiction config

Dependencies already present in this repo's `package.json`: `@anthropic-ai/sdk`,
`zod`. No other runtime deps.

**Option B — call it as a service.**
Keep this app deployed and have the L&D app `fetch('<host>/api/advisor', …)`.
Cleaner separation, but the endpoint is currently **open** — add auth + CORS
before exposing it cross-origin.

---

## 3. Requirements

- **`ANTHROPIC_API_KEY`** must be set wherever the route runs — it calls Claude
  for the triage/generate and verification passes. Nothing works without it.
  (`cp .env.example .env.local`, set the key.)
- Node runtime (the route is `runtime = "nodejs"`, `maxDuration = 300`).

---

## 4. The "learn → do" hook

To wire the loop from `er-advisor-spec.md` §10 (L&D module → real situation),
seed the conversation with the learner's current module as the first user
message, e.g.:

```ts
const messages = [
  { role: "user", content: `Context: the manager just completed the "Managing Underperformance" module. They ask: ${userQuestion}` },
];
```

And on an `advise` response, surface the relevant L&D module back to the user
based on `answer.facts.issue` (`conduct` → "Managing Conduct", `redundancy` →
"Restructures & Redundancy", etc.) to close the loop the other way.

---

## 5. Minimal client example

```ts
async function askAdvisor(messages, policies) {
  const res = await fetch("/api/advisor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, policies }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data; // { mode: "clarify" | "advise", ... }
}
```

Reference implementation: `src/app/advisor/page.tsx`. Shared types to import:
`src/lib/advisor/types.ts`.
