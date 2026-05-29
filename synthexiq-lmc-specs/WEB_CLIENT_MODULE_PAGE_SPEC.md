# Web Client — Module Page Spec
## AI Launchpad LMC participant-facing front-end

**For:** the team building the AI Launchpad web client (any framework — this spec is framework-neutral)
**Reads from:** SynthexIQ tRPC API (`trpc.lmc.*` endpoints — see Priority 3d in `OPUS_BRIEF.md`)
**Audience:** NDIS participants with low literacy / low numeracy. Most will access on a phone.

---

## Design principles (every page must obey)

1. **Mobile-first.** Design for one thumb on a phone. Desktop view is automatic from there.
2. **Year 6 reading level** in every label, button, error message, tooltip.
3. **Voice input on every text field.** Browser Web Speech API. No exceptions.
4. **One action per screen.** Never give the learner more than one obvious next thing to tap.
5. **Big touch targets.** Minimum 44×44 px hit area. No tiny links inside paragraphs.
6. **High contrast.** WCAG AA minimum. AAA preferred. No grey-on-grey.
7. **Never use a colour to convey state alone.** Always pair with an icon or text label.
8. **Plain language errors.** "Something went wrong. Try again." beats "Error 503: upstream timeout".
9. **Never block on long network calls.** Show a friendly loading state and an offline fallback.
10. **No marketing copy.** Every word on the page either teaches, instructs, or confirms.

---

## Information architecture

```
/                       Module list (homepage when logged in)
/learn/04b              Module page — AI Tools Tour
/learn/05               Module page — Selling Online
/learn/06 ... /learn/24 Module pages
/learn/ca/01            Optional pathway — Compliance Agent CA-01
/learn/ca/02 ... /06    CA pathway pages
/account                Account, consent, support contact
/account/journey        "My Journey" — milestones, alumni, certificate
```

All module pages share the same layout — only the content varies.

---

## Page 1 — Module List (homepage)

### Purpose
Show every module with its lock state and progress. Make the ONE next module obvious.

### Data (tRPC)
```
trpc.lmc.learnerProgress.query()
→ Array<{
    moduleNum: number | "04b" | "CAxx",
    title: string,
    status: "locked" | "unlocked" | "in_progress" | "completed",
    touchpointA: "not_started" | "open" | "closed",
    touchpointB: "not_started" | "open" | "closed",
    touchpointC: "not_started" | "open" | "closed",
    unlockedAt: ISO8601 | null,
    completedAt: ISO8601 | null
  }>
```

### Layout
- Header: learner's first name + a 1-line encouraging status ("You're on Module 7 of 21").
- Big "Continue" button → routes to the current `in_progress` module.
- Below: a vertical list of module cards. Each card:
  - Module number + title (large, bold)
  - Status pill: 🔒 Locked / ▶️ Open / ✅ Done
  - 3 small dots showing touchpoint A/B/C state (filled = closed)
  - If completed: green border + "Done [DATE]"
  - If locked: greyed out, tap shows: "Finish Module [PREV] first"
- Footer: "Need help? Chat with the bot 💬" — opens Telegram deep link.

### Accessibility
- Card tap target = whole card, not just the title.
- Screen reader: each card announces "Module 7, Pricing My Stuff, in progress, 1 of 3 touchpoints done."

---

## Page 2 — Module Page (the main screen)

This is where 80% of learner time is spent. Get it right.

### Data (tRPC)
```
trpc.lmc.moduleContent.query({ moduleNum })
→ {
    title, goal, introVideoUrl, whatToDo: string[], whatYouWillMake,
    aiSuperpowerSidebar,
    openActivity: {
      title, durationMins,
      steps: Array<{
        stepNum, title, durationMins, instructions,
        aiPrompt: { text, targetTool: "chatgpt"|"claude"|"gemini" } | null,
        honestyRule: string | null,
        whyThisMatters: string | null
      }>
    },
    touchpoints: {
      a: TouchpointMeta,
      b: TouchpointMeta,
      c: TouchpointMeta
    },
    botHelp: Array<{ command: string, what: string }>,
    checkInQuestion: string,
    quiz: { question: string, options: string[], correctIndex: number }
  }

trpc.lmc.touchpointState.query({ moduleNum })
→ {
    a: { status, openedAt, closedAt },
    b: { status, openedAt, closedAt },
    c: { status, openedAt, closedAt }
  }
```

### Layout (top to bottom)

#### Header strip
- Back arrow ← (to module list)
- Module number + title
- 3 touchpoint dots (live state — repaints when API reports a state change)

#### Intro video
- 15-second autoplay-muted video (the Seedance intro from the LMC doc)
- Captions on by default (accessibility)
- Tap to expand to full screen

#### Goal box
- One sentence in a soft-coloured box. Big text.

#### What to Do (numbered list)
- 5 numbered items. Big tap targets — each row is tappable to expand for details.

#### What You Will Make
- Two-line summary of the tangible artefact.

#### AI Superpower sidebar
- Pull-quote style. Distinct background. The "this wasn't possible before" framing.

#### Open Activity (the heart of the page)
For each step:
- Step number + title (large)
- Duration badge (e.g. "15 min")
- Instructions (plain text)
- **If `aiPrompt` present:**
  - Prompt body in a monospace block
  - **Big "Copy prompt" button** (one tap → clipboard, confirmation toast: "Copied!")
  - **"Open ChatGPT" / "Open Claude" / "Open Gemini" button** below, deep-links to the right tool. On mobile, opens the app if installed; otherwise the web URL.
- If `honestyRule` present: red-tinted box, "⚠️ Honesty rule: …"
- If `whyThisMatters` present: blue-tinted box, "Why this matters: …"

#### Billable Touchpoints section
Three cards (A, B, C). Each card shows:
- Touchpoint letter + title
- Status: ⚪ Not started / 🟡 Open (waiting on SW) / ✅ Done
- Duration badge
- Description of what the SW will check
- **If `Not started`:** a big "Submit my work" button that:
  1. Opens a confirmation: "Ready? Your SW will get a notification."
  2. On confirm, performs the **trigger phrase submission flow** (see below)
- **If `Open`:** shows "Waiting for [SW first name] — usually replies within X hours" + a "Chat with bot" link
- **If `Done`:** shows "✅ Closed [DATE/TIME]" + a "What [SW first name] said:" expandable section with the reply

#### Telegram Bot Help block
- A list of `/command — what it does` entries
- Each row is tappable → copies the command to clipboard and opens Telegram deep link

#### Check-In Question
- A yes/no toggle. Stores the answer locally (and via `trpc.lmc.checkIn.mutate`).

#### Quiz Question
- Multiple choice. On submit, shows correct/incorrect with the reason. Mistakes are okay — no penalty.

#### Footer
- "Need help? Chat with the bot 💬" deep link
- "Report a problem with this page" link → opens email/contact form

### Trigger phrase submission flow

When the learner taps "Submit my work" on a touchpoint:

1. Web client calls `trpc.lmc.composeTriggerLink.query({ moduleNum, touchpoint })` →
   returns a Telegram deep-link URL of the form:
   `https://t.me/<bot_username>?start=submit_modNN_x`
2. Web client opens the deep link. The Telegram app launches (or web Telegram on desktop).
3. The bot greets the learner with a prefilled chat: "Tap send to submit Touchpoint X for Module N."
4. The learner taps send — that fires the slash command. The bot's `handleLmcTrigger`
   creates the `billing_events` row and notifies the SW.
5. Back in the web client, the touchpoint card shows "⏳ Sent! Now send your work
   (screenshot, photo, or message) in Telegram."
6. Polling: the web client refreshes `trpc.lmc.touchpointState.query` every 30s while
   any touchpoint is `Open`. When the SW reply closes the event, the card updates live.

**Why deep link to Telegram instead of submitting in-app?** Because the participant's
work itself (the photo, the screenshot, the voice note) is sent in Telegram — that's
where the SW reviews it. Forcing them to upload in two places doubles the work.

---

## Accessibility specifics

### Voice input
Every text field surfaces a microphone icon. Tap → Browser Web Speech API records →
transcribes → fills the field. Cancel = tap mic again. Works in Chrome, Edge,
Safari iOS 14.5+.

Fallback for unsupported browsers: hide the mic icon, do not error.

### Font size
Default 18px base, 16px minimum. User can scale to 22px via account preference (stored
in `users.font_pref`). All layouts must reflow at 22px without horizontal scroll.

### Colour
Two themes: Default, High Contrast. High Contrast = pure black on pure white + bold
borders on every interactive element. User toggles in account settings.

### Reduced motion
Respect `prefers-reduced-motion`. Disable autoplay videos. Replace card hover animations
with instant state changes.

### Screen reader
Every interactive element has an aria-label that says what it does, not what it is.
"Copy the AI prompt to clipboard" beats "button-12".

### Offline / poor signal
If the API is unreachable, show a friendly banner: "Offline — your last view is here."
Cache the current module page content locally (service worker). Touchpoint submission
fails gracefully: "We'll send this when you're back online" + queues the action.

---

## State management

### What lives in the client
- Cached module content (rarely changes — invalidate on version bump from the API)
- Local UI state (which step is expanded, quiz answers in progress)
- Offline queue (touchpoint submissions awaiting connectivity)

### What lives on the server
- Touchpoint state (`billing_events`, `participant_modules`)
- Quiz answers and check-in responses
- All milestones, certificate generation, alumni list

### Polling rules
- Module page open + any touchpoint Open: poll `touchpointState` every 30s
- Module page open + no Open touchpoints: poll every 5 min
- Module list page: poll `learnerProgress` every 60s while visible
- Pause polling when tab is hidden (Page Visibility API)

---

## tRPC endpoints the web client needs (Cowork will build)

```ts
// Already in OPUS_BRIEF Priority 3d:
trpc.lmc.moduleState({ participantEmail, moduleNum })

// Additional endpoints this spec requires:
trpc.lmc.learnerProgress.query()
trpc.lmc.moduleContent.query({ moduleNum })           // returns LMC content from KB
trpc.lmc.touchpointState.query({ moduleNum })
trpc.lmc.composeTriggerLink.query({ moduleNum, touchpoint })  // returns Telegram deep link
trpc.lmc.checkIn.mutate({ moduleNum, answer })
trpc.lmc.quizAnswer.mutate({ moduleNum, answerIndex })
trpc.lmc.lastSwReply.query({ moduleNum, touchpoint })  // for the "What X said" expandable
```

All endpoints scope to the logged-in user's email via `ctx.user`.

---

## What NOT to build (out of scope for first release)

- Quiz scoring / pass-fail (it's a check, not a test)
- Module content editing UI (content comes from the KB, only ops team edits it)
- Comments / forum / social features
- Notifications inside the web client (Telegram bot handles all notifications)
- Direct file upload (work is submitted in Telegram, not in the web client)
- Payment / Stripe UI (the LMS doesn't sell to learners — NDIS bills the provider)

---

## Acceptance criteria

Before this is "done":

- [ ] All 21 official modules render correctly on a 360×640 mobile viewport
- [ ] Voice input works on at least 1 text field per page in Chrome, Safari iOS, Edge
- [ ] High contrast theme passes WCAG AAA on the module page
- [ ] Touchpoint state changes from "Open" to "Done" within 60s of SW reply (live)
- [ ] Copy prompt button works on 4 platforms: iOS Safari, Android Chrome, Win Chrome, macOS Safari
- [ ] Telegram deep link opens the bot with prefilled message on iOS and Android
- [ ] Offline banner shows correctly when API is unreachable
- [ ] Screen reader narration of one module from top to bottom is intelligible
- [ ] Lighthouse mobile score: Performance ≥80, Accessibility ≥95, Best Practices ≥90
- [ ] Total JS bundle ≤200 KB gzipped (low-end Android, slow networks)
