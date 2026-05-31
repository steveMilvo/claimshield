# AI Launchpad — Learning Module Content (LMC) v3
## Modules 05–24 (Microenterprise, Affiliate, Compliance Agent Libraries)

**Platform:** MilvoTech AI Launchpad
**Audience:** NDIS participants with low literacy / low numeracy, varying ability levels
**Built on:** LMC v2 Modules 01–04 structure (Steve Milverton)
**Prepared:** May 2026

---

## How v3 Differs From v2

v2 created **1 billable Support Worker Moment per module**. v3 creates **3 billable touchpoints per module**, giving 2–3 billable events per participant per week — the NDIS-billing rhythm the program needs.

### The Three-Touchpoint Framework

Every module now contains three discrete, short, mostly-async billable events:

| Touchpoint | When | Mode | Time | What Support Worker Does |
|---|---|---|---|---|
| **A — Plan Review** | Before the learner does the AI activity | Async Telegram | 10–15 min | Reviews the learner's plan/draft and approves direction |
| **B — AI Prompt Coaching** | After learner runs the AI tool | Async Telegram | 10 min | Reviews AI chat screenshot, critiques prompt, suggests rerun if needed |
| **C — Outcome Review** | When artefact is finished | Async Telegram + voice note | 10–15 min | Reviews finished work, logs milestone, schedules next week |

Plus optional sync events when needed:
- **Weekly Check-in Call** (15 min, 1:1 video) — once per week
- **Group Workshop** (60 min for 4 learners = 15 min billable each) — every 2 weeks
- **Live Co-Working** (20 min screen-share) — on request
- **Local Field Visit** (30–60 min in person) — milestone-triggered

### Capacity Math

- 1 support worker × 50 participants × 2.5 events/week = **125 billable events/week**
- 38-hour week ÷ 125 events = **~18 min per event** (achievable with templated reviews)

### The SynthexIQ Telegram Bot (Unbillable, 24/7)

The bot handles everything that does **not** need a human:
- Answers FAQs and explains AI prompts on demand
- Sends the right copy-paste prompt for the current module
- Nudges learners stuck for >48 hours
- Auto-logs the start and end of every billable event for NDIS audit
- Routes urgent issues (mental health, safety, technical lockout) to the on-call support worker
- Tracks milestone progress and unlocks next module

### Trigger Phrase Billing System

Every billable touchpoint is activated by a **trigger phrase** typed into the Telegram group chat. This is how the bot knows an NDIS-billable interaction has started.

**How it works:**
1. Learner types the trigger phrase (e.g. `/submit_mod05_a`) before sending their work.
2. Bot records the **event start timestamp** and notifies the support worker.
3. Support worker reviews and replies via Telegram.
4. Bot records the **event end timestamp** when SW reply is sent.
5. Both timestamps are stored in the NDIS billing audit log under **Capacity Building — Skill Development**.

**Rules:**
- Free-text chat with the bot is **always unbillable** — learners can ask anything, any time, at no cost to their plan.
- A trigger phrase makes the **next SW interaction** billable. If the SW reviews the learner's work, that event is logged. If the learner just chats without a trigger phrase, it is not logged.
- If a free-text conversation requires SW intervention lasting more than 5 minutes, the SW can manually log the event using their admin dashboard.

**Trigger phrase format:** `/submit_mod[NN]_[a|b|c]` where NN is the two-digit module number (05–23).

### Local Support Worker Activation

Local support workers are activated for hands-on community work at milestone moments only — booked through the bot, billed as field-support line items:
- First market stall (Module 06/09)
- First affiliate field promotion (Module 16)
- First compliance client site visit (Module 22)
- Local Facebook group / community board postings (Module 11)

### Affiliate Program Integration

MilvoTech apps with affiliate programs (monthly recurring commission) are surfaced in the Affiliate Library (Modules 13–17). Learners promote these apps locally and online, with a real commission dashboard.

---

# Part 0 — AI Foundations (Bridge from Module 04 to Module 05)

This single module fills the gap between Steve's existing Module 04 (Brand & Logo) and the rest of v3 — where every activity assumes the learner already knows how to sign up for ChatGPT, Claude, or Gemini, paste a prompt, and read the answer. Most learners do not. Module 04B teaches the tools first.

**Prerequisite:** Module 04 (LMC v2).
**Unlocks:** Module 05.

---

## Module 04B — AI Tools Tour

**Goal:** Set up free accounts on at least 2 AI tools (ChatGPT, Claude, Gemini), learn the copy-paste workflow, try voice input, and learn the 5 golden safety rules — so every other module in the course actually works for you.

**Intro Video (Seedance Prompt):**
> A person sitting at a kitchen table with a phone, tablet, and laptop in front of them. They tap the phone microphone and speak. The words "What can I do today?" appear on the screen. Three friendly AI logos light up around them — ChatGPT, Claude, Gemini — each writing a different helpful answer. The person smiles and gives a thumbs up. 15 seconds.

**What to Do:**
1. Meet the 3 main AI tools and what each one is best at.
2. Create a free account on **ChatGPT** (required) and ONE other (Claude or Gemini).
3. Learn the copy-paste workflow with a real practice prompt.
4. Try voice input — talk to the AI instead of typing.
5. Learn the 5 golden safety rules for using AI safely.

**What You Will Make:** Working accounts on at least 2 AI tools, your own "AI Cheat Sheet" (a single page you keep next to your computer), and a finished safety checklist signed off by your support worker.

> **🟢 AI Superpower:** A participant who has never typed a paragraph in their life can now have a free, friendly, expert conversation with the best AI in the world — in plain English, using voice input. Wasn't possible 3 years ago. Once this module is done, every other module in the program suddenly becomes accessible.

---

### Open Activity — Meet Your 3 AI Assistants

This activity will take about 75–90 minutes. Take breaks. There is no rush.

**Step 1 — Meet the 3 AI Tools (15 min)**

Watch the bot's short intro and read this comparison table:

| Tool | Website | What it's best at | Free version? |
|---|---|---|---|
| **ChatGPT** | chatgpt.com | All-rounder. Writing, research, ideas, simple questions. The one most people start with. | ✅ Yes |
| **Claude** | claude.ai | Long writing, careful answers, reading letters and PDFs. Great at "be careful and honest" tasks. | ✅ Yes |
| **Gemini** | gemini.google.com | Photos and images. Connected to Google. Best at picture editing and spreadsheets. | ✅ Yes |

> **Honesty rule:** This course does **NOT** use **Grok**. The instructions are designed for the 3 tools above only.

**Step 2 — Sign Up for ChatGPT (15 min — required)**

1. Open a web browser. Go to **chatgpt.com**.
2. Click **Sign up**.
3. Use your existing email (the one you use for the program). Choose a password you can remember.
4. Verify your email if asked (check inbox, click link).
5. Skip any "upgrade to Pro" pop-up. The free version is enough.
6. Send "Hi, I'm new here" as your first message. Read the reply.

> **Safety:** Use your normal email. Never give ChatGPT your bank details, your password, or photos of children.

**Step 3 — Sign Up for ONE Other (15 min — pick Claude OR Gemini)**

If you mostly write words → choose **Claude** (claude.ai).
If you mostly want to edit photos or use Google docs → choose **Gemini** (gemini.google.com).

Same sign-up steps: email + password + verify.

Send "Hi, I'm new here" as your first message in this tool too.

**Step 4 — Learn the Copy-Paste Workflow (15 min)**

This is the move you will use in every other module. Practise it now with a real prompt:

```
Hi! I am brand new to AI. Please write me 3 short, friendly tips for using
you safely. Year 5 reading level. Plain Australian English.
```

How to copy-paste:
1. **In Telegram:** ask the SynthexIQ bot for the prompt with `/get_prompt mod04b_practice`. Tap and hold the prompt text. Tap **Copy**.
2. **Open your AI tool** (ChatGPT, Claude, or Gemini) on the same device.
3. Tap and hold in the message box. Tap **Paste**.
4. Tap **Send** (or press Enter).
5. Read the answer out loud.

> **Tip:** On a computer, copy = Ctrl+C (Windows) or ⌘+C (Mac). Paste = Ctrl+V or ⌘+V.

**Step 5 — Try Voice Input (10 min)**

If reading and typing are hard for you, this is the best feature in the whole course.

**On ChatGPT phone app:** tap the microphone icon. Speak. Tap stop. The AI hears you and replies.

**On Claude phone app:** tap the microphone icon next to the text box.

**On Gemini phone app:** tap the microphone icon.

Practice: tap mic and say:
> "Tell me one nice fact about Australia in plain language."

Listen to the answer.

> **Why this matters:** You do not need to be able to read or type well to use AI. You can just talk to it.

**Step 6 — Read and Sign the 5 Golden Safety Rules (10 min)**

Print or screenshot this list. Tape it next to your computer:

| # | Golden Rule | Why |
|---|---|---|
| 1 | **Never give AI your password or bank details.** | AI does not need them. Anyone asking for them is a scam. |
| 2 | **Never upload photos of children.** | Privacy. Even for your own kids. |
| 3 | **AI sometimes gets things wrong.** | Always read the answer carefully. If it sounds weird, ask your support worker. |
| 4 | **AI is NOT your doctor, lawyer, or accountant.** | For health, legal, or money decisions, always check with a real human professional. |
| 5 | **Be polite, but you don't have to be sorry.** | AI is a tool. You can say "no, try again" without feeling rude. |

Read each one out loud. Sign the bottom of the page with your name and today's date.

> **Why this matters:** Most AI accidents come from breaking one of these 5 rules. If you follow them, you will be safe.

---

### Billable Touchpoint A — Tool Choice Review (10 min, async)

**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod04b_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 1, tell the support worker which 2 tools you plan to set up (ChatGPT is required + Claude OR Gemini).
2. *"I will set up [ChatGPT] and [Claude/Gemini]. Is that the right pick for me?"*
3. Support worker checks fit (do you mostly write words → Claude; mostly want photo help → Gemini) and approves or suggests a swap.

---

### Billable Touchpoint B — First Prompt Critique (15 min, async)

**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod04b_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 4, screenshot the AI's reply to your practice prompt.
2. *"This is what AI said. Did I copy and paste right?"*
3. Support worker confirms the workflow is working, troubleshoots if not, and sends a 30-second voice note welcoming the learner to AI.

---

### Billable Touchpoint C — Safety Rules Sign-Off (10 min, sync voice call)

**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod04b_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Voice call the support worker.
2. The support worker reads each of the 5 Golden Rules aloud and asks the learner to explain in their own words why each one matters.
3. If the learner can explain all 5, the support worker marks **"AI Safety Certified"** and unlocks Module 05. Milestone logged.

> **Why this is sync:** This is the only safety gate in the whole program. The SW must hear the learner explain each rule in their own words. No skipping.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod04b_a` — submits Touchpoint A
- `/submit_mod04b_b` — submits Touchpoint B
- `/submit_mod04b_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- `/get_prompt mod04b_practice` — bot sends the practice prompt to copy-paste
- Ask "how do I sign up for ChatGPT?" — bot sends a 6-step picture guide
- Ask "show me voice input" — bot sends a 20-second video tutorial
- Ask "is this a scam?" — paste any suspicious message; bot checks it for you
- Ask "what are the 5 rules?" — bot resends the safety checklist

**Check-In Question:** Have you sent at least 1 prompt successfully on 2 different AI tools?

**Quiz Question:**
> Which of these is NEVER okay to give an AI?
> - A) A short story about your business
> - B) Your bank password ✓
> - C) A question about Australia
> - D) A photo of a coffee cup

---

# Part 1 — Microenterprise Library (cont.)

---

## Module 05 — Selling Online

**Goal:** Choose the right online marketplace for your business and set up a professional seller listing using AI to write your description.

**Intro Video (Seedance Prompt):**
> A close-up of a computer screen showing a simple, clean online marketplace page. A mouse cursor slowly moves to and clicks a large green button labelled "List Item". A confirmation tick appears on screen. Clear, bright, easy to understand. 15 seconds.

**What to Do:**
1. Open Telegram and ask the bot: "What marketplace should I use?"
2. The bot will ask you 4 short questions and tell you the best 1 or 2 to try.
3. Go to that website. Click "Sign Up".
4. Use your business name from Module 03 and your logo from Module 04.
5. Stop before creating your first listing. Wait for support worker approval.

**What You Will Make:** A live seller account on the right marketplace for your business, with your Module 04 logo as your profile picture.

---

### Open Activity — Use AI to Write Your Killer Listing

This activity will take about 60–75 minutes.

**Step 1 — Ask AI to Compare Marketplaces (15 min)**

Open ChatGPT (chatgpt.com) and paste this prompt:

```
I am a small business owner in Australia. I want to sell [WHAT YOU SELL]
to [YOUR CUSTOMER from Module 03] in [YOUR SUBURB/TOWN].

Please compare these marketplaces for my business:
1. Facebook Marketplace
2. Gumtree
3. Etsy
4. eBay Australia
5. My own Facebook Shop

For each one, tell me in plain English:
- Is it free or does it cost money?
- How easy is it for a beginner?
- Will my customer be there?
- One thing to watch out for

Then tell me your top 1 recommendation for my business and why.
```

**Step 2 — Use AI to Write Your Listing Description (20 min)**

Once you know which platform, paste this prompt into ChatGPT or Claude (claude.ai):

```
Please write a friendly, honest product listing for me.

Product: [WHAT YOU SELL]
Price: $[YOUR PRICE from Module 07]
What makes it special: [ONE OR TWO THINGS]
Who I made it for: [YOUR CUSTOMER]
Where I am: [YOUR SUBURB]

Please write:
1. A short, eye-catching title (under 10 words)
2. A 4-sentence description in plain, warm language
3. Three search keywords buyers might type
4. A short, friendly closing line

Do not use exaggeration or fake claims. Keep it honest.
Write at a Year 6 reading level.
```

**Step 3 — Save Your Listing on Paper Before Posting (10 min)**

Copy the AI's output onto a piece of paper or into a Notes app. Read it out loud. Does it sound like you? Change anything that does not feel right.

**Step 4 — Post Your First Listing (15 min, AFTER support worker approves)**

Only post once your support worker has given the green light in Touchpoint A.

> **Why this matters:** Most beginners pick the wrong platform and write boring listings. AI compares 5 platforms in 30 seconds and writes a description that sounds professional — but the words still need to be yours.

---

### Billable Touchpoint A — Plan Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod05_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 1, screenshot the AI's marketplace comparison.
2. Send it to the support worker via Telegram with: *"AI recommends [platform] for me. Should I go with that?"*
3. Support worker reviews the recommendation against your actual situation (do you have postage capacity, customer fit, etc.) and replies with **GO** or **CHANGE**.

**Bot logs:** event start (your message) and event end (SW reply) for NDIS billing.

---

### Billable Touchpoint B — AI Prompt Coaching (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod05_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 2, screenshot the full ChatGPT or Claude conversation.
2. Send to support worker: *"This is what AI wrote for my listing. Is it good?"*
3. Support worker checks: Is it honest? Is it clear? Does it match the customer in your business plan?
4. If the prompt could be improved, the support worker sends back a **better prompt** for you to try and explains why.

---

### Billable Touchpoint C — Outcome Review (15 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod05_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After posting (Step 4), screenshot the live listing.
2. Send to support worker: *"My listing is live! Here it is."*
3. Support worker reviews live, gives a thumbs up, and helps you plan how to share it.
4. **Milestone logged** in SynthexIQ — your first online listing is recorded.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod05_a` — submits Touchpoint A
- `/submit_mod05_b` — submits Touchpoint B
- `/submit_mod05_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- Ask "help with [platform name]" for setup screenshots
- Ask "why was my listing rejected" — bot will explain marketplace rules
- Ask "rewrite my title" — bot gives 3 alternatives instantly

**Check-In Question:** Is your listing live? (Yes / No)

**Quiz Question:**
> Why should you ask AI to compare marketplaces before you sign up to one?
> - A) Because it is free
> - B) So you pick the right place for your customer and don't waste time ✓
> - C) AI knows your customer better than you
> - D) You don't need to — just use Facebook

---

## Module 06 — Product Photos & Descriptions

**Goal:** Take real photos, use AI to clean them up, and create a 3-photo listing pack good enough for any marketplace.

**Intro Video (Seedance Prompt):**
> A person placing a handmade ceramic mug on a clean white table next to a sunny window. They hold up a smartphone, line up the shot, and take a photo. They open Gemini on their laptop and the photo appears with the background cleanly removed. They smile. Clear, natural lighting. 15 seconds.

**What to Do:**
1. Set up a window-light photo space (cardboard, sheet, table).
2. Take 10 photos of your product or 10 photos of you doing your service.
3. Pick your 3 best.
4. Use AI to clean the background and improve brightness.
5. Use AI to write 1 caption for each photo.

**What You Will Make:** 3 finished listing photos with AI-enhanced backgrounds and matching descriptions, ready to upload.

---

### Open Activity — The AI Photo Studio

This activity will take about 60–90 minutes.

**Step 1 — Shoot 10 Real Photos (20 min)**

Same as the v2 instructions: window light, plain background, take 10 photos from different angles.

**Step 2 — Clean Them Up With Gemini (15 min)**

Gemini (gemini.google.com) has free image editing. Upload your photo and paste:

```
Please edit this photo of my product.

What I sell: [PRODUCT]
What I want:
1. Remove any background clutter and replace with a plain soft white background.
2. Brighten the image a little so it looks crisp.
3. Do not change the product itself — it must look exactly like the real thing.
4. Keep the photo realistic. Do not make it cartoon or fake.

Please show me the cleaned-up image.
```

> **Honesty rule:** Never let AI change the product itself. Customers must get what they see.

**Step 3 — Use Claude to Write Each Caption (15 min)**

For each of your 3 best photos, paste into Claude:

```
I am writing a short caption for a product photo.

Product: [PRODUCT]
Photo shows: [DESCRIBE THE PHOTO — e.g. "the mug from above, with handle on the right"]
Brand feeling (from Module 04): [friendly / natural / bold / etc.]

Please write one caption, 1 or 2 sentences, that:
- Describes what the photo shows
- Mentions one thing that makes it special
- Is friendly and not pushy
- Uses simple words (Year 6 reading level)
```

**Step 4 — Arrange Your 3-Photo Pack (10 min)**

Lay your 3 cleaned-up photos with their captions on one page. This is your listing pack.

> **Why this matters:** A clean, bright photo set used to need professional gear. AI does it on a free account in 15 minutes. Honesty matters: never let AI change your product, only the background.

---

### Billable Touchpoint A — Shoot Plan Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod06_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Before shooting, send the support worker a photo of your shoot setup (background + light source).
2. *"This is my setup. Will the photos be good enough?"*
3. Support worker advises: move closer to window, add a sheet, etc.

---

### Billable Touchpoint B — AI Edit Coaching (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod06_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send a side-by-side: original photo + AI-edited photo.
2. *"AI changed this photo. Is it still honest?"*
3. Support worker checks: did AI change the product? Is the colour still true? Approves or asks you to rerun.

---

### Billable Touchpoint C — Listing Pack Review (15 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod06_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send all 3 photos and 3 captions together.
2. *"Here is my finished photo pack."*
3. Support worker picks the strongest photo for the cover image and gives feedback on caption tone. Milestone logged.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod06_a` — submits Touchpoint A
- `/submit_mod06_b` — submits Touchpoint B
- `/submit_mod06_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "show me a good photo example" — bot sends 3 sample shots
- Ask "is this photo too dark?" — bot gives quick yes/no
- Ask "remove background prompt" — bot resends the Gemini prompt

**Check-In Question:** Do your 3 photos all look like they belong to the same business?

**Quiz Question:**
> When AI edits your product photo, what must never change?
> - A) The background
> - B) The brightness
> - C) The product itself ✓
> - D) The size of the image

---

## Module 07 — Pricing My Stuff

**Goal:** Use AI to do market research, then set a price that covers materials, pays you fairly for your time, and matches what real customers will pay.

**Intro Video (Seedance Prompt):**
> A hand placing coins on a table one by one. A laptop screen next to the coins shows a simple bar chart of competitor prices. The hand writes a price on a paper tag and holds it up confidently. 15 seconds.

**What to Do:**
1. Make a list of what your materials cost.
2. Decide how much your hour of work is worth (start at $15–$25/hr).
3. Use ChatGPT to scan competitor prices.
4. Use Claude to suggest 3 price tiers (basic, standard, premium).
5. Choose your starting price.

**What You Will Make:** A pricing sheet with 3 tiers and a clear reason for each price.

---

### Open Activity — AI-Powered Pricing Research

This activity will take about 60–75 minutes.

**Step 1 — Cost & Time Worksheet (15 min)**

On paper, write:
- Materials cost per item: $____
- Time per item: ____ hours
- My hourly rate: $____ (start at $20 if unsure)
- My total cost: materials + (time × rate) = $____

**Step 2 — Competitor Scan with ChatGPT (20 min)**

Paste into ChatGPT:

```
I am pricing my product / service. Please help me check prices.

Product / service: [WHAT YOU SELL]
My location: [SUBURB, STATE, AUSTRALIA]
My target customer: [FROM MODULE 03]

Please:
1. Suggest 5 search terms I could type into Facebook Marketplace, Gumtree,
   and Etsy to find competitors.
2. Tell me what a fair price range is for this kind of product in Australia.
3. Tell me the lowest price I should ever charge (below this I am losing money).
4. Tell me the price a customer would consider premium.
```

Now go to Facebook Marketplace, Gumtree, and Etsy and search those terms. Write down 5 real prices you find.

**Step 3 — Three Price Tiers with Claude (15 min)**

Paste into Claude:

```
Please help me design 3 pricing tiers for my business.

Product / service: [WHAT YOU SELL]
My total cost per item: $[FROM STEP 1]
Fair price range (from AI research): $[LOW] to $[HIGH]
Real competitor prices I saw: $[LIST 5]

Please design:
- Basic tier — entry price, what is included
- Standard tier — most popular, what is included
- Premium tier — for bigger budgets, what is extra

For each tier, write 1 sentence about who it suits.
Keep wording simple and warm.
```

**Step 4 — Decide and Write Your Price Sheet (15 min)**

On a fresh sheet of paper, write your 3 tiers neatly. This is your price sheet.

> **Why this matters:** Most beginners undercharge by 40% because they guess. AI gives you real competitor data and a fair range in 20 minutes. Tiers also let small budgets and big budgets both buy from you.

---

### Billable Touchpoint A — Cost Worksheet Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod07_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the support worker your cost & time worksheet from Step 1.
2. *"Is my hourly rate fair?"*
3. Support worker confirms or suggests adjustment. Many learners undervalue themselves — this is the moment to fix that.

---

### Billable Touchpoint B — AI Research Critique (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod07_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send screenshots of the ChatGPT competitor research + 5 real prices you found.
2. *"Here is what AI said and what I found. Do they match?"*
3. Support worker checks if AI hallucinated prices that don't exist locally. If so, coaches a better prompt.

---

### Billable Touchpoint C — Price Sheet Sign-Off (15 min, async + voice note)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod07_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send your 3-tier price sheet.
2. Support worker sends a **voice note** explaining whether the tiers will sell, and confirms your starting tier.
3. Milestone logged: you now have a real price sheet.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod07_a` — submits Touchpoint A
- `/submit_mod07_b` — submits Touchpoint B
- `/submit_mod07_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "is $X too cheap?" — bot compares against AI research
- Ask "help me explain my price" — bot gives a friendly script
- Ask "what is GST?" — bot explains in plain English

**Check-In Question:** What is the lowest price you will ever sell at, and why?

**Quiz Question:**
> Why do 3 price tiers help your business?
> - A) Because more numbers look impressive
> - B) Because customers with different budgets can all buy from you ✓
> - C) Because AI told you to
> - D) So you can hide the real price

---

## Module 08 — Social Media 101

**Goal:** Pick ONE social media platform, set it up properly with your brand, and use AI to plan a full month of posts.

**Intro Video (Seedance Prompt):**
> A person holding a phone showing a bright photo of their product on the screen. They tap a large "Share" button. Small animated heart icons float up. The screen then shows a 4-week calendar with each day filled in. The person smiles. 15 seconds.

**What to Do:**
1. Ask the bot: "Which social platform suits my business?"
2. Set up a free business profile using Module 04 brand assets.
3. Use Claude to plan 12 posts (3 per week for 4 weeks).
4. Post your first one.
5. Tell 5 friends and family to follow you.

**What You Will Make:** A live business profile with branded look + a 4-week content calendar.

---

### Open Activity — AI Content Planning

This activity will take about 60–75 minutes.

**Step 1 — Choose Your Platform (10 min)**

Ask the bot which platform suits you. Generally:
- **Facebook** — older customers, local community, marketplace built in
- **Instagram** — visual products, 25–45 year-olds
- **TikTok** — short videos, under-35s, fast growth
- **Pinterest** — handmade, craft, food, home

Pick ONE. Do not try to do all four.

**Step 2 — Set Up Profile With Brand Assets (15 min)**

Use your Module 04 logo, banner, brand colours, and brand description. Upload them.

**Step 3 — AI Generates Your 4-Week Content Plan (20 min)**

Paste into Claude:

```
Please plan 4 weeks of social media posts for my small business.

Business: [NAME] — [WHAT IT DOES]
Platform: [Facebook / Instagram / TikTok / Pinterest]
Customer: [FROM MODULE 03]
Brand feeling: [FROM MODULE 04]
Posting 3 times per week.

Each week should mix 3 types of posts:
1. PRODUCT post — show what I sell, with price
2. PERSON post — show me making or doing the work
3. HELPFUL post — a tip, story, or piece of advice my customer would enjoy

For each of the 12 posts, give me:
- Suggested day of week
- Post type (1, 2, or 3 above)
- Caption (under 50 words)
- 5 hashtags
- What photo or video to take

Keep all writing simple and friendly.
```

**Step 4 — Write the Calendar on Paper (15 min)**

Copy AI's 12 posts onto a 4-week grid. Pin it on your wall.

**Step 5 — Post Number 1 (10 min)**

Post the first one today. Send the link to 5 people on Telegram, WhatsApp, or SMS.

> **Why this matters:** Posting randomly fails. AI gives you 4 weeks of post ideas in 20 minutes — you just have to take the photos and press post.

---

### Billable Touchpoint A — Platform Choice Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod08_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the support worker the bot's recommendation plus your gut feel.
2. *"AI says [platform]. Is that right for my customer?"*
3. Support worker confirms or suggests an alternative based on where your customer actually hangs out.

---

### Billable Touchpoint B — Content Plan Review (15 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod08_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send a screenshot of Claude's full 12-post plan.
2. *"Here is my month of posts. Are they good?"*
3. Support worker flags any that sound generic or off-brand and coaches a better prompt for those posts.

---

### Billable Touchpoint C — First Post Launch (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod08_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the live link to your first post + how many likes / comments after 24 hours.
2. Support worker celebrates and notes what worked. Milestone logged: first business post live.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod08_a` — submits Touchpoint A
- `/submit_mod08_b` — submits Touchpoint B
- `/submit_mod08_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "best time to post" — bot gives data for your platform
- Ask "rewrite this caption" — bot gives 3 alternatives
- Ask "what hashtags should I use" — bot suggests 10
- Ask "give me a tip post idea" — bot generates one on the spot

**Check-In Question:** How many people saw your first post in the first 24 hours?

**Quiz Question:**
> Why is it better to use ONE platform well than four platforms badly?
> - A) It is not better — more is always better
> - B) Because you can focus, post consistently, and build a real audience ✓
> - C) Because the other platforms are broken
> - D) Because AI only works on one platform

---

## Module 09 — My First Sale

**Goal:** Make your first real sale, handle the money safely, and use AI to write a thank-you message that turns the buyer into a repeat customer.

**Intro Video (Seedance Prompt):**
> Two people exchanging a wrapped item and money, shaking hands. The seller then types a quick message on their phone showing "Thank you!" and a heart. Friendly, celebratory. 15 seconds.

**What to Do:**
1. Find your first buyer (friend, family, online enquirer, or market visitor).
2. Agree the price. Use your price sheet.
3. Hand over the item or do the service.
4. Receive payment (cash, bank transfer, or PayID).
5. Use AI to write the perfect thank-you message.
6. Record the sale in your receipt book and Money Tracker.

**What You Will Make:** A completed first sale, a receipt, and a sent thank-you message.

---

### Open Activity — The First Sale Loop

This activity will take about 60–90 minutes (plus the actual selling).

**Step 1 — Pre-Sale Practice With AI (15 min)**

Paste into Claude:

```
Please help me practise selling.

Product / service: [WHAT YOU SELL]
Price: $[YOUR PRICE]

Please role-play a customer asking me questions like:
- Why does it cost this much?
- Can you do it cheaper?
- How long does it take?
- Is there a refund if I don't like it?

For each question, give me a polite, honest answer I can copy.
Keep answers short — 1 or 2 sentences each.
```

Read the answers out loud 3 times. This is your sales script.

**Step 2 — Set Up Payment (10 min)**

Pick one:
- **Cash** — simplest, no fees, get a receipt
- **Bank transfer** — give your BSB + account number or PayID
- **PayPal.me link** — for online buyers

Write your chosen method clearly on your phone notes.

**Step 3 — Make the Sale (variable time)**

Hand over the item. Take the money. Smile. Say thank you.

**Step 4 — AI Writes Your Thank-You (15 min)**

Paste into Claude:

```
I just made a sale. Please write a short thank-you message I can send to my
customer on Facebook Messenger / text message / email.

Customer name: [FIRST NAME]
What they bought: [ITEM]
My business: [NAME]

The message should:
- Thank them warmly
- Ask if they are happy with it
- Politely invite them to leave a review or tell a friend
- Be under 50 words
- Sound like a real person, not a robot
```

Send the message.

**Step 5 — Record the Sale (10 min)**

- Write it in your Receipt Book (from v2 Module 09 activity)
- Write it in your Money Tracker (Money In column)
- Update your social media: "I just made a sale!"

> **Why this matters:** The first sale is the moment you become a real business. The thank-you turns one sale into the start of a customer relationship — that is where 80% of future income comes from.

---

### Billable Touchpoint A — Sales Practice Review (15 min, sync voice call)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod09_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Book a 15-minute voice call with your support worker via the bot.
2. Read your AI-generated sales script out loud.
3. Support worker role-plays as a difficult customer and gives you confidence-building feedback.

This is the one sync touchpoint in this module because confidence matters more than text feedback.

---

### Billable Touchpoint B — Live Sale Support (10 min, async on the day)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod09_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. On the day of your sale, message the bot: *"Selling today."*
2. The bot pings your support worker. If you hit trouble, your support worker is available within 15 minutes via Telegram.
3. If no trouble, you simply message *"Sale done!"* and the support worker sends a quick celebration.

---

### Billable Touchpoint C — Sale Record & Thank-You Review (15 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod09_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send screenshots of your receipt entry, money tracker entry, and the AI thank-you message you sent.
2. Support worker checks all 3 are done correctly and that the thank-you message is genuine and not pushy. Milestone logged: **First Sale**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod09_a` — submits Touchpoint A
- `/submit_mod09_b` — submits Touchpoint B
- `/submit_mod09_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "customer is haggling" — bot gives 3 polite responses
- Ask "customer wants refund" — bot explains consumer law in simple words
- Ask "how do I get paid" — bot walks through PayID setup

**Check-In Question:** What was the best moment of your first sale?

**Quiz Question:**
> Why send a thank-you message after a sale?
> - A) It is a legal requirement
> - B) Because happy customers come back and tell friends ✓
> - C) AI told you to
> - D) You don't need to

---

## Module 10 — Money Basics

**Goal:** Set up a simple weekly money tracker, understand the rules about reporting business income to NDIS and Centrelink, and use AI to summarise your money every week.

**Intro Video (Seedance Prompt):**
> A close-up of a notebook with "Money In" in green and "Money Out" in red. A phone next to the notebook shows AI giving a clean summary: "This week you earned $85, spent $20, profit $65." The hand gives a thumbs up. 15 seconds.

**What to Do:**
1. Set up your Money Tracker (notebook or Google Sheet).
2. Record every $ in and every $ out for one week.
3. Ask AI to summarise your week.
4. Talk to your support worker about reporting rules.

**What You Will Make:** A working weekly money tracker + a clear understanding of what to report to Centrelink / NDIS.

---

### Open Activity — Set Up the Money Tracker

This activity will take about 60–75 minutes.

**Step 1 — Choose Paper or Digital (10 min)**

- **Paper** — a notebook with a green pen (in) and red pen (out)
- **Google Sheets** — free, you can ask Gemini to help build it
- **Phone app** — Pocketbook, Money Lover (free Australian apps)

If choosing Google Sheets, paste into Gemini:

```
Please give me a simple Google Sheets template for tracking my small business
money. I have low numeracy and need it to be very simple.

I need columns for:
- Date
- What happened
- Money In ($)
- Money Out ($)
- Running balance

Please also give me a formula that:
- Adds up Money In for the week
- Adds up Money Out for the week
- Shows my profit (Money In minus Money Out)

Explain step-by-step how to set it up.
```

**Step 2 — Fill in This Week's Real Numbers (15 min)**

Write down every dollar in and out from this week's program activities.

**Step 3 — Learn the NDIS / Centrelink Rules (20 min)**

Ask the bot: *"What do I need to report to Centrelink if I earn business income?"*

The bot will give you a plain-English summary. Read it carefully. Common rules:
- All business income must be reported to Centrelink
- You may keep most of it depending on your payment type
- An ABN may be needed if you earn over $75,000 (very unlikely starting out)
- Bookkeeping records help at tax time
- Some NDIS funded supports can be reported separately

**Step 4 — Weekly AI Summary (15 min)**

At the end of each week, paste your numbers into Claude:

```
Please summarise my business week.

This week:
- Money In: $[AMOUNT]
- Money Out: $[AMOUNT]
- Best sale: [DESCRIBE]
- Biggest expense: [DESCRIBE]

Please:
1. Tell me my profit in one sentence
2. Tell me one thing that went well
3. Tell me one thing I should watch for next week
4. Suggest a goal for next week's profit
```

> **Why this matters:** Money tracking is the difference between a hobby and a business. The weekly AI summary turns numbers into a coach.

---

### Billable Touchpoint A — Tracker Setup Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod10_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send a photo of your tracker setup (paper or screenshot of Sheet).
2. *"Is this set up right?"*
3. Support worker confirms structure is correct. Fixes any maths formula errors.

---

### Billable Touchpoint B — Reporting Rules Walkthrough (15 min, async + voice note)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod10_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After the bot gives you the basic rules, message support worker: *"Bot said I need to report income. Can you check how this works for me specifically?"*
2. Support worker sends a voice note tailored to **your** Centrelink payment type. This is critical — rules differ by payment.

---

### Billable Touchpoint C — Weekly Summary Review (10 min, async, recurring)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod10_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Every Friday, send the AI summary + your real numbers.
2. Support worker reads it, celebrates wins, flags concerns.
3. This becomes a **weekly recurring billable touchpoint** for the rest of the program.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod10_a` — submits Touchpoint A
- `/submit_mod10_b` — submits Touchpoint B
- `/submit_mod10_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "what counts as a business expense" — bot lists examples
- Ask "do I need an ABN" — bot answers based on your earnings
- Ask "Centrelink rules" — bot directs to current Services Australia info

**Check-In Question:** Did you make a profit or a loss this week?

**Quiz Question:**
> If you earn money from your business, who do you usually need to tell?
> - A) Nobody
> - B) Centrelink (and sometimes the NDIA) ✓
> - C) Only your family
> - D) The local council

---

## Module 11 — Growing My Business

**Goal:** Use AI to find new customers, run a small local promotion, and bring in a **local support worker** for hands-on community promotion.

**Intro Video (Seedance Prompt):**
> A happy customer holding a product, talking to a friend who looks at their phone. Then a different scene — a support worker pinning a poster to a local cafe noticeboard. Friendly, community-focused. 15 seconds.

**What to Do:**
1. Ask AI to find 5 ways to reach more customers locally.
2. Pick ONE idea to try this week.
3. Make a flyer or local post with AI help.
4. Book a local support worker visit (if hands-on help is needed).
5. Track what worked.

**What You Will Make:** One real local promotion live in your community + 3 new customer leads.

---

### Open Activity — Local Growth Campaign

This activity will take about 75–90 minutes.

**Step 1 — Local Opportunity Scan with ChatGPT (15 min)**

Paste:

```
I run a small business in [YOUR SUBURB, STATE], Australia.

Business: [WHAT YOU DO]
Customer: [FROM MODULE 03]

Please suggest 5 local ways to find new customers near me.

For each idea, tell me:
- What I would actually do
- About how much it would cost
- How long it takes
- What is the risk of failure

Avoid expensive paid advertising. Focus on simple local ideas.
```

**Step 2 — Choose One and Plan It (15 min)**

Pick the easiest idea. Ask Claude to make a 1-week action plan:

```
I want to try this growth idea: [PASTE THE IDEA]

Please make me a 7-day plan:
- Day 1: ___
- Day 2: ___
... etc.

Each day should take under 30 minutes.
Be specific. Include exactly what to say or what to do.
```

**Step 3 — AI Designs Your Local Flyer (20 min)**

In ChatGPT (with image generation) or Gemini, paste:

```
Please design a simple A5 flyer for my business.

Business: [NAME] — [WHAT IT DOES]
Brand colours from Module 04: [COLOUR 1] and [COLOUR 2]
Logo: [DESCRIBE OR UPLOAD]
Phone or social media: [YOUR CONTACT]
One sentence about the offer: [E.G. "Hand-painted mugs, $20 each, made in Geelong"]

The flyer must:
- Have a plain white background
- Be eye-catching but not busy
- Use simple, large text
- Include a clear "Call or message me on [number]" line
- Be ready to print on A5 paper
```

Print 10 copies at home, at the library, or Officeworks.

**Step 4 — Book a Local Support Worker Visit (optional, 5 min)**

If your idea involves going to cafes, noticeboards, markets, or door-to-door — book a local support worker through the bot:
- *"Book local support — flyer drop in [SUBURB] — 1 hour"*

The local SW will meet you and walk the route with you. This is a **billable field-support event**.

**Step 5 — Run the Promotion (this week)**

Do the 7-day plan. Track responses.

> **Why this matters:** Most learners stall at "I don't know how to find customers." AI removes that block by giving 5 specific local ideas in 5 minutes. A local support worker turns the idea into action.

---

### Billable Touchpoint A — Growth Idea Choice Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod11_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send screenshot of AI's 5 ideas.
2. *"I want to try [idea]. Is that realistic for me?"*
3. Support worker checks feasibility and approves or redirects.

---

### Billable Touchpoint B — Flyer / Material Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod11_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send AI's flyer design or post draft.
2. Support worker checks brand consistency, contact info, legal accuracy. Suggests prompt fixes.

---

### Billable Touchpoint C — Local Field Visit (30–60 min, sync, in person — Local SW)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod11_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

When the campaign needs in-person work (flyer drop, market introduction, cafe noticeboard, community group visit):

1. Bot books a local support worker.
2. They meet you at an agreed point.
3. You walk the route together. They help you talk to shop owners or stallholders.
4. **Logged as a field-support line item** — separate higher-rate billing.

If no field work is needed this week, **Touchpoint C** becomes an async results-review instead (15 min).

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod11_a` — submits Touchpoint A
- `/submit_mod11_b` — submits Touchpoint B
- `/submit_mod11_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "find local markets near [suburb]" — bot lists upcoming markets
- Ask "what to say to a shop owner" — bot gives a script
- Ask "Facebook group for [my product] in [my area]" — bot searches and suggests

**Check-In Question:** How many new people heard about your business this week?

**Quiz Question:**
> When should you ask for a local support worker visit?
> - A) Never
> - B) When you need hands-on help in your community, like flyer drops or market intros ✓
> - C) Every day
> - D) Only when you have an emergency

---

## Module 12 — My Business Review

**Goal:** Use AI to look back at your numbers, your wins and your struggles, and create a clear next-quarter plan.

**Intro Video (Seedance Prompt):**
> A person sitting back proudly, holding a printed AI report with green checkmarks. They draw a big arrow forward on a calendar showing the next 3 months. Calm, accomplished, forward-looking. 15 seconds.

**What to Do:**
1. Open your Money Tracker, Receipt Book, and Social Media stats.
2. Use AI to summarise the last 3 months.
3. Use AI to identify what worked and what didn't.
4. Decide your goal for the next 3 months.

**What You Will Make:** A 1-page Business Review and a 1-page Next Quarter Plan.

---

### Open Activity — The AI Quarterly Review

This activity will take about 75–90 minutes.

**Step 1 — Gather Your Numbers (15 min)**

Write down:
- Total Money In (last 3 months)
- Total Money Out
- Profit
- Number of sales
- Best-selling product or service
- Most-liked social media post
- One nice comment from a customer

**Step 2 — AI Summary with Claude (20 min)**

```
Please review my first 3 months in business.

Business: [NAME]
Sales: [NUMBER]
Money In: $[AMOUNT]
Money Out: $[AMOUNT]
Profit: $[AMOUNT]
Best product / service: [WHAT]
Best social post topic: [WHAT]
Customer comment: "[QUOTE]"

Please write:
1. A warm, 4-sentence summary of how I went
2. The top 3 things that worked
3. The top 2 things that did not work
4. 3 specific goals for the next 3 months — make them realistic and measurable
5. The single biggest thing I should focus on next
```

**Step 3 — Build a Wall Poster (20 min)**

Same as v2 — but now use the AI summary as your structure. Make 5 sections: My Wins, My Numbers, What Was Hard, What I Learned, My Next Goal.

**Step 4 — Schedule Your Next-Quarter Group Workshop (10 min)**

Book a slot for the **end-of-quarter group video workshop** with 3 other learners. This is where you share your review with peers and hear theirs.

> **Why this matters:** Many people with a disability have been told "you can't run a business." This review is the proof that you can — and the plan for what's next.

---

### Billable Touchpoint A — Numbers Verification (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod12_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the 8 numbers from Step 1.
2. Support worker checks they match what's in the Money Tracker. Catches errors.

---

### Billable Touchpoint B — AI Review Critique (15 min, async + voice note)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod12_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the Claude summary.
2. Support worker sends a voice note with their own perspective — sometimes AI misses context that a human caregiver knows.

---

### Billable Touchpoint C — End-of-Quarter Group Workshop (60 min sync, 15 min billable each, group of 4)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod12_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Same structure as the v2 Module 02B group conference.
2. Each learner shares their review (10 min each).
3. Support worker facilitates and signs off the next-quarter goal.
4. Milestone logged: **Quarter 1 Complete**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod12_a` — submits Touchpoint A
- `/submit_mod12_b` — submits Touchpoint B
- `/submit_mod12_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "what is a good profit goal for next quarter" — bot calculates based on your data
- Ask "celebrate me" — bot sends an encouragement message
- Ask "what should I improve" — bot picks the weakest area

**Check-In Question:** Score yourself 1–5. What would make next quarter a 5?

**Quiz Question:**
> Why review your business every 3 months?
> - A) So you can give up
> - B) So you can learn from real data and make smarter choices ✓
> - C) Because Centrelink requires it
> - D) It is not important

---

# Part 2 — Affiliate Library

Modules 13–17 cover earning monthly recurring commission by promoting MilvoTech apps. Every learner who completes Module 12 unlocks this library. Local support workers are activated for hands-on community promotion (Module 16).

---

## Module 13 — Affiliate Marketing Basics

**Goal:** Understand exactly how affiliate income works, set up your affiliate dashboard, and earn your first commission.

**Intro Video (Seedance Prompt):**
> A phone shows a friend tapping a shared link. A subscription confirmation appears on the friend's phone. A small coin then drops into a piggy bank with the words "Monthly Commission" on it. Bright, satisfying, simple. 15 seconds.

**What to Do:**
1. Read what affiliate commission means in plain English.
2. Open your MilvoTech Affiliate Dashboard.
3. Pick the FIRST app you want to promote.
4. Copy your affiliate link.
5. Send it to 1 person you genuinely think would benefit.

**What You Will Make:** Your affiliate dashboard logged in + 1 link shared with a real person.

---

### Open Activity — Affiliate Foundations

This activity will take about 60 minutes.

**Step 1 — Understand the Money (15 min)**

Affiliate income with MilvoTech apps is **monthly recurring commission**. That means:
- The user subscribes once
- They pay every month
- You earn a % every month, ongoing, as long as they stay subscribed

This is different from one-off product affiliate links (like Amazon). Recurring commission means **slow start, snowball later**.

Ask the bot: *"Show me the commission table for [App Name]"*

**Step 2 — Pick ONE App to Start With (15 min)**

You will be tempted to promote everything. Resist. Start with the app you personally understand best. Ask Claude:

```
I am about to start promoting one app as an affiliate. I can earn monthly
recurring commission.

The apps available are: [LIST FROM YOUR DASHBOARD]

Tell me about myself:
- I [USE / HAVE TRIED] these apps: [WHICH ONES]
- My audience is mainly: [WHO]
- My local community is in: [SUBURB/REGION]

Which ONE app should I start with and why?
Give me one app and one paragraph of reasoning.
```

**Step 3 — Generate Your Starter Kit with AI (15 min)**

Paste into Claude:

```
I am an affiliate promoting [APP NAME].

Please give me a starter kit:
1. A 1-sentence description of the app
2. 3 things it helps people do
3. The kind of person who would love it
4. A short, honest sharing script (under 60 words)
5. A disclosure line I can paste under every post
```

Print or save this. It's your reference sheet.

**Step 4 — First Share (15 min)**

Pick ONE person you know who genuinely needs this app. Not a stranger. Not a list.

Send them your sharing script + your affiliate link via the channel you usually message them on (Telegram, Messenger, SMS).

> **Why this matters:** Monthly recurring is the slow secret of affiliate income. 10 users at $5/month = $50/month forever. 100 users = $500/month forever. The first share is the hardest.

---

### Billable Touchpoint A — App Choice Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod13_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send Claude's recommendation + your gut feel.
2. Support worker checks the match against your network and skills. Confirms or steers.

---

### Billable Touchpoint B — Starter Kit Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod13_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send your AI starter kit.
2. Support worker checks honesty, tone, and disclosure compliance (very important — affiliate disclosure is legally required).

---

### Billable Touchpoint C — First Share Reflection (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod13_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send a screenshot of your first share (with the person's name blurred if private).
2. *"I shared it. They said [response]."*
3. Support worker debriefs: what worked, what to do next. Milestone logged: **First Affiliate Share**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod13_a` — submits Touchpoint A
- `/submit_mod13_b` — submits Touchpoint B
- `/submit_mod13_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "show me my commission balance" — bot pulls live dashboard
- Ask "is my disclosure good enough" — bot checks against ACCC rules
- Ask "draft a share message" — bot writes one for free

**Check-In Question:** Did the person you shared with reply?

**Quiz Question:**
> What does "monthly recurring commission" mean?
> - A) You earn once and that's it
> - B) You earn a small amount every month for as long as they stay subscribed ✓
> - C) You pay a monthly fee
> - D) The app pays you only at Christmas

---

## Module 14 — Choose Your Products

**Goal:** Build a personal "promotion portfolio" of 2–3 apps from the MilvoTech library that suit your audience, with AI-written review cards for each.

**Intro Video (Seedance Prompt):**
> A person looking at three app icons on a tablet. They tap the first, swipe through screenshots, then nod. They tap the second, smile. They circle two with their finger. 15 seconds.

**What to Do:**
1. Try at least 2 MilvoTech apps for 1 week each.
2. For each app, write or AI-generate honest pros and cons.
3. Build a Product Review Card for each.
4. Decide your portfolio: 2 or 3 apps you will actively promote.

**What You Will Make:** A portfolio of 2–3 Product Review Cards.

---

### Open Activity — The 1-Week Trial Method

This activity will take about 60 minutes (plus 1 week of real use).

**Step 1 — Use the App For Real (over 1 week)**

You cannot honestly promote what you have not used. Use the app every day for 7 days. Take 3 screenshots while using it. Make notes on your phone.

**Step 2 — AI Writes Your Review Card (20 min per app)**

Paste into Claude:

```
I have been using [APP NAME] for 1 week.

What I liked: [YOUR REAL OPINION]
What I didn't like: [YOUR REAL OPINION]
What surprised me: [YOUR REAL OPINION]
Who I think it suits: [YOUR REAL OPINION]

Please write a Product Review Card with:
1. Product name and 1-sentence summary
2. 3 things it does well
3. 1 honest weakness
4. The exact type of person who would love it
5. The exact type of person who should skip it
6. My affiliate link disclosure line

Be honest and warm. Avoid hype.
```

**Step 3 — Practise Saying the Review (15 min)**

Record yourself reading the card out loud on your phone (voice memo). Play it back. Adjust anything that sounds fake.

**Step 4 — Pick Your Portfolio (15 min)**

Choose 2 or 3 apps to actively promote. These become your portfolio. You can ignore the rest for now.

> **Why this matters:** Promoting only what you've used means your reviews are honest. Honest reviews convert better than slick ads — and they are legal.

---

### Billable Touchpoint A — Trial Plan Check (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod14_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Tell the support worker which 2 apps you will trial.
2. *"I'll trial [App 1] and [App 2] this week."*
3. Support worker confirms and sets a check-in date.

---

### Billable Touchpoint B — Mid-Trial Voice Check (10 min, async voice notes)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod14_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Halfway through the week, exchange voice notes about what you're finding.
2. Support worker prompts honest reflection: *"What's one thing you don't like about it?"*

---

### Billable Touchpoint C — Portfolio Sign-Off (15 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod14_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send your 2–3 Product Review Cards.
2. Support worker reviews honesty, tone, and disclosure. Approves portfolio. Milestone logged.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod14_a` — submits Touchpoint A
- `/submit_mod14_b` — submits Touchpoint B
- `/submit_mod14_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "how do I use [feature] in [app]" — bot gives step-by-step help
- Ask "rewrite this review more honest" — bot fixes tone
- Ask "what's my best app to promote" — bot looks at your audience data

**Check-In Question:** Would you personally pay for each app in your portfolio?

**Quiz Question:**
> Why must you actually use an app before promoting it?
> - A) Because the company says so
> - B) Because honest reviews build trust and bring repeat commissions ✓
> - C) Because it's fun
> - D) It doesn't matter

---

## Module 15 — Social Media for Affiliates

**Goal:** Run a 4-week affiliate content calendar that converts honest posts into recurring commission.

**Intro Video (Seedance Prompt):**
> A phone showing a social media post being typed. Below the link, the user adds the word "Ad". They press Post. The phone then shows a small notification: "1 new subscription." 15 seconds.

**What to Do:**
1. Use AI to plan 12 affiliate posts across 4 weeks.
2. Include a clear disclosure on every post.
3. Mix review, story, and helpful tip posts.
4. Track which post brings the most clicks.

**What You Will Make:** 12 affiliate posts published + a click & commission tracker.

---

### Open Activity — The Affiliate Content Engine

This activity will take about 75 minutes.

**Step 1 — Generate 12 Posts with Claude (30 min)**

```
Please plan 4 weeks of affiliate posts.

Apps I am promoting: [LIST FROM MODULE 14]
Platform: [WHICH ONE FROM MODULE 08]
My audience: [WHO]
Posting 3 times per week.

Each week mix:
- 1 honest REVIEW post (with affiliate link + disclosure)
- 1 STORY post (how I personally use it — no link)
- 1 HELPFUL post (a tip related to the app's problem — soft mention of app)

For each of the 12 posts, give me:
- Day of week
- Post type
- Caption (under 50 words)
- Whether to include the affiliate link (yes/no)
- The disclosure line if link is included
- A photo or video idea
```

**Step 2 — Make a Big Wall Calendar (15 min)**

Same grid as Module 08, but for affiliate posts.

**Step 3 — Set Up a Click Tracker (15 min)**

Most MilvoTech affiliate links have a click counter in your dashboard. Open it. Bookmark it.

Make a simple weekly log:

| Week | Post Topic | Platform | Clicks | New Subscriptions | Commission ($) |
|---|---|---|---|---|---|

**Step 4 — Schedule the First Week (15 min)**

If your platform allows scheduling (Facebook does), schedule all 3 of next week's posts now.

> **Why this matters:** 1 in 3 posts should NOT have a link. Pure-sales feeds get unfollowed. Mixing review, story, and tip posts keeps your audience engaged.

---

### Billable Touchpoint A — Content Plan Review (15 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod15_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the full 12-post plan.
2. Support worker checks the 3-1-1 mix, disclosure compliance, and tone. Coaches a better prompt if posts feel generic.

---

### Billable Touchpoint B — Mid-Month Performance Coaching (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod15_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After 2 weeks, send your click & commission tracker.
2. Support worker identifies your best-performing post type and suggests doing more of it.

---

### Billable Touchpoint C — Month-End Affiliate Review (15 min, async + voice note)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod15_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After 4 weeks, send full tracker.
2. Support worker sends a voice note summarising what worked, what didn't, and what to scale up next month. Milestone logged: **First Affiliate Commission Earned**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod15_a` — submits Touchpoint A
- `/submit_mod15_b` — submits Touchpoint B
- `/submit_mod15_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "is this post compliant" — bot checks disclosure
- Ask "post idea for [app]" — bot generates one
- Ask "best time to post my affiliate" — bot suggests based on your data

**Check-In Question:** Which post got the most clicks this week?

**Quiz Question:**
> Why mix posts with and without links?
> - A) To confuse the platform algorithm
> - B) Because audiences unfollow accounts that only sell ✓
> - C) To save data
> - D) AI makes you

---

## Module 16 — Community Networking

**Goal:** Build local community trust so neighbours, friends, and community members become repeat affiliate customers — with hands-on help from a local support worker.

**Intro Video (Seedance Prompt):**
> Three people sitting around a cafe table, one showing the others an app on their phone. The others nod and smile. A separate scene: a support worker pinning a flyer on a community noticeboard. Warm, real, community-focused. 15 seconds.

**What to Do:**
1. Map your local communities (groups, clubs, churches, markets).
2. Pick ONE community to start with.
3. Use AI to plan a respectful introduction.
4. Book a local support worker to visit with you (optional but recommended).
5. Help 3 people without asking for anything in return.

**What You Will Make:** A Community Map + 3 helped people + 1 new subscription (if it comes naturally).

---

### Open Activity — The Community Activation Plan

This activity will take about 90 minutes (across the week).

**Step 1 — Community Map (15 min)**

Same as v2 — draw yourself in the middle. Around you, draw:
- Online groups
- Local groups (markets, clubs, churches, NDIS network)
- People you already know who would benefit from your app portfolio

**Step 2 — AI Plans Your Approach (20 min)**

For ONE community, paste into Claude:

```
I want to introduce my affiliate apps to a community without being pushy.

Community: [E.G. "Local Facebook group for parents in Geelong" / "My church
craft circle" / "Sunday farmers market"]

Apps I think they'd love: [FROM MODULE 14]

Please plan a 2-week respectful approach:
- Week 1: How I show up and help without selling
- Week 2: When and how to mention my apps naturally

Give me exact example posts or things to say.
Make it honest, warm, and not pushy.
```

**Step 3 — Help Without Selling (across 1 week)**

For 7 days, just help. Answer questions. Share useful tips. Don't post your affiliate link unless it directly answers someone's question — and only if you genuinely believe it solves their problem.

**Step 4 — Book a Local Support Worker Visit (optional)**

For in-person communities (markets, clubs, church groups), book a local SW to attend with you. They:
- Carry your printed flyers / cards
- Introduce you confidently
- Handle any tough questions
- Make sure you're comfortable

**Step 5 — Track What Happens (15 min)**

In your tracker, note:
- People you helped
- Genuine questions about your apps
- Any subscriptions
- Anything that felt uncomfortable

> **Why this matters:** Your strongest customers are people who already trust you. Helping first, selling second, builds repeat commission for years.

---

### Billable Touchpoint A — Community Choice Review (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod16_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send your map + the one community you'll start with.
2. Support worker confirms or steers (some communities are wrong fit).

---

### Billable Touchpoint B — Local Field Visit (30–60 min, sync in-person — Local SW)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod16_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Book the local SW via the bot.
2. They meet you at the market, group, or community space.
3. You introduce yourself together. They support — they don't take over.
4. **Field-support line item** in NDIS billing.

If no in-person visit is needed, this becomes an async approach-plan review (10 min).

---

### Billable Touchpoint C — Reflection & Next Steps (15 min, async + voice note)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod16_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. End of week, send your tracker.
2. Support worker debriefs via voice note. What worked? What was uncomfortable? Adjust the approach. Milestone logged.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod16_a` — submits Touchpoint A
- `/submit_mod16_b` — submits Touchpoint B
- `/submit_mod16_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "what to say at a market" — bot gives a script
- Ask "is this comment helpful or pushy" — bot rates it
- Ask "find groups for [topic] in [my area]" — bot suggests

**Check-In Question:** Did you help someone this week without trying to sell them something?

**Quiz Question:**
> What is the best community approach?
> - A) Post your link in every comment
> - B) Help people first; mention your app only when it genuinely solves their problem ✓
> - C) Only join the biggest groups
> - D) Never engage

---

## Module 17 — Track and Grow

**Goal:** Use your affiliate dashboard plus AI analysis to spot what's working and scale it up.

**Intro Video (Seedance Prompt):**
> A clean dashboard screen with a bar chart trending up. A hand points to "Clicks: 47" and "Monthly Commission: $34.20". The hand then circles the highest bar. Confident, data-driven, optimistic. 15 seconds.

**What to Do:**
1. Open your affiliate dashboard.
2. Note your clicks, subscriptions, and commission for the past 4 weeks.
3. Use AI to analyse and recommend next steps.
4. Double down on what's working.
5. Drop what's not working.

**What You Will Make:** A 4-week Performance Tracker + a clear "scale up this, drop that" plan.

---

### Open Activity — AI Performance Analysis

This activity will take about 60 minutes.

**Step 1 — Gather 4 Weeks of Data (15 min)**

Fill in:

| Week | Best Post Topic | Platform | Clicks | New Subs | Commission ($) |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |

**Step 2 — AI Analysis with Claude (20 min)**

```
Please analyse my affiliate performance over 4 weeks.

Data:
Week 1: [PASTE ROW]
Week 2: [PASTE ROW]
Week 3: [PASTE ROW]
Week 4: [PASTE ROW]

Apps I promote: [LIST]
Platform: [WHICH]

Please tell me:
1. My total commission for the month
2. My best-performing post topic and why I think it worked
3. My weakest post type and what to stop doing
4. 3 specific changes to try next month
5. A realistic commission goal for next month

Keep advice specific and simple.
```

**Step 3 — Identify Your "Hero Post" (10 min)**

Find the single post that brought the most clicks. Look at it carefully:
- What was the topic?
- What was the tone?
- What time of day?
- What day of the week?

This is your formula. Use it more.

**Step 4 — Plan Next Month's Doubling Down (15 min)**

In your content calendar, replace the 3 weakest planned posts with 3 new posts using your Hero Post formula.

> **Why this matters:** Most affiliates spread thin across topics. The pros find their hero formula and use it again and again. Your numbers tell you what your hero is.

---

### Billable Touchpoint A — Data Check (10 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod17_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the 4-week data table.
2. Support worker verifies numbers match the dashboard. Spots any tracking errors.

---

### Billable Touchpoint B — AI Analysis Review (15 min, async + voice note)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod17_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the Claude analysis.
2. Support worker sends a voice note adding human context — what did they observe about your style?

---

### Billable Touchpoint C — Scale-Up Plan Sign-Off (15 min, async)


**NDIS Line Item:** Capacity Building — Skill Development  
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod17_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send your updated content calendar with the 3 hero-formula replacements.
2. Support worker approves and books the next month's review. Milestone logged: **First Affiliate Quarter Optimised**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod17_a` — submits Touchpoint A
- `/submit_mod17_b` — submits Touchpoint B
- `/submit_mod17_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "what's my best post" — bot pulls dashboard data
- Ask "why are clicks down" — bot suggests reasons
- Ask "next month goal" — bot calculates based on trend

**Check-In Question:** What is your single best-performing post and why?

**Quiz Question:**
> What should you do with a post that brings many clicks and subscriptions?
> - A) Delete it
> - B) Make 3 more posts using the same formula ✓
> - C) Lower the price
> - D) Change platforms

---

# Part 3 — Mastery & Life Library

Modules 18–24 deepen the participant's business AND open AI as a daily-life superpower. These modules are where AI stops being a business tool and becomes a self-advocacy, accessibility, and independence layer that was not possible before.

Every module in this Part includes an **"AI Superpower" sidebar** — one paragraph naming the specific outcome AI now makes possible for a participant with a disability.

---

## Module 18 — Customer Care with AI

**Goal:** Handle every customer message (good, bad, hard) with confidence using AI-drafted scripts you can adapt and reuse.

**Intro Video (Seedance Prompt):**
> A small business owner sits at a kitchen table. A phone buzzes with a difficult message. They breathe, open Claude on their laptop, paste the message in, and within 10 seconds a calm, professional reply appears. They smile and send it. 15 seconds.

**What to Do:**
1. Collect 3 real customer messages you have received (or imagine).
2. Use Claude to draft 5 reply templates (thank-you, apology, refund, polite no, follow-up).
3. Personalise each template in your own words.
4. Build a "Customer Care Playbook" file.
5. Save it where you can grab it from your phone in 30 seconds.

**What You Will Make:** A 5-template Customer Care Playbook in plain language, saved as a Google Doc or in Telegram saved messages.

> **🟢 AI Superpower:** A solo business owner with low literacy can now reply to a difficult customer email in under 2 minutes with a calm, professional message. Before AI, one bad reply could end a small business. Now every message is a chance to keep the customer.

---

### Open Activity — Build Your Customer Care Playbook

This activity will take about 60–75 minutes.

**Step 1 — Collect Real Customer Messages (10 min)**

On paper, write down 3 messages you have received or expect to receive. Examples:
- "Hi, do you have this in blue?"
- "I'm not happy with what I got."
- "Can I get a refund?"

**Step 2 — Draft 5 Templates with Claude (25 min)**

Open Claude (claude.ai) and paste:

```
I run a small business in Australia. My customer is [YOUR CUSTOMER from Module 03].
My business is [YOUR BUSINESS NAME].

Please write 5 short reply templates I can copy and paste:

1. THANK-YOU: when a customer says they love what I made.
2. APOLOGY: when something goes wrong (item arrived broken, mistake made).
3. REFUND: when a customer asks for their money back politely.
4. POLITE NO: when a customer asks for something I can't do (e.g. a colour I don't make, a price I can't drop to).
5. FOLLOW-UP: a friendly check-in 1 week after a sale.

Rules:
- Each template under 5 sentences.
- Year 6 reading level.
- Warm and human, never robotic.
- Australian English. No fake American phrases.
- Leave [BRACKET] fields for the customer's name and the specific thing.
```

**Step 3 — Personalise Each Template (15 min)**

Read each template out loud. Change any word that doesn't sound like you. Save the 5 templates in a Google Doc called "Customer Care Playbook" or in your Telegram saved messages.

**Step 4 — Rehearse the Hard One (10 min)**

Pick the template you find scariest (usually the refund or the apology). Paste it back into Claude with:

```
Pretend you are an upset customer. Send me 3 different angry messages.
I will reply using my apology template. Tell me how to improve.
```

> **Why this matters:** Customer service used to be the hardest part of running a small business — one bad message could lose a customer. AI gives you a calm, professional first draft every time, so you stay in control even on a bad day.

---

### Billable Touchpoint A — Playbook Plan Review (10 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod18_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 1, send the 3 customer messages to your support worker.
2. *"These are the kinds of messages I get. Are there any I've missed?"*
3. Support worker adds 1–2 likely messages from their experience.

---

### Billable Touchpoint B — Template Critique (15 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod18_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 2, screenshot all 5 Claude-drafted templates.
2. *"Here are my 5 templates. Do any sound wrong or too pushy?"*
3. Support worker flags any template that's off-tone and suggests a fix.

---

### Billable Touchpoint C — Playbook Sign-Off (10 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod18_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Send the finished Playbook (5 personalised templates) to the support worker.
2. *"My Playbook is finished. Where should I save it for fastest access?"*
3. Support worker confirms storage location and logs milestone.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod18_a` — submits Touchpoint A
- `/submit_mod18_b` — submits Touchpoint B
- `/submit_mod18_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- Ask "draft a reply" — bot will rewrite a tough message for you on the spot
- Ask "soften this" — bot makes any message friendlier
- Ask "is this too harsh?" — bot gives quick yes/no

**Check-In Question:** Do you have all 5 templates saved where you can find them on your phone?

**Quiz Question:**
> Why is it useful to have customer reply templates ready before you need them?
> - A) So AI does your job for you
> - B) So you can reply calmly even on a bad day, without freezing ✓
> - C) So you don't have to talk to customers at all
> - D) Because the templates are funny

---

## Module 19 — AI Reading Buddy

**Goal:** Turn any scary letter (Centrelink, NDIS, landlord, doctor, bill, contract) into plain Year-3 English in under a minute — and know what to do next.

**Intro Video (Seedance Prompt):**
> A person opens a mailbox and pulls out a thick official letter with a government logo. Their shoulders tense. They take a photo with their phone, open Claude on their tablet, and the letter is instantly retyped in big, simple words with a clear checklist of actions. Their shoulders drop. They smile. 15 seconds.

**What to Do:**
1. Find 1 real letter or email that has been sitting on your bench.
2. Take a clear photo of it (or save it as a PDF).
3. Upload it to Claude with the Reading Buddy prompt below.
4. Read the plain-English version out loud.
5. Decide your one next action.

**What You Will Make:** A saved "Reading Buddy" workflow you can use forever, plus the first real letter decoded and acted on.

> **🟢 AI Superpower:** A participant with dyslexia, low literacy, or English as a second language can now read and act on every official letter that lands in their mailbox. Independence. Wasn't possible 3 years ago — these letters used to require a support worker, a family member, or sit unopened for months.

---

### Open Activity — Become Your Own Letter Translator

This activity will take about 45–60 minutes.

**Step 1 — Pick Your Scariest Letter (5 min)**

Find a letter or email that has been making you anxious. Common ones:
- A Centrelink letter about your payment
- An NDIS plan review document
- A bill that looks confusing
- A landlord letter about rent or a lease
- A doctor's letter or test result
- A government form you don't understand

**Step 2 — Photo or PDF (5 min)**

Take a clear, flat photo of every page. Make sure the writing is readable. If it's already on your computer, save it as a PDF.

**Step 3 — Upload to Claude and Use the Reading Buddy Prompt (15 min)**

Open Claude (claude.ai), click the attach icon (📎), upload the photo or PDF, and paste this prompt:

```
You are my Reading Buddy. I find official letters hard to read.

Please:
1. Tell me in 1 sentence what this letter is about (Year 3 reading level).
2. List the 3 most important things the letter says, as bullet points,
   in plain English (no jargon).
3. Tell me what — if anything — I need to DO, as a numbered checklist.
4. Tell me the deadline (date) for each action, in big numbers.
5. Tell me what happens if I do nothing.
6. Tell me who to call for help, with the actual phone number from the letter.

Do not change any names, dates, amounts, or phone numbers from the letter.
If you are unsure about any number, write "CHECK WITH SUPPORT WORKER" next to it.
```

> **Honesty rule:** Claude is not a lawyer or a Centrelink officer. For any letter about money owed, court, or legal threats, ALWAYS confirm with your support worker before acting.

**Step 4 — Read It Out Loud (5 min)**

Read Claude's plain-English version out loud. If anything still feels confusing, paste it back and say *"Explain this part more simply."*

**Step 5 — Take Your One Next Action (15 min)**

From the checklist, pick the ONE thing you need to do today. Do it. (Examples: call a number, book an appointment, sign a form, write a date in your calendar.)

> **Why this matters:** Letters used to be a major source of anxiety, missed appointments, and missed deadlines for many participants. Now you can decode any letter in 1 minute and know exactly what to do next.

---

### Billable Touchpoint A — First Decode Review (15 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod19_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 3, send the support worker BOTH the original letter photo AND Claude's plain-English version.
2. *"Did Claude get this right? Anything wrong?"*
3. Support worker fact-checks dates, amounts, and instructions. Critical for high-stakes letters.

---

### Billable Touchpoint B — Action Plan Coaching (10 min, async or voice call)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod19_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 4, send the support worker your one chosen next action.
2. *"This is what I'm going to do. Is that the right first step?"*
3. Support worker confirms, suggests a better first step, or walks you through it.

---

### Billable Touchpoint C — Action Complete & Skill Sign-Off (15 min, async + voice note)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod19_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After taking the action, send a voice note describing what happened (Year 3 reading level — just say what you did).
2. *"I did the thing. Here is what happened."*
3. Support worker celebrates the milestone and logs you as "Reading Buddy certified" — meaning you can now decode letters on your own.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod19_a` — submits Touchpoint A
- `/submit_mod19_b` — submits Touchpoint B
- `/submit_mod19_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- Send any photo of a letter with the caption "decode this" — bot runs the Reading Buddy prompt automatically
- Ask "what does [word] mean?" — bot defines official jargon in plain English
- Ask "is this a scam?" — bot checks the message and warns you if it looks dodgy

**Check-In Question:** Have you decoded at least 1 real letter and taken 1 real action?

**Quiz Question:**
> When using AI as your Reading Buddy, what MUST you always do for letters about money, court, or legal threats?
> - A) Just trust the AI
> - B) Confirm with your support worker before acting ✓
> - C) Ignore the letter
> - D) Reply to the letter using AI

---

## Module 20 — Your Online Home

**Goal:** Build a real, live, one-page website for your business using AI-powered website builders — your business's permanent address on the internet.

**Intro Video (Seedance Prompt):**
> A laptop screen showing a blank page. AI types out a clean, professional one-page website: a hero photo, a clear business name, a "Contact me" button. The cursor moves to a green "Publish" button. The page goes live, and a phone notification chimes with the new web address. 15 seconds.

**What to Do:**
1. Choose a free AI website builder (Carrd, Wix AI, or Framer).
2. Pick a simple template.
3. Drop in your photos from Module 06 and copy from Modules 04, 05, 07.
4. Use AI to write any words still missing.
5. Hit "Publish".

**What You Will Make:** A live one-page website at a real web address (e.g. yourbusinessname.carrd.co) — your business's permanent home.

> **🟢 AI Superpower:** A solo trader from a kitchen table can have a professional website for $0–$19/year that rivals what agencies charge $5000 for. A participant with no coding skills, no design background, and no budget can publish a real business website in 90 minutes. Wasn't possible 3 years ago.

---

### Open Activity — Build Your One-Page Website

This activity will take about 75–90 minutes.

**Step 1 — Choose Your Tool (10 min)**

Three good free options:

| Tool | Best For | Cost |
|---|---|---|
| **Carrd** (carrd.co) | Super simple one-pagers | Free for 3 sites |
| **Wix AI** (wix.com/ai) | More fancy with AI design | Free with ads |
| **Framer** (framer.com) | Modern, looks designer-made | Free starter |

If unsure, ask Claude:

```
I sell [WHAT YOU SELL] to [YOUR CUSTOMER]. I have no coding skills.
I want one simple webpage with: my logo, 3 photos, my prices, a "Contact me"
button, and my phone number.

Which is easier for a beginner — Carrd, Wix AI, or Framer? Pick ONE and tell
me why in 4 sentences.
```

**Step 2 — Pick a Template (15 min)**

Sign up (free). Browse templates. Pick the one that:
- Has space for a big photo at the top
- Has 3 photo spots in the middle
- Has a "Contact me" button at the bottom
- Looks clean (not busy)

**Step 3 — Fill in the Words with AI (20 min)**

You already have most of the words from earlier modules. For anything missing, paste this into Claude:

```
I am building a one-page website for my business.
Business name: [FROM MODULE 03]
What I sell: [PRODUCT/SERVICE]
My promise to customers: [FROM MODULE 04 BRAND WORK]
My prices: [FROM MODULE 07]

Please write:
1. A 7-word headline for the top of my page (warm and clear).
2. A 3-sentence "About Me" paragraph (Year 6 reading, friendly).
3. A 1-line call to action above the "Contact me" button.
4. A short, honest disclaimer if needed (e.g. "Sydney only" or "Made fresh on order").

Australian English. No fake American phrases. No exclamation marks.
```

**Step 4 — Drop in Your Photos (15 min)**

Use the 3 cleaned-up photos from Module 06. Upload them. Place them in the photo spots.

**Step 5 — Set Up "Contact Me" (10 min)**

Wire the button to:
- Your business email, OR
- Your phone number (text only — never the home address), OR
- A Telegram link to your bot for quotes.

Do NOT put your home address on the website. Use your suburb only.

**Step 6 — Hit Publish (5 min)**

Read the whole page out loud one last time. If anything sounds wrong, fix it. Then click Publish. Save the live web address.

> **Why this matters:** Until very recently, a small business needed to pay a designer $2000–$5000 for a website. Now you can have a real, professional, mobile-friendly one-pager in 90 minutes for free.

---

### Billable Touchpoint A — Tool & Template Choice Review (10 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod20_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 2, screenshot the template you've picked.
2. *"This is the template I want to use. Is it the right fit for my business?"*
3. Support worker checks: photo space, mobile-friendly, simple enough for the learner to edit. Approves or suggests a different template.

---

### Billable Touchpoint B — Draft Page Critique (15 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod20_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 4, send the support worker the **preview link** of your draft page (every builder has one).
2. *"This is my draft. Anything I should fix before publishing?"*
3. Support worker checks: spelling, photo quality, mobile preview, contact safety (no home address).

---

### Billable Touchpoint C — Launch Day & First Share (15 min, async + voice note)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod20_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After publishing, send the live URL + a voice note: *"My website is live! Here it is."*
2. Support worker celebrates, adds the URL to your alumni file, and helps you plan: where to share it (Module 08 social channels, business card, email signature).
3. Milestone logged: First Website Live.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod20_a` — submits Touchpoint A
- `/submit_mod20_b` — submits Touchpoint B
- `/submit_mod20_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- Ask "how do I add a photo to Carrd?" — bot sends a screenshot tutorial
- Ask "preview my page" — bot reminds you how to share the draft link
- Ask "is my web address safe?" — bot checks URL for typos before publishing

**Check-In Question:** Is your website live and shareable?

**Quiz Question:**
> What should you NEVER put on your business website?
> - A) Your business name
> - B) Your home address ✓
> - C) Your phone number (text only)
> - D) Your suburb

---

## Module 21 — Hard Conversations & Self-Advocacy

**Goal:** Use AI to rehearse, draft, and survive any hard conversation — landlord, GP, NDIS planner, family, government — so you walk in prepared and walk out heard.

**Intro Video (Seedance Prompt):**
> A person sits at a kitchen table looking nervous, phone in hand. They open Claude on a tablet and type a few words. Claude pretends to be the landlord, asking tough questions. The person practises answering. They breathe out. They walk into the real meeting calm. 15 seconds.

**What to Do:**
1. Choose one real hard conversation coming up in your life.
2. Use Claude to rehearse it (role-play mode).
3. Use Claude to draft a formal email or letter if writing is easier than talking.
4. Print or screenshot your key points.
5. Have the conversation or send the email.

**What You Will Make:** A folder with: 1 rehearsed conversation script + 3 templated emails for life's hard moments (complaint, request, follow-up).

> **🟢 AI Superpower:** A participant who freezes in confrontation, has social anxiety, or struggles with formal language can now rehearse a hard conversation 10 times before having it — or skip the call entirely and send a polished email that gets the same outcome. Wasn't possible before; either you had a paid coach or you avoided the conversation.

---

### Open Activity — Rehearse and Win the Hard Conversation

This activity will take about 60–90 minutes.

**Step 1 — Pick the Hard Conversation (10 min)**

Write down on paper one conversation you've been avoiding. Examples:
- Asking the landlord to fix the heater
- Telling the GP about a side effect
- Asking for a different support worker
- Pushing back on a family member who is taking your money
- Asking the NDIS planner for more funding
- Telling a customer "no"

**Step 2 — Rehearse with Claude (25 min)**

Open Claude and paste:

```
I need to practise a hard conversation. Please role-play with me.

Who you will pretend to be: [LANDLORD / GP / NDIS PLANNER / etc.]
What I need to say: [WRITE IT IN SIMPLE WORDS — e.g. "I need the heater fixed
                     and it has been 3 weeks"]
What I'm scared of: [e.g. "They will say it's not their job"]
My communication style: I am [calm / direct / nervous]. I prefer [face-to-face /
                       phone / email]. I have [a learning disability / anxiety /
                       low literacy] — please go slow and use plain words.

Please:
1. Pretend to be [WHO] and start the conversation.
2. After my reply, tell me what worked and what to change.
3. We do 3 rounds. By the end, I should feel ready.

Year 6 reading level. Be warm but realistic.
```

**Step 3 — Draft the Email Option (15 min)**

Even if you plan to have the conversation face-to-face, draft an email version as backup. Paste:

```
Please draft a formal but warm email from me to [PERSON].

Subject: [WHAT IT'S ABOUT]
Background: [1-2 sentences]
What I want: [1 SENTENCE — what action do I need from them]
Deadline (if any): [DATE]

Rules:
- Year 8 reading level for the recipient (slightly more formal).
- 4 short paragraphs max.
- Polite but firm.
- Australian English.
- End with my full name as [NAME].
```

**Step 4 — Print or Screenshot Your Key Points (5 min)**

From the rehearsal, write down on paper the 3 key sentences you want to say no matter what. Carry the paper in your pocket for the real conversation.

**Step 5 — Have the Conversation (varies)**

Take the action — either the conversation or the email.

> **Why this matters:** Most hard conversations go badly because we go in unprepared. AI gives you unlimited free rehearsal time. It's like having a coach in your pocket.

---

### Billable Touchpoint A — Conversation Plan Review (15 min, async + optional voice call)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod21_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 1, send the support worker the conversation you've chosen.
2. *"This is what I want to say. Is this the right person to say it to?"*
3. Support worker checks: is this conversation safe to have alone? Does it need an advocate, a witness, or a formal complaint process instead?

> **Safety check:** If the conversation involves abuse, threats, or financial harm, the SW MUST escalate to a formal advocacy process. Do NOT do this conversation alone.

---

### Billable Touchpoint B — Rehearsal Review (15 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod21_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 2, screenshot your 3-round Claude rehearsal.
2. *"This is how I practised. Did I miss anything important?"*
3. Support worker reads the rehearsal, suggests 1 better line or 1 thing to avoid.

---

### Billable Touchpoint C — Post-Conversation Debrief (15 min, async + voice note)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod21_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After the conversation (or sending the email), send a voice note: *"This is what happened."*
2. Support worker debriefs: what worked, what to do differently next time. If outcome was bad, plan the next step.
3. Milestone logged: First Self-Advocacy Win.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod21_a` — submits Touchpoint A
- `/submit_mod21_b` — submits Touchpoint B
- `/submit_mod21_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- Ask "rehearse with me" — bot starts an instant role-play
- Ask "draft an email to [person] about [issue]" — bot writes one in 30 seconds
- Ask "calm me down before this meeting" — bot offers a 2-minute breathing script

**Check-In Question:** Did you have the conversation (or send the email)?

**Quiz Question:**
> What is the best thing to do when a hard conversation feels too scary?
> - A) Avoid it forever
> - B) Rehearse it with AI 3+ times, then have it ✓
> - C) Send an angry email
> - D) Ask family to do it for you

---

## Module 22 — AI for Health & Wellbeing

**Goal:** Use AI as your pre-doctor visit prep buddy, your medication explainer, and your plain-English health-info translator — without ever letting AI replace your doctor.

**Intro Video (Seedance Prompt):**
> A person walking into a GP clinic with their phone open. The phone screen shows a clean checklist: "Questions to ask, Symptoms to mention, Medicines I take." They sit down across from the GP and refer to the list. The GP smiles and writes notes. 15 seconds.

**What to Do:**
1. Pick your next GP, specialist, or NDIS health visit.
2. Use Claude to build a pre-visit checklist (what to ask, what to mention).
3. Use Claude to translate any health information into plain English.
4. Set up Telegram bot reminders for medications (if you take them).
5. Take the checklist to the appointment.

**What You Will Make:** A pre-visit health checklist + a personal "Health Words" glossary + (optional) a daily medication reminder.

> **🟢 AI Superpower:** A participant who used to leave GP visits confused, forget half their questions, and not understand the prescription label, can now walk in prepared and walk out with a plan they understand. Doctors give 15-minute visits; AI gives you 60 minutes of free prep beforehand.
>
> **⚠️ Critical limit:** AI is NOT a doctor. It does not diagnose. It does not prescribe. It does not replace your GP, psychologist, or therapist. AI is the bridge between you and your doctor, never a replacement.

---

### Open Activity — Become Your Own Health Prep Buddy

This activity will take about 60–75 minutes.

**Step 1 — Pick the Next Visit (5 min)**

Write down:
- Who you are seeing: [GP / specialist / dentist / psychologist / NDIS health review]
- Date: [DATE]
- What it's about: [reason in 1 sentence]

**Step 2 — Build the Pre-Visit Checklist with Claude (20 min)**

Paste into Claude:

```
I have a [GP / SPECIALIST / etc.] visit coming up.

Reason for visit: [WHAT'S GOING ON — be honest, plain words]
How long it's been: [TIME]
What I've already tried: [REST / PARACETAMOL / NOTHING / etc.]
Medicines I am already on: [LIST OR "NONE"]
What I want from the visit: [DIAGNOSIS / REFERRAL / PRESCRIPTION / PLAN]

Please write me a pre-visit checklist:
1. The 5 most important things to mention to the doctor (symptoms, history).
2. The 4 best questions to ask the doctor.
3. 3 questions I should ask BEFORE I leave the room (about medicines,
   side effects, what to do if it gets worse).
4. What information to bring (Medicare card, any past test results, etc.).

Plain Year 5 reading level. Numbered. I will print this.

Do NOT diagnose me. Do NOT tell me what is wrong. Only prep me for
the doctor's questions.
```

**Step 3 — Translate Any Health Words You Don't Know (15 min)**

If you have a letter, prescription, test result, or website with hard words, paste:

```
Please explain these health words to me in plain Year 4 reading English.
One sentence each. No scary detail. Just what it means.

Words: [PASTE THE WORDS OR THE WHOLE TEXT]
```

Add these to a "Health Words" file on your phone.

**Step 4 — Set Up Medication Reminders (Optional, 15 min)**

If you take medicine daily, ask the SynthexIQ bot in Telegram:

```
/set_medication_reminder
```

The bot will ask:
- What medication? (just the name on the box)
- What time(s) of day?
- How many days a week?

The bot will send a "💊 Time for your [name]" message at those times. Reply ✅ when you've taken it. The bot tracks weekly compliance — useful for showing your GP.

> **Honesty rule:** The bot tracks WHEN you took the medicine. It does NOT tell you the dose, change the dose, or advise stopping. That is your doctor's job only.

**Step 5 — Take the Checklist to the Visit (5 min)**

Print or screenshot the checklist. Take it in. Refer to it. Tick things off as you cover them.

> **Why this matters:** Most participants leave GP visits forgetting the question that mattered most. AI prep means you walk in confident and walk out with a clear plan.

---

### Billable Touchpoint A — Visit Plan Review (15 min, async + voice call optional)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod22_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 2, send the support worker the Claude-generated checklist.
2. *"This is what I want to cover at the appointment. Did I miss anything important?"*
3. Support worker reviews and adds any missing item (especially for NDIS plan visits or specialist referrals).

---

### Billable Touchpoint B — Health Words Glossary Review (10 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod22_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 3, send your Health Words file.
2. *"Did Claude explain these right? Anything still confusing?"*
3. Support worker verifies the plain-English version is correct (not oversimplified or misleading).

---

### Billable Touchpoint C — Post-Visit Debrief (15 min, sync voice call)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod22_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After the appointment, voice call the support worker.
2. *"This is what the doctor said. This is the plan. Did I understand it right?"*
3. Support worker confirms the plan, adds any actions to the learner's calendar, and flags anything that needs follow-up.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod22_a` — submits Touchpoint A
- `/submit_mod22_b` — submits Touchpoint B
- `/submit_mod22_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- Send a photo of any prescription, test result, or doctor's letter → bot translates to plain English
- Ask "what is [health word]?" — bot defines in Year 4 language
- Ask "/set_medication_reminder" — bot sets up daily reminder
- Ask "I feel unwell — what do I do?" — bot gives the correct triage path (000, Healthdirect 1800 022 222, GP, or rest) — NEVER diagnoses

**Check-In Question:** Did you take a prep checklist to your last health visit?

**Quiz Question:**
> What is AI NEVER allowed to do for your health?
> - A) Help you write down questions for the doctor
> - B) Translate hard health words into plain English
> - C) Diagnose you or tell you what medicine to take ✓
> - D) Remind you when to take medicine

---

## Module 23 — Telling Your Story

**Goal:** Use AI to write your business story AND your lived-experience story — turning what you've been through into a published asset that builds your business and (optionally) opens a paid peer-support career path.

**Intro Video (Seedance Prompt):**
> A person sits with a cup of tea, talking into their phone. The words appear on screen as Claude rewrites them into a clean, moving "About Me" page. The final page goes live on their website. A notification: "5 people read your story today." They smile. 15 seconds.

**What to Do:**
1. Voice-record yourself answering 5 questions about your life and business.
2. Use Claude to turn the recording into a written story.
3. Edit the story until it sounds like you.
4. Publish it (on your website, social, or business card).
5. Decide if you want to explore the paid peer-support pathway (signposted, not pushed).

**What You Will Make:** A 300-word "About Me" page + (optionally) a longer lived-experience story for peer-support work.

> **🟢 AI Superpower:** A participant who could never afford a copywriter can now publish a story about their life and business at a quality that would have cost $1500–$3000 to ghost-write. And — for participants who want it — their lived experience becomes a paid career as an NDIS peer-support worker. Wasn't possible before at this quality.

---

### Open Activity — Write Your Story With Your Own Voice

This activity will take about 75–90 minutes.

**Step 1 — Voice-Record the 5 Story Questions (15 min)**

Open the Telegram bot and type:

```
/start_story
```

The bot will ask you (one at a time, by voice if you prefer):

1. What is your business and why did you start it?
2. What's something you've been through that made you who you are today?
3. What's something you're proud of?
4. Who do you help, and how does your business help them?
5. If a customer reads this, what do you want them to feel?

Just talk. Don't write. The bot transcribes your voice into text.

**Step 2 — Turn It Into a Story With Claude (25 min)**

Copy the bot's transcript and paste into Claude:

```
Please turn my voice transcript into a 300-word "About Me" page for my
business website.

Rules:
- Use only my own words. Do NOT add things I did not say.
- Year 8 reading level (the customer will read this).
- Warm, honest, not boastful.
- Keep my voice — don't make it sound corporate or fake.
- End with a 1-sentence invitation to the reader (e.g. "Come say hi at the market on Saturday").
- Australian English. No fake American phrases.

If anything in my story is too private or risky to publish (financial details,
abuse details, identifying others), flag it for me to decide.

Transcript: [PASTE YOUR TRANSCRIPT]
```

**Step 3 — Read Out Loud and Edit (15 min)**

Read the story out loud. Does it sound like you? Change any line that doesn't. Add anything Claude missed. Take out anything that feels too private.

**Step 4 — Publish It (10 min)**

Choose where to publish:
- On your website (Module 20)
- On your social media (Module 08 / 15)
- As a printed leaflet at your market stall
- All of the above

**Step 5 — Optional: Explore Paid Peer Support Pathway (15 min, optional)**

Some participants want to take their story further and become a paid **NDIS peer support worker** — being paid to use lived experience to help others on similar journeys.

The bot can give you the official pathway map:

```
/peer_support_info
```

This is NOT part of the course. It's a signposted next step you can take if and when you're ready, with no pressure. Many peer-support workers earn $35–$60/hr.

> **Why this matters:** Your story is unique. AI doesn't make it up — it just helps you put it on paper at a quality you can be proud of.

---

### Billable Touchpoint A — Story Topic Review (10 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod23_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 1, send the support worker the voice transcript.
2. *"This is what I want to share. Am I oversharing? Or holding back too much?"*
3. Support worker reviews for safety (no identifying info that could harm the learner) and richness (gently nudges toward more detail if too thin).

> **Safety check:** Stories that mention abuse, current legal situations, ongoing court matters, or third parties (children, ex-partners) MUST be reviewed extra carefully. The SW may suggest a redacted version.

---

### Billable Touchpoint B — Draft Story Critique (15 min, async + voice note)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod23_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 2, send the Claude-rewritten draft.
2. *"Does this sound like me? Anything I should change?"*
3. Support worker reads, sends a voice note with 2 things to keep and 1 thing to change.

---

### Billable Touchpoint C — Publication Sign-Off (15 min, async)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod23_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After publishing, send the live link or photo of the printed version.
2. *"My story is live!"*
3. Support worker celebrates, adds to alumni file, and asks if the learner wants the `/peer_support_info` pathway map.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod23_a` — submits Touchpoint A
- `/submit_mod23_b` — submits Touchpoint B
- `/submit_mod23_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- `/start_story` — begins the 5-question voice story
- `/peer_support_info` — sends the paid peer-support pathway info
- Ask "is this too personal to publish?" — bot offers honest feedback

**Check-In Question:** Is your story published somewhere a customer can read it?

**Quiz Question:**
> What is the most important rule when AI helps write your story?
> - A) Use only your own words — AI must not invent things you didn't say ✓
> - B) Make it as long as possible
> - C) Add fancy words to sound smart
> - D) Hide the hard parts of your life

---

## Module 24 — Graduation: Your Next 12 Months

**Goal:** Use AI to build a personal 12-month plan covering your business goals AND your life goals — and choose your pathway forward (deeper business, paid peer-support, or optional affiliate).

**Intro Video (Seedance Prompt):**
> A person looks at a wall calendar covering 12 months. A laptop next to it shows an AI-generated plan with monthly milestones, each ticking off in turn. The final frame shows the person holding a printed graduation certificate from AI Launchpad. They smile. 15 seconds.

**What to Do:**
1. Reflect on what you've made in modules 05–23.
2. Use Claude to build your personal 12-month plan.
3. Pick your pathway forward (3 options).
4. Connect to the alumni network.
5. Receive your graduation certificate.

**What You Will Make:** A printed 12-month plan + chosen pathway + alumni network access + graduation certificate.

> **🟢 AI Superpower:** A coherent, written, achievable 12-month plan, custom-fit to the participant's specific abilities, interests, and current business — generated in 90 minutes. This used to require an expensive business coach. Now every graduate leaves with one.

---

### Open Activity — Build Your 12-Month Plan and Choose Your Path

This activity will take about 90 minutes.

**Step 1 — Reflect on What You've Made (15 min)**

Open the Telegram bot:

```
/my_journey
```

The bot pulls your milestones from all 19 prior modules and shows you:
- Your business name (Module 03) and logo (Module 04)
- Your website (Module 20)
- Your first sale date (Module 09)
- Your customer-care playbook (Module 18)
- Your story (Module 23)
- Total billable touchpoints completed
- Total weeks in the program

Read it out loud. This is what you've built.

**Step 2 — Build the 12-Month Plan with Claude (35 min)**

Paste into Claude:

```
I am graduating from AI Launchpad — an Australian NDIS-funded program that
taught me to start a small business and use AI tools.

About me:
Business: [BUSINESS NAME]
What I sell: [PRODUCT/SERVICE]
Current customers per week: [NUMBER OR "0–2"]
Current weekly income from business: $[AMOUNT]
What I'm best at: [1–2 things]
What I find hard: [1–2 things]
Tools I now use well: [ChatGPT / Claude / Gemini / website builder / etc.]

Life goals (next 12 months):
1. [ONE LIFE GOAL — e.g. "feel less lonely", "get fitter", "save $2000"]
2. [ONE LIFE GOAL]
3. [ONE LIFE GOAL]

Business goals (next 12 months):
1. [ONE BUSINESS GOAL — e.g. "5 customers a week", "first $500 month"]
2. [ONE BUSINESS GOAL]
3. [ONE BUSINESS GOAL]

Please build me a 12-month plan with:
- One clear "main goal" for each month (12 total).
- 2–3 small steps under each month, written in plain Year 5 English.
- Honest about my pace — I have a disability, I cannot do too much.
- An AI tool to use each month (one per month is enough).
- A "celebrate this" line at the end of each month.

Layout: a clean table I can print out and stick on the fridge.
```

**Step 3 — Pick Your Pathway Forward (15 min)**

Three pathways are open to every graduate:

| Pathway | What it is | Time per week | Income potential |
|---|---|---|---|
| **A — Deeper Business** | Stay focused on growing your microenterprise. Monthly check-ins with your SW, group workshops, optional advanced modules (markets, wholesale, online ads). | 8–15 hrs | Your own business income |
| **B — Paid Peer Support** | Train as an NDIS peer-support worker. Use your lived experience to help others in the program. Paid hourly. Separate certification required. | 5–20 hrs | $35–$60/hr (Australian rates) |
| **C — Optional Affiliate Pathway** | Promote MilvoTech apps for monthly recurring commission. **Disclosure: this earns the program operator commission. Choose only if it genuinely interests you.** Separate opt-in modules CA-01 to CA-06. | Variable | Variable, commission-based |

You can also pick **NONE OF THE ABOVE** and just keep running your business. That is also a valid graduation outcome.

Ask Claude to help you decide:

```
I am choosing a pathway after AI Launchpad graduation.

My situation: [STATE THE 3 LIFE GOALS AND 3 BUSINESS GOALS FROM STEP 2]
My energy / capacity per week: [LOW / MEDIUM / HIGH]
What I love most about what I've built: [1 SENTENCE]

The 3 pathways are: A (deeper business), B (paid peer support), or C (optional
affiliate — paid commission but earns the program operator money too).

Please:
1. Reflect back to me which pathway might fit best, and why, in 4 sentences.
2. Name one risk of that pathway for me specifically.
3. Suggest one tiny first step I can take this week.

You do not decide — I do. Just help me think.
```

**Step 4 — Join the Alumni Network (10 min)**

Open the Telegram bot:

```
/join_alumni
```

You'll be added to:
- The alumni Telegram channel (peer support, monthly Q&A, group calls)
- The graduate directory (other businesses can find yours)
- The alumni newsletter (monthly tips, new AI tools, success stories)

**Step 5 — Receive Your Graduation Certificate (5 min)**

The bot generates your certificate with your business name, your graduation date, and your chosen pathway. Print it. Frame it.

> **Why this matters:** Most courses end with nothing. Graduation here means a real 12-month plan, a real pathway, a real alumni network, and a real certificate of what you can now do.

---

### Billable Touchpoint A — Plan Review Call (30 min, sync video call)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod24_a` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 2, book a 30-minute video call with the support worker.
2. Walk through the 12-month plan together, month by month.
3. Support worker challenges anything unrealistic, celebrates anything ambitious-but-doable, and adjusts the pace if needed.

---

### Billable Touchpoint B — Pathway Choice Conversation (20 min, sync voice call)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod24_b` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. After Step 3, voice call the support worker.
2. *"I'm thinking of going with Pathway [A/B/C/None]. What do you think?"*
3. Support worker probes for fit, **explicitly discloses any conflict of interest** if learner is leaning toward Pathway C, and confirms the choice or suggests a delay.

> **Conflict-of-interest disclosure rule:** Because the program operator earns commission when learners pick Pathway C, the SW MUST tell the learner this out loud and confirm Pathway C is the learner's free choice, not pressure. Logged for audit.

---

### Billable Touchpoint C — Graduation Day (20 min, sync — in-person or video)

**NDIS Line Item:** Capacity Building — Skill Development
**Billing Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_mod24_c` in your Telegram group chat before you send your work. The bot records the start time. When your support worker replies, the bot records the end time and closes the event.

1. Book the graduation event (group or 1:1).
2. Receive your certificate. Hear your milestones read aloud. Take a photo for the alumni wall.
3. **Milestone logged: Graduated.** Your status changes from "Participant" to "Alumni" in the system.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_mod24_a` — submits Touchpoint A
- `/submit_mod24_b` — submits Touchpoint B
- `/submit_mod24_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help (Unbillable, 24/7):**
- `/my_journey` — shows everything you've built across the program
- `/join_alumni` — joins the alumni network
- `/12_month_check` — every month after graduation, the bot will check in on your plan and help you adjust
- Ask "what's next for me?" — bot summarises your pathway and next step

**Check-In Question:** Do you have your 12-month plan printed and your pathway chosen?

**Quiz Question:**
> What is the most important thing about graduation?
> - A) Getting the certificate
> - B) Having a real, written 12-month plan and a clear next pathway ✓
> - C) Joining the Telegram group
> - D) Saying goodbye to your support worker

---

# Part 4 — Optional Pathway: Compliance Agent (Affiliate)

> **⚠️ CONFLICT-OF-INTEREST DISCLOSURE**
>
> This pathway is an **affiliate program**. It trains graduates to become paid promoters of the MilvoTech Compliance Audit app to NDIS service providers. The program operator (MilvoTech) earns commission on every Compliance Audit subscription a graduate sells.
>
> **This is NOT part of the official AI Launchpad curriculum.** Modules 05–24 cover the official course. The pathway below is opt-in only, available to graduates who choose Pathway C in Module 24, and who clearly understand the financial relationship.
>
> No NDIS funding is used for this pathway. Sessions in this pathway are run **outside billable time** unless they specifically build a graduate's compliance-audit skills as a stand-alone vocational outcome. Any billing must be reviewed with the participant's plan manager.
>
> If you are reading this and you are unsure why you would do this pathway, the answer is: don't, until you have run your own business successfully for at least 3 months after graduation.

The 6 sub-modules below were previously listed as official Modules 18–23 in earlier drafts of v3. They have been relocated here so that NDIS-funded training time is not used to grow the program operator's commercial product.

For reference inside this Pathway, the modules are numbered **CA-01 to CA-06**. Trigger phrases use the `/submit_capath_` prefix.

---

## Compliance Agent Pathway — Sub-Modules CA-01 to CA-06

Originally drafted as Modules 18–23. Relocated here as an opt-in affiliate pathway.

---

## Sub-Module CA-01 — Understanding NDIS Compliance

**Goal:** Learn the 3 main NDIS Code of Conduct rules and what happens when providers fail them — using AI to translate official documents into plain English.

**Intro Video (Seedance Prompt):**
> A professional person in a clean uniform holding a tablet with a shield icon. They tap "Read" and the AI translates a complex government page into simple bullet points. They nod confidently. 15 seconds.

**What to Do:**
1. Read the 3 main NDIS Code of Conduct rules.
2. Use AI to translate the official document into plain English.
3. Write one real-life example for each rule.
4. Identify 1 local NDIS provider you could practise auditing.

**What You Will Make:** A plain-English NDIS Rules summary + a Practice Provider chosen.

---

### Open Activity — Compliance Foundations

This activity will take about 75 minutes.

**Step 1 — Read the 3 Main Rules (10 min)**

1. Treat people with respect and dignity
2. Keep people safe from harm
3. Be honest in everything you do

**Step 2 — AI Translates the Real Document (20 min)**

Paste into Claude:

```
I am training as an NDIS compliance agent. I have low literacy.

Please summarise the NDIS Code of Conduct in plain English.
Use bullet points. Use Year 6 reading level.

For each main rule, give me:
- The rule in 1 simple sentence
- What it looks like when a provider FOLLOWS it (1 example)
- What it looks like when a provider BREAKS it (1 example)
- What happens to the provider if they break it
```

> **Important:** AI is for translation only. The actual rules come from the NDIS Quality and Safeguards Commission website. Always cross-check important rules with your support worker.

**Step 3 — Pick a Practice Provider (15 min)**

Choose a local NDIS provider (a real one, but you will not audit them for real yet — just for practice). Examples:
- A local disability support agency
- A community mental health service
- A respite or day program

Ask the bot: *"List NDIS providers near [my suburb]"*

**Step 4 — Plain-English Rules Poster (20 min)**

Make a wall poster (same as v2) but use the AI translation as your structure.

> **Why this matters:** Most NDIS providers struggle because the rules are written in legal language. A compliance agent who explains the rules in plain English is genuinely valuable.

---

### Billable Touchpoint A — AI Translation Review (15 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_01_a` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send the Claude translation.
2. Support worker verifies accuracy against the official NDIS Code of Conduct. This is critical — AI can hallucinate rules.

---

### Billable Touchpoint B — Practice Provider Choice Review (10 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_01_b` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send your chosen practice provider.
2. Support worker confirms it's a reasonable practice target.

---

### Billable Touchpoint C — Rules Poster Sign-Off (15 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_01_c` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send poster photo.
2. Support worker checks rules are stated correctly. Milestone logged: **Compliance Foundations Complete**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_capath_01_a` — submits Touchpoint A
- `/submit_capath_01_b` — submits Touchpoint B
- `/submit_capath_01_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "find NDIS rule on [topic]" — bot links to official page
- Ask "explain restrictive practices" — bot gives a plain-English summary
- Ask "who do I report a breach to" — bot gives the official complaint pathway

**Check-In Question:** What are the 3 main NDIS rules in your own words?

**Quiz Question:**
> Why translate the NDIS Code of Conduct into plain English?
> - A) Because the original is wrong
> - B) Because clear language helps providers and participants follow the rules ✓
> - C) Because it sounds nicer
> - D) You don't need to

---

## Sub-Module CA-02 — Running an AI Audit Scan

**Goal:** Run your first Gap Analysis scan on the AI Launchpad platform and produce a real audit report.

**Intro Video (Seedance Prompt):**
> A hand taps a "Scan" button on a tablet. A magnifying glass moves across an animated checklist. Green ticks and red Xs appear. A final summary screen shows "Score: 78% Compliant". The hand prints a clean report. 15 seconds.

**What to Do:**
1. Open the Gap Analysis tool on the AI Launchpad platform.
2. Enter your practice provider's details.
3. Run the scan.
4. Read the report.
5. Use AI to translate red items into plain English action steps.

**What You Will Make:** A completed Gap Analysis report + a plain-English Action List.

---

### Open Activity — The Audit Scan & Translation

This activity will take about 75 minutes.

**Step 1 — Run the Scan on the Practice Provider (15 min)**

Follow the platform's Gap Analysis steps. Wait for results.

**Step 2 — Read the Red Items (15 min)**

Each red item means "this needs fixing." Don't panic — even good providers usually have 5–10 red items.

**Step 3 — AI Translates Each Red Item (25 min)**

For each red item, paste into Claude:

```
A compliance scan flagged this issue with an NDIS provider:

"[PASTE EXACT RED ITEM TEXT]"

Please explain in plain English:
1. What this problem actually means
2. Why it matters for participant safety
3. The exact steps the provider needs to take to fix it
4. About how long fixing it would take

Use Year 6 reading level.
```

Save each AI translation under the red item.

**Step 4 — Build the Action List (20 min)**

On one page, write:

| Priority | Issue | Action Needed | Time to Fix | Cost (rough) |
|---|---|---|---|---|
| HIGH | | | | |
| MEDIUM | | | | |
| LOW | | | | |

This is what you'll show the real client when you get there.

> **Why this matters:** A raw scan report looks scary. A plain-English action list with priorities is what clients actually pay for. You are the translator.

---

### Billable Touchpoint A — Scan Setup Help (10 min, async or screen-share)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_02_a` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Before scanning, send the support worker your provider details.
2. Confirms inputs. If you're stuck, support worker does a 10-min screen-share to walk you through.

---

### Billable Touchpoint B — Red Item Translation Review (15 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_02_b` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send 2 or 3 of your AI translations.
2. Support worker confirms they're accurate. Critical because AI can simplify too much and lose legal meaning.

---

### Billable Touchpoint C — Action List Sign-Off (15 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_02_c` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send finished Action List.
2. Support worker reviews and prepares you for client conversations. Milestone logged: **First Audit Complete**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_capath_02_a` — submits Touchpoint A
- `/submit_capath_02_b` — submits Touchpoint B
- `/submit_capath_02_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "what does [audit term] mean" — bot gives a plain-English definition
- Ask "is this red item serious" — bot rates severity
- Ask "example action for [issue]" — bot gives a fix template

**Check-In Question:** How many red items did your practice scan find?

**Quiz Question:**
> What is the purpose of translating red items into plain English?
> - A) To make the report shorter
> - B) So the provider understands what to fix and why it matters ✓
> - C) Because the platform requires it
> - D) To impress your support worker

---

## Sub-Module CA-03 — Pricing & Closing the Deal

**Goal:** Confidently present your compliance services to a real or practice client, agree a price, and get it in writing.

**Intro Video (Seedance Prompt):**
> A professional slides a one-page proposal across a table. A client reads it, smiles, and signs. They shake hands. The proposal shows three tiers clearly. 15 seconds.

**What to Do:**
1. Use AI to build a 3-tier service proposal template.
2. Set your prices (per scan, per package, per month).
3. Role-play the conversation with your support worker.
4. Send the proposal to your first real prospect.

**What You Will Make:** A professional 1-page proposal template with 3 tiers + a confident pitch script.

---

### Open Activity — Build the Proposal & Pitch

This activity will take about 75 minutes.

**Step 1 — AI Builds the Proposal Template (25 min)**

Paste into Claude:

```
Please design a professional 1-page service proposal template for my new
NDIS compliance consultancy.

My business name: [FROM MODULE 03]
My logo / brand colours: [FROM MODULE 04]
My services come in 3 tiers:

TIER 1 — Basic Audit Scan
- 1 Gap Analysis scan
- 1-page plain-English action list
- 1-hour walkthrough call
- Suggested price: $[X]

TIER 2 — Full Compliance Package
- Tier 1 + on-site audit + 30-day follow-up + action plan template
- Suggested price: $[Y]

TIER 3 — Ongoing Compliance Partner
- Quarterly scans + monthly check-ins + unlimited Telegram support
- Suggested price: $[Z] / month

Please give me the proposal template with:
- Header (my business)
- Client details section
- Service comparison table (3 tiers)
- Inclusions and exclusions
- Terms and payment
- Signature blocks
- Friendly, professional tone
- Plain English throughout

Format it so I can fill it in for every new client.
```

**Step 2 — Set Real Prices (15 min)**

Ask Claude:

```
For a small NDIS provider in [STATE], what is a realistic price for:
1. A one-off compliance audit (Tier 1)
2. A full compliance package with on-site visit (Tier 2)
3. An ongoing monthly compliance retainer (Tier 3)

Please give me a price range for each and explain what an entry-level
provider would charge versus an established consultant.
```

**Step 3 — Pitch Practice with AI (20 min)**

Paste:

```
Please role-play a small NDIS provider considering my compliance services.
Ask me 5 tough questions like:
- Why should I pay you when I can do this myself?
- Are you qualified?
- What happens if I fail the audit anyway?
- Can you guarantee compliance?
- How is this better than my existing auditor?

After each question, suggest a friendly, honest answer I can use.
```

Read the answers out loud 3 times.

**Step 4 — Fill in the Template for Your First Prospect (15 min)**

Pick one real prospect (your practice provider). Fill in their details. Save it.

> **Why this matters:** Most beginners undercharge or freeze when asked "why should I pay you?" Practising the conversation with AI removes the freeze.

---

### Billable Touchpoint A — Pricing Review (15 min, async + voice note)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_03_a` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send the AI price range + your chosen prices.
2. Support worker sends a voice note: are these realistic? Sustainable?

---

### Billable Touchpoint B — Live Role-Play (20 min, sync voice call)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_03_b` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Book a 20-minute voice call.
2. Support worker plays the prospect. You deliver your pitch.
3. Feedback in real time on tone, clarity, confidence.

---

### Billable Touchpoint C — Proposal Sign-Off (15 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_03_c` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send the completed proposal for your first prospect.
2. Support worker checks accuracy and approves sending. Milestone logged: **First Proposal Ready**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_capath_03_a` — submits Touchpoint A
- `/submit_capath_03_b` — submits Touchpoint B
- `/submit_capath_03_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "objection: [their concern]" — bot gives a polite response
- Ask "discount or not" — bot advises based on tier
- Ask "follow-up message" — bot drafts one

**Check-In Question:** Are your prices high enough that one sale a month pays for the program?

**Quiz Question:**
> What is the main purpose of a 1-page proposal?
> - A) To impress with length
> - B) To document what's agreed, in plain English, before work begins ✓
> - C) To make the client confused
> - D) Templates aren't important

---

## Sub-Module CA-04 — Managing Compliance Clients

**Goal:** Set up a real client management system so every client interaction is recorded, billable, and professional.

**Intro Video (Seedance Prompt):**
> A hand types a client name into a tablet. A timeline of interactions appears: scan done, report sent, follow-up booked. A clean professional dashboard. 15 seconds.

**What to Do:**
1. Set up Client Records on the AI Launchpad platform.
2. Mirror it with a paper client file as backup.
3. Use AI to draft a standard onboarding email and check-in template.
4. Add your first real or practice client.

**What You Will Make:** A working client management system with 1 real client file.

---

### Open Activity — The Client System

This activity will take about 75 minutes.

**Step 1 — Platform Client Setup (15 min)**

On AI Launchpad: Clients > Add New. Fill in fields. Save.

**Step 2 — Paper Backup File (15 min)**

Use a manila folder per client. Sections:
- Page 1: Client details
- Page 2: Signed proposal
- Page 3: Scan reports
- Page 4: Action list
- Page 5: Interaction log

**Step 3 — AI Drafts Standard Emails (20 min)**

Paste into Claude:

```
Please write 4 standard email templates for my NDIS compliance business.

Business: [NAME]
Tone: warm, professional, plain English

Template 1 — Welcome / Onboarding (after they sign the proposal)
Template 2 — Scan Complete (when their audit is done, attaching the report)
Template 3 — 30-Day Follow-Up (checking in after the action plan)
Template 4 — Annual Re-Scan Reminder (when 12 months has passed)

Each email should be under 200 words.
Use [BRACKETS] for fields I'll fill in.
End every email with my signature: [YOUR NAME], [BUSINESS NAME], [PHONE], [EMAIL].
```

Save the 4 templates.

**Step 4 — Set Up Recurring Reminders (15 min)**

In your phone calendar, set repeat reminders:
- 30 days after each client engagement → send Template 3
- 12 months after each client engagement → send Template 4

**Step 5 — Add First Real Client (10 min)**

If you have a real prospect, add them now. If not, add your practice provider as a dummy entry.

> **Why this matters:** Professional client management is how you turn one-off sales into recurring annual revenue. The reminders alone can double your second-year income.

---

### Billable Touchpoint A — System Setup Review (15 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_04_a` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send screenshots of the platform Client Records + photo of the paper file.
2. Support worker confirms structure is complete.

---

### Billable Touchpoint B — Email Templates Review (10 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_04_b` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send the 4 templates.
2. Support worker checks tone, accuracy, and friendliness. Approves.

---

### Billable Touchpoint C — First Client Added (15 min, async)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_04_c` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send screenshot of first client added.
2. Support worker walks through what happens next. Milestone logged: **Client System Active**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_capath_04_a` — submits Touchpoint A
- `/submit_capath_04_b` — submits Touchpoint B
- `/submit_capath_04_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "draft email for [situation]" — bot generates one
- Ask "what should I record about this client" — bot gives a checklist
- Ask "remind me to follow up [client]" — bot sets a reminder

**Check-In Question:** Is your first client showing in both the platform AND your paper backup?

**Quiz Question:**
> Why keep a paper backup of client files?
> - A) Paper is better than digital
> - B) For backup, privacy, and to look professional when meeting clients in person ✓
> - C) The platform doesn't work
> - D) Clients can't read screens

---

## Sub-Module CA-05 — Field Compliance Tools

**Goal:** Visit a real NDIS provider's site (with a local support worker), complete an on-site audit, and submit your findings — your first real paid job.

**Intro Video (Seedance Prompt):**
> A professional walks into a clean office, holding a tablet. They walk room by room, ticking items off an on-screen checklist. A support worker stands nearby with a clipboard. Confident, methodical. 15 seconds.

**What to Do:**
1. Confirm a real client booking (or practice with your support worker as a stand-in client).
2. Bring tablet, checklist, and printed action list template.
3. Book a local support worker to accompany you to your first 1–2 visits.
4. Walk through the site item by item.
5. Submit findings within 24 hours.

**What You Will Make:** Your first completed on-site audit submission to a real provider.

---

### Open Activity — The First Field Audit

This activity will take 2–3 hours including travel.

**Step 1 — Pre-Visit Checklist (30 min, day before)**

Ask Claude:

```
I am visiting an NDIS provider tomorrow for my first on-site compliance audit.

Provider type: [DAY PROGRAM / GROUP HOME / SUPPORT COORDINATION / OTHER]

Please give me:
1. A 10-item on-site visual checklist of things to look for
2. 5 questions I should ask the manager
3. 3 documents I should ask to see
4. What to bring on the day
5. How to introduce myself in the first 60 seconds
```

Print everything.

**Step 2 — The Visit (60–90 min)**

Local support worker accompanies you (especially first visit). On arrival:
- Introduce yourself confidently (use AI script).
- Walk site room by room.
- Tick checklist items.
- Take photos (with permission only).
- Ask the 5 questions.
- Thank the manager. Promise findings within 24 hours.

**Step 3 — Same-Day Report Draft (30 min)**

Within hours of returning, paste into Claude:

```
I just completed an on-site NDIS compliance audit.

Provider: [NAME]
Date: [TODAY]
What I found:
- Compliant: [LIST]
- Needs improvement: [LIST]
- Urgent issues: [LIST]

Please write a 1-page draft report with:
- Summary (3 sentences)
- Compliant items (bullet list)
- Issues by priority (HIGH / MEDIUM / LOW)
- Recommended actions
- Estimated time and cost to fix each issue

Use plain English. Warm but professional. End with an offer of follow-up support.
```

**Step 4 — Submit Within 24 Hours (15 min)**

Email the report to the client using Template 2 from Module 21.

> **Why this matters:** On-site visits are where compliance agents earn the highest hourly rate. Doing it confidently, professionally, and quickly turns one job into referrals.

---

### Billable Touchpoint A — Pre-Visit Briefing (15 min, sync voice call)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_05_a` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Day before, voice call with support worker.
2. Walk through the checklist, anticipated issues, and how to handle difficult questions.

---

### Billable Touchpoint B — Local Field Visit (60–90 min, sync in-person — Local SW)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_05_b` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Local SW meets you at the provider's site.
2. They observe and support — they don't do your job.
3. **Field-support line item** in NDIS billing.

For learners who are confident, this can be downgraded to remote standby (SW available on Telegram during visit) after the first 2 jobs.

---

### Billable Touchpoint C — Report Review Before Sending (20 min, sync voice call)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_05_c` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. After drafting, voice call with support worker.
2. They read your report on screen-share.
3. You both edit and finalise before sending.
4. Milestone logged: **First Real Field Audit Delivered**.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_capath_05_a` — submits Touchpoint A
- `/submit_capath_05_b` — submits Touchpoint B
- `/submit_capath_05_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "manager asked [question]" — bot suggests an answer
- Ask "is this finding HIGH or MEDIUM" — bot rates severity
- Ask "polite refusal to a tough request" — bot drafts one

**Check-In Question:** What was the hardest moment of your first site visit, and how did you handle it?

**Quiz Question:**
> Why submit your report within 24 hours of a site visit?
> - A) The platform makes you
> - B) Speed builds trust, clarity is sharper, and clients pay faster ✓
> - C) AI requires it
> - D) You don't need to be fast

---

## Sub-Module CA-06 — Selling the Full Stack

**Goal:** Confidently sell the full compliance package (Gap Analysis + Client Records + Reports + ongoing support) to a new client and close your first multi-tier deal.

**Intro Video (Seedance Prompt):**
> A person stands before three icons on screen: shield, document, graph. They draw a circle connecting all three. A client across the table nods and signs. 15 seconds.

**What to Do:**
1. Build a 5-page sales pitch deck with AI.
2. Practise it out loud 5 times.
3. Deliver it to a real or practice prospect.
4. Convert at least 1 prospect to Tier 2 or Tier 3 within the next 30 days.

**What You Will Make:** A polished pitch deck + 1 closed Tier 2 or Tier 3 deal.

---

### Open Activity — The Full-Stack Pitch

This activity will take about 90 minutes.

**Step 1 — AI Generates Pitch Outline (20 min)**

```
Please write me a 5-page sales pitch for my full-stack NDIS compliance
service. My audience is small NDIS providers with 5–50 staff.

The 3 tools:
1. Gap Analysis — fast AI-powered audit scans
2. Client Records — secure, organised, audit-ready
3. Reports — plain-English action plans

Pitch structure:
PAGE 1 — The problem providers face today (3 pain points)
PAGE 2 — The solution (1 sentence + the 3 tools)
PAGE 3 — How it works (Scan → Review → Fix → Maintain)
PAGE 4 — The results (3 measurable benefits)
PAGE 5 — The offer (Tiers 2 and 3 from Module 20) + clear call to action

Each page: 1 headline + 3 bullet points + 1 visual idea.

Keep it warm, professional, and free of jargon.
```

**Step 2 — Print as Slides or Cards (20 min)**

Either:
- 5 printed A5 cards (good for face-to-face)
- 5 PowerPoint slides (good for video calls)

Use Module 04 brand colours on every page.

**Step 3 — Out-Loud Practice (20 min)**

Time yourself. Aim for 5 minutes total. Record yourself once. Listen back.

**Step 4 — Live Pitch (this week)**

Book the prospect. Deliver the pitch. Don't read — talk.

End with: *"Would Tier 2 or Tier 3 work better for you?"* (This is the closing question — never ask yes/no.)

> **Why this matters:** The full-stack pitch is what turns a $300 one-off scan into a $300/month ongoing partnership. That single deal-shape change is the difference between a side hustle and a sustainable business.

---

### Billable Touchpoint A — Pitch Deck Review (20 min, async + voice note)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_06_a` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Send the 5-page pitch.
2. Support worker sends a voice note: what flows, what doesn't, what to cut.

---

### Billable Touchpoint B — Live Role-Play Pitch (30 min, sync video call)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_06_b` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. Book a 30-min video call.
2. You deliver the full pitch on screen-share.
3. Support worker plays a tough prospect. Asks 3 hard objections.
4. Feedback after.

---

### Billable Touchpoint C — Deal Close Debrief (15 min, async + voice note)


**Billing Status:** ⚠️ NOT NDIS-billable by default — Affiliate Pathway is opt-in and earns the program operator commission. Any NDIS billing must be reviewed and approved by the participant's plan manager and documented as a vocational skill outcome.  
**Trigger:** Learner submits via Telegram trigger phrase (see below)

**To log this billable event:** Type `/submit_capath_06_c` in your Telegram group chat before you send your work. The bot records the start time and end time for internal pathway tracking (NOT NDIS audit unless plan manager approved).

1. After the real pitch, send what happened.
2. Support worker debriefs. If deal closed: **Milestone — First Full-Stack Deal Closed**. If not: identify why and adjust.

---

**Trigger phrases for this module (type exactly as shown — starts billable clock):**
- `/submit_capath_06_a` — submits Touchpoint A
- `/submit_capath_06_b` — submits Touchpoint B
- `/submit_capath_06_c` — submits Touchpoint C
- Free chat with the bot is always unbillable and always available.

**Telegram Bot Help:**
- Ask "client said [objection]" — bot scripts a response
- Ask "follow up after pitch" — bot drafts a message
- Ask "convert Tier 1 to Tier 2" — bot suggests an upsell

**Check-In Question:** Did you ask the closing question — Tier 2 or Tier 3 — out loud?

**Quiz Question:**
> What is the main benefit of selling all 3 tools together?
> - A) It costs more (which is bad for the client)
> - B) It saves the client time, keeps them audit-ready, and gives you recurring monthly revenue ✓
> - C) The tools don't work alone
> - D) It impresses your support worker

---

# Cross-Cutting Tables (v3)

## Billable Event Summary — Modules 05–23

Every module produces **3 billable touchpoints**. At 2–3 modules per month (one per fortnight including activity time), the participant generates 6–9 billable events monthly, supplemented by:
- Weekly Money Tracker review (Module 10 onward — recurring)
- Optional fortnightly group workshops
- Field-support events at milestones

**Average billable load per participant per week: 2–3 events. Aligns with target.**

## Local Support Worker Activation Points

| Module | Trigger | Type |
|---|---|---|
| 09 | First sale stand-by (optional) | On-call |
| 11 | Local growth campaign (flyer drops, cafe visits) | Field |
| 16 | Community group introduction | Field |
| 22 | First on-site compliance audit | Field (required) |
| 22 | 2nd / 3rd audit | Field (recommended) |
| 23 | First Tier 2/3 client meeting (optional) | On-call |

## AI Tool Usage Map

| Module | Primary AI Tool | What For |
|---|---|---|
| 05 | ChatGPT, Claude | Platform comparison, listing copy |
| 06 | Gemini, Claude | Photo editing, captions |
| 07 | ChatGPT, Claude | Market research, pricing tiers |
| 08 | Claude | Content planning |
| 09 | Claude | Sales script, thank-you message |
| 10 | Claude, Gemini | Weekly summaries, spreadsheet build |
| 11 | ChatGPT, Claude, image AI | Growth ideas, flyer design |
| 12 | Claude | Quarterly review summary |
| 13 | Claude | Affiliate starter kit |
| 14 | Claude | Honest product reviews |
| 15 | Claude | Content calendar |
| 16 | Claude | Community approach scripts |
| 17 | Claude | Performance analysis |
| 18 | Claude | NDIS Code translation |
| 19 | Claude | Audit finding translation |
| 20 | Claude | Proposal template, pitch practice |
| 21 | Claude | Client email templates |
| 22 | Claude | Pre-visit checklist, same-day reports |
| 23 | Claude | Sales pitch deck |

## Affiliate Program Integration Points

| Module | Integration |
|---|---|
| 13 | Affiliate dashboard onboarding, first share |
| 14 | 1-week trial method, portfolio of 2–3 apps |
| 15 | 4-week content calendar across owned platforms |
| 16 | Community-based promotion with local SW support |
| 17 | Performance analysis, hero post scaling |

---

## SynthexIQ Trigger Phrase Master Reference

All billable trigger phrases. Programme these into the SynthexIQ bot command registry.

### Official Course (Module 04B + Modules 05–24)

| Module | Touchpoint A | Touchpoint B | Touchpoint C |
|---|---|---|---|
| 04B — AI Tools Tour (Bridge) | `/submit_mod04b_a` | `/submit_mod04b_b` | `/submit_mod04b_c` |
| 04C — Money & Benefits Rules (Bridge — Hard Safety Gate) | `/submit_mod04c_a` | `/submit_mod04c_b` | `/submit_mod04c_c` |
| 05 — Selling Online | `/submit_mod05_a` | `/submit_mod05_b` | `/submit_mod05_c` |
| 06 — Product Photos | `/submit_mod06_a` | `/submit_mod06_b` | `/submit_mod06_c` |
| 07 — Pricing My Stuff | `/submit_mod07_a` | `/submit_mod07_b` | `/submit_mod07_c` |
| 08 — Social Media 101 | `/submit_mod08_a` | `/submit_mod08_b` | `/submit_mod08_c` |
| 09 — My First Sale | `/submit_mod09_a` | `/submit_mod09_b` | `/submit_mod09_c` |
| 10 — Money Basics | `/submit_mod10_a` | `/submit_mod10_b` | `/submit_mod10_c` |
| 11 — Growing My Business | `/submit_mod11_a` | `/submit_mod11_b` | `/submit_mod11_c` |
| 12 — My Business Review | `/submit_mod12_a` | `/submit_mod12_b` | `/submit_mod12_c` |
| 13 — Affiliate Marketing Basics | `/submit_mod13_a` | `/submit_mod13_b` | `/submit_mod13_c` |
| 14 — Choose Your Products | `/submit_mod14_a` | `/submit_mod14_b` | `/submit_mod14_c` |
| 15 — Social Media for Affiliates | `/submit_mod15_a` | `/submit_mod15_b` | `/submit_mod15_c` |
| 16 — Community Networking | `/submit_mod16_a` | `/submit_mod16_b` | `/submit_mod16_c` |
| 17 — Track and Grow | `/submit_mod17_a` | `/submit_mod17_b` | `/submit_mod17_c` |
| 18 — Customer Care with AI | `/submit_mod18_a` | `/submit_mod18_b` | `/submit_mod18_c` |
| 19 — AI Reading Buddy | `/submit_mod19_a` | `/submit_mod19_b` | `/submit_mod19_c` |
| 20 — Your Online Home | `/submit_mod20_a` | `/submit_mod20_b` | `/submit_mod20_c` |
| 21 — Hard Conversations & Self-Advocacy | `/submit_mod21_a` | `/submit_mod21_b` | `/submit_mod21_c` |
| 22 — AI for Health & Wellbeing | `/submit_mod22_a` | `/submit_mod22_b` | `/submit_mod22_c` |
| 23 — Telling Your Story | `/submit_mod23_a` | `/submit_mod23_b` | `/submit_mod23_c` |
| 24 — Graduation: Your Next 12 Months | `/submit_mod24_a` | `/submit_mod24_b` | `/submit_mod24_c` |

### Optional Affiliate Pathway (CA-01 to CA-06 — Opt-in only)

| Sub-Module | Touchpoint A | Touchpoint B | Touchpoint C |
|---|---|---|---|
| CA-01 — NDIS Compliance | `/submit_capath_01_a` | `/submit_capath_01_b` | `/submit_capath_01_c` |
| CA-02 — AI Audit Scan | `/submit_capath_02_a` | `/submit_capath_02_b` | `/submit_capath_02_c` |
| CA-03 — Pricing & Closing | `/submit_capath_03_a` | `/submit_capath_03_b` | `/submit_capath_03_c` |
| CA-04 — Managing Clients | `/submit_capath_04_a` | `/submit_capath_04_b` | `/submit_capath_04_c` |
| CA-05 — Field Compliance Tools | `/submit_capath_05_a` | `/submit_capath_05_b` | `/submit_capath_05_c` |
| CA-06 — Selling the Full Stack | `/submit_capath_06_a` | `/submit_capath_06_b` | `/submit_capath_06_c` |

**Bot response on trigger phrase receipt:**
> "Got it! I've started the clock on your Touchpoint [A/B/C] for Module [NN]. Now send your work (screenshot, photo, or message) and your support worker will reply soon. Free chat is always open — just don't use a trigger phrase unless you're starting a touchpoint."

**NDIS line item for all official course commands:** Capacity Building — Skill Development.
**Affiliate Pathway commands:** NOT NDIS-billable by default. Subject to plan-manager review on a case-by-case basis.


---

# Implementation Notes for the Front-End Build

For the team building the AI Launchpad web client:

1. **Each module page** should render the 8 sections in this order: Goal · Intro Video · What to Do · What You Will Make · Open Activity · 3 Billable Touchpoints · Bot Help · Check-In · Quiz.

2. **Billable touchpoint UI**: each touchpoint must have a "Send to Support Worker" button that:
   - Pre-fills the trigger phrase into the Telegram compose box (one tap — learner doesn't type it)
   - Opens Telegram bot with pre-filled template message
   - Bot logs event start timestamp in SynthexIQ for NDIS billing
   - Marks event end when support worker sends reply
   - Records duration for audit trail under Capacity Building — Skill Development

3. **AI prompt blocks** should be in copy-buttons (one click → clipboard) so low-literacy users don't have to retype.

4. **Module locking**: only unlocks when all 3 billable touchpoints have been completed (not just submitted — completed by support worker reply).

5. **Local Support Worker booking** flow should appear inside Modules 11, 16, 22 as a "Book Local Visit" button.

6. **Affiliate dashboard** must surface inside the Module 13–17 pages, not as a separate site.

7. **Weekly recurring billable event** for Money Tracker should be a calendar entry that auto-creates from Module 10 onward.

8. **Group workshops** (Module 02B carry-forward + Module 12 quarterly): scheduling UI with 4-learner cap, 15-min billable per learner.

9. **Trigger phrase registry**: the SynthexIQ bot must recognise all 63 official course commands (3 for Module 04B + 60 for modules 05–24) plus 18 opt-in pathway commands (`/submit_capath_NN_[a|b|c]` for CA-01 to CA-06). The 04B commands use the form `/submit_mod04b_[a|b|c]`. Each command fires: (a) timestamp log, (b) SW push notification, (c) audit record creation.

10. **Free-text firewall**: any message that does NOT start with `/submit_` is treated as unbillable. The bot answers freely. The billing log is never touched.

---

*End of v3 Modules 05–24 (official course) + CA-01 to CA-06 (opt-in affiliate pathway). Add to LMC v2 Modules 01–04 to form the complete program.*
