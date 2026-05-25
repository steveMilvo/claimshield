/**
 * LMC Trigger Phrase Router
 * -------------------------
 * Drop this into the Telegram inbound pipeline BEFORE the specialist agent
 * resolver in telegramWebhook.ts and telegramPoller.ts.
 *
 * Call order in telegramWebhook.ts:
 *   1. checkForCrisis()           ← Priority 4 (safety pre-check)
 *   2. handleLmcTrigger()         ← This file (billing event creation)
 *   3. existing specialist routing ← Only reached if neither above returned true
 *
 * Architecture constraint: This file must NOT import from agentRunner.ts.
 * It is intentionally lightweight — it logs the event and notifies the SW,
 * then lets the normal specialist agent handle any follow-up conversation.
 *
 * New DB helpers needed in server/db.ts:
 *   getParticipantEmailByTelegramId(telegramId: number): Promise<string | null>
 *   getSupportWorkerTelegramIdForParticipant(participantEmail: string): Promise<number | null>
 *   getOnCallSupportWorkerTelegramId(): Promise<number | null>
 *   createBillingEvent(params): Promise<void>
 *   closeBillingEvent(params): Promise<{ moduleNum: number; touchpoint: string } | null>
 *   getParticipantModuleState(email: string, moduleNum: number): Promise<ParticipantModuleRow | null>
 *   upsertParticipantModule(email: string, moduleNum: number, fields: Partial<ParticipantModuleRow>): Promise<void>
 */

import { sendTelegramMessage } from '../telegramWebhook'; // adjust import path

// ---------------------------------------------------------------------------
// Types (align with your Drizzle inferred types)
// ---------------------------------------------------------------------------

interface TelegramMessage {
  message_id: number;
  from: { id: number; first_name?: string };
  chat: { id: number };
  text?: string;
  reply_to_message?: TelegramMessage;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const OFFICIAL_TRIGGER = /^\/submit_mod(\d{2})_(a|b|c)$/i;
const CA_TRIGGER        = /^\/submit_capath_(\d{2})_(a|b|c)$/i;

const LMC_MODULE_RANGE  = { min: 5, max: 24 };
const CA_MODULE_RANGE   = { min: 1, max: 6  };

// ---------------------------------------------------------------------------
// Crisis pre-check  (Priority 4)
// Run this FIRST, before handleLmcTrigger, before the agent.
// Returns true if a crisis was detected (message still flows to agent —
// the agent's participant-enquiry-triage skill also has a crisis runbook).
// ---------------------------------------------------------------------------

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'self harm', 'self-harm', 'hurt myself', 'no reason to live',
  'not worth living', 'want it to end',
];

export async function checkForCrisis(
  msg: TelegramMessage,
  db: unknown, // DrizzleDb — typed in your actual codebase
): Promise<void> {
  const text = (msg.text ?? '').toLowerCase();
  const kw   = CRISIS_KEYWORDS.find(k => text.includes(k));
  if (!kw) return;

  // Respond immediately — before the agent even starts
  await sendTelegramMessage(msg.chat.id,
    `💙 It sounds like you might be going through something really hard.\n\n` +
    `Please reach out for support right now:\n` +
    `• *Lifeline:* 13 11 14 (24/7)\n` +
    `• *13YARN* (Aboriginal/TSI): 13 92 76\n` +
    `• *Beyond Blue:* 1300 22 4636\n` +
    `• *Emergency:* 000\n\n` +
    `Your support worker has been notified. You are not alone. 💙`
  );

  // Log the crisis event
  const participantEmail = await getParticipantEmailByTelegramId(msg.from.id, db);
  await (db as any).insert('crisis_events').values({
    participantEmail: participantEmail ?? null,
    telegramId: msg.from.id,
    keywordMatched: kw,
    messageSnippet: (msg.text ?? '').substring(0, 200),
    detectedAt: new Date(),
  });

  // Notify on-call SW
  const onCallSwId = await getOnCallSupportWorkerTelegramId(db);
  if (onCallSwId) {
    await sendTelegramMessage(onCallSwId,
      `🚨 *URGENT — Potential crisis detected*\n\n` +
      `Participant Telegram ID: ${msg.from.id}\n` +
      `Email: ${participantEmail ?? 'unknown — not yet linked'}\n\n` +
      `Please contact them immediately.`
    );
    await (db as any).update('crisis_events')
      .set({ oncallSwNotifiedAt: new Date(), oncallSwTelegramId: onCallSwId })
      .where(/* most recent row for this telegram_id */);
  }

  // Do NOT return true — let the agent also respond with its crisis runbook.
}

// ---------------------------------------------------------------------------
// LMC trigger phrase handler  (Priority 2)
// Returns true  → message handled, do NOT route to specialist agent.
// Returns false → not a trigger phrase, continue normal routing.
// ---------------------------------------------------------------------------

export async function handleLmcTrigger(
  msg: TelegramMessage,
  db: unknown, // DrizzleDb
): Promise<boolean> {
  const text  = (msg.text ?? '').trim();
  const match = text.match(OFFICIAL_TRIGGER) ?? text.match(CA_TRIGGER);
  if (!match) return false;

  const isCA      = CA_TRIGGER.test(text);
  const moduleNum = parseInt(match[1], 10);
  const touchpoint = match[2].toLowerCase() as 'a' | 'b' | 'c';
  const range     = isCA ? CA_MODULE_RANGE : LMC_MODULE_RANGE;

  // Validate range
  if (moduleNum < range.min || moduleNum > range.max) {
    await sendTelegramMessage(msg.chat.id,
      `⚠️ That module number doesn't look right. Check the trigger phrase and try again.`
    );
    return true;
  }

  // Look up participant
  const participantEmail = await getParticipantEmailByTelegramId(msg.from.id, db);
  if (!participantEmail) {
    await sendTelegramMessage(msg.chat.id,
      `⚠️ Your Telegram account isn't linked to an AI Launchpad account yet.\n` +
      `Ask your support worker to connect it for you.`
    );
    return true;
  }

  // Check module is unlocked (skip for CA pathway — no unlock gate)
  if (!isCA) {
    const moduleState = await getParticipantModuleState(participantEmail, moduleNum, db);
    if (!moduleState?.unlocked_at) {
      await sendTelegramMessage(msg.chat.id,
        `⚠️ Module ${moduleNum} is not unlocked yet.\n` +
        `Complete all 3 touchpoints in the previous module first.`
      );
      return true;
    }
  }

  // Check no already-open event for this touchpoint
  const existingOpen = await getOpenBillingEvent(participantEmail, moduleNum, touchpoint, db);
  if (existingOpen) {
    await sendTelegramMessage(msg.chat.id,
      `✅ Touchpoint ${touchpoint.toUpperCase()} for Module ${moduleNum} is already open.\n\n` +
      `Just send your work — your support worker will review it when they're ready.`
    );
    return true;
  }

  // Create billing event
  await createBillingEvent({
    participantEmail,
    moduleNum,
    touchpoint,
    triggerPhrase: text,
    openedByTelegramId: msg.from.id,
    ndisLineItem: isCA
      ? 'Affiliate Pathway — not NDIS-billable by default'
      : 'Capacity Building — Skill Development',
  }, db);

  // Notify support worker
  const swTelegramId = await getSupportWorkerTelegramIdForParticipant(participantEmail, db);
  if (swTelegramId) {
    const label = isCA
      ? `Affiliate Pathway CA-${String(moduleNum).padStart(2, '0')} Touchpoint ${touchpoint.toUpperCase()}`
      : `Module ${moduleNum} Touchpoint ${touchpoint.toUpperCase()}`;
    await sendTelegramMessage(swTelegramId,
      `📋 *Billable event started*\n\n` +
      `Participant: ${participantEmail}\n` +
      `${label}\n\n` +
      `⏱️ Clock is running. When you reply to their work, the event closes automatically.\n\n` +
      `NDIS Line Item: ${isCA ? 'See pathway disclosure' : 'Capacity Building — Skill Development'}`
    );
  }

  // Confirm to participant
  const moduleLabel = isCA
    ? `Affiliate Pathway CA-${String(moduleNum).padStart(2, '0')}`
    : `Module ${moduleNum}`;
  await sendTelegramMessage(msg.chat.id,
    `✅ Got it! Touchpoint ${touchpoint.toUpperCase()} for ${moduleLabel} has started.\n\n` +
    `Now send your work — a screenshot, photo, or message — and your support worker will reply soon.\n\n` +
    `💬 Free chat is always open. Only use a trigger phrase when you're starting a touchpoint.`
  );

  return true; // handled — do not route to specialist agent
}

// ---------------------------------------------------------------------------
// SW reply detection hook  (Priority 2 — call from telegramWebhook.ts)
// When a support worker sends a message in a participant's chat AFTER an open
// billing event exists, close that event and check for module completion.
// ---------------------------------------------------------------------------

export async function handleSwReplyIfBillingOpen(
  swTelegramId: number,
  participantEmail: string,
  db: unknown,
): Promise<void> {
  const closed = await closeMostRecentOpenBillingEvent(swTelegramId, participantEmail, db);
  if (!closed) return;

  await checkAndAdvanceModule(participantEmail, closed.moduleNum, db);
}

// ---------------------------------------------------------------------------
// Module progression  (Priority 3)
// ---------------------------------------------------------------------------

async function checkAndAdvanceModule(
  participantEmail: string,
  moduleNum: number,
  db: unknown,
): Promise<void> {
  const state = await getParticipantModuleState(participantEmail, moduleNum, db);
  if (!state) return;

  const allClosed =
    state.touchpoint_a_closed_at &&
    state.touchpoint_b_closed_at &&
    state.touchpoint_c_closed_at;

  if (!allClosed) return;

  // Mark module complete
  await upsertParticipantModule(participantEmail, moduleNum, { completedAt: new Date() }, db);

  const nextModule = moduleNum + 1;

  if (nextModule > LMC_MODULE_RANGE.max) {
    // Graduation
    const participantTgId = await getParticipantTelegramId(participantEmail, db);
    if (participantTgId) {
      await sendTelegramMessage(participantTgId,
        `🎓 *Congratulations!* You've completed Module ${moduleNum} — the final module.\n\n` +
        `Open AI Launchpad to see your Graduation module and collect your certificate!`
      );
    }
    return;
  }

  // Unlock next module
  await upsertParticipantModule(participantEmail, nextModule, { unlockedAt: new Date() }, db);

  const participantTgId = await getParticipantTelegramId(participantEmail, db);
  if (participantTgId) {
    await sendTelegramMessage(participantTgId,
      `🎉 Module ${moduleNum} complete! *Module ${nextModule} is now unlocked.*\n\n` +
      `Open AI Launchpad to start the next module.`
    );
  }
}

// ---------------------------------------------------------------------------
// Heartbeat SLA check  (add to heartbeatScheduler.ts — runs every hour)
// Warns SWs about events open > 24 hours, nudges participants stuck > 48 hours.
// ---------------------------------------------------------------------------

export async function checkOpenBillingEventSLAs(db: unknown): Promise<void> {
  const now = new Date();

  // Find events open > 24 hours
  const staleEvents = await getOpenBillingEventsOlderThan(24 * 60 * 60, db);

  for (const event of staleEvents) {
    const swId = await getSupportWorkerTelegramIdForParticipant(event.participant_email, db);
    if (swId) {
      await sendTelegramMessage(swId,
        `⏰ *Reminder:* ${event.participant_email} submitted Touchpoint ` +
        `${event.touchpoint.toUpperCase()} for Module ${event.module_num} ` +
        `${Math.floor((now.getTime() - new Date(event.triggered_at).getTime()) / 3600000)} hours ago.\n\n` +
        `Please reply so their module progress can advance.`
      );
    }
  }

  // Find participants stuck > 48 hours (no open event, module not complete)
  // i.e., they haven't submitted their next trigger phrase for a while
  const stuckParticipants = await getParticipantsWithNoEventIn(48 * 60 * 60, db);
  for (const p of stuckParticipants) {
    const tgId = await getParticipantTelegramId(p.participant_email, db);
    if (tgId) {
      await sendTelegramMessage(tgId,
        `👋 Hi! You haven't sent a module update in a couple of days.\n\n` +
        `When you're ready, just type the trigger phrase for your next touchpoint ` +
        `(e.g. \`/submit_mod${p.current_module}_a\`) and send your work.\n\n` +
        `If you're stuck, ask me anything — free chat is always open! 💬`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// DB helper stubs — implement in server/db.ts
// (These are the signatures; the actual Drizzle query bodies go in db.ts)
// ---------------------------------------------------------------------------

async function getParticipantEmailByTelegramId(telegramId: number, db: unknown): Promise<string | null> {
  // TODO: implement in db.ts
  // SELECT email FROM users WHERE telegram_id = ? LIMIT 1
  throw new Error('Not implemented — add to server/db.ts');
}

async function getParticipantTelegramId(email: string, db: unknown): Promise<number | null> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function getSupportWorkerTelegramIdForParticipant(email: string, db: unknown): Promise<number | null> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function getOnCallSupportWorkerTelegramId(db: unknown): Promise<number | null> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function createBillingEvent(params: {
  participantEmail: string;
  moduleNum: number;
  touchpoint: 'a' | 'b' | 'c';
  triggerPhrase: string;
  openedByTelegramId: number;
  ndisLineItem: string;
}, db: unknown): Promise<void> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function getOpenBillingEvent(
  email: string, moduleNum: number, touchpoint: string, db: unknown
): Promise<{ id: number } | null> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function closeMostRecentOpenBillingEvent(
  swTelegramId: number,
  participantEmail: string,
  db: unknown,
): Promise<{ moduleNum: number; touchpoint: string } | null> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function getParticipantModuleState(
  email: string, moduleNum: number, db: unknown
): Promise<{
  unlocked_at: Date | null;
  touchpoint_a_closed_at: Date | null;
  touchpoint_b_closed_at: Date | null;
  touchpoint_c_closed_at: Date | null;
  completed_at: Date | null;
} | null> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function upsertParticipantModule(
  email: string, moduleNum: number, fields: Record<string, unknown>, db: unknown
): Promise<void> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function getOpenBillingEventsOlderThan(seconds: number, db: unknown): Promise<any[]> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function getParticipantsWithNoEventIn(seconds: number, db: unknown): Promise<any[]> {
  throw new Error('Not implemented — add to server/db.ts');
}
