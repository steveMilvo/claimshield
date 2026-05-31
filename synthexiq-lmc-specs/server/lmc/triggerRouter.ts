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

// 04B and 04C are the two foundation bridge modules between Steve's existing
// Module 04 (LMC v2) and Module 05 (the start of v3). They use the literal
// tokens "04b" and "04c" instead of two-digit numbers, so we match them
// together with a single regex and capture the sub_key (b or c).
const BRIDGE_TRIGGER    = /^\/submit_mod04(b|c)_(a|b|c)$/i;
const OFFICIAL_TRIGGER  = /^\/submit_mod(\d{2})_(a|b|c)$/i;
const CA_TRIGGER        = /^\/submit_capath_(\d{2})_(a|b|c)$/i;

const LMC_MODULE_RANGE  = { min: 5, max: 24 };
const CA_MODULE_RANGE   = { min: 1, max: 6  };

// Both 04B and 04C are stored in participant_modules with module_num = 4
// (matching Steve's existing Module 04 numbering). They are distinguished by
// the module_sub_key column (added in migration 0015):
//   04B: module_num=4, module_sub_key='b'  — AI Tools Tour
//   04C: module_num=4, module_sub_key='c'  — Money & Benefits Rules (hard safety gate)
// Unlock chain: 04B → 04C → 05. Each bridge module must complete before the next.
const MODULE_BRIDGE_NUM = 4;
type BridgeSubKey = 'b' | 'c';

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
  const text       = (msg.text ?? '').trim();
  const bridgeM    = text.match(BRIDGE_TRIGGER);
  const officialM  = text.match(OFFICIAL_TRIGGER);
  const caM        = text.match(CA_TRIGGER);
  const match      = bridgeM ?? officialM ?? caM;
  if (!match) return false;

  const isBridge = !!bridgeM;
  const isCA     = !!caM;

  // Bridge: group 1 = sub-key (b|c), group 2 = touchpoint.
  // Official/CA: group 1 = moduleNum, group 2 = touchpoint.
  const bridgeSubKey: BridgeSubKey | null =
    isBridge ? (match[1].toLowerCase() as BridgeSubKey) : null;
  const moduleNum  = isBridge ? MODULE_BRIDGE_NUM : parseInt(match[1], 10);
  const touchpoint = (isBridge ? match[2] : match[2]).toLowerCase() as 'a' | 'b' | 'c';

  // Validate range (skip for bridge — it's a fixed module number)
  if (!isBridge) {
    const range = isCA ? CA_MODULE_RANGE : LMC_MODULE_RANGE;
    if (moduleNum < range.min || moduleNum > range.max) {
      await sendTelegramMessage(msg.chat.id,
        `⚠️ That module number doesn't look right. Check the trigger phrase and try again.`
      );
      return true;
    }
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

  // Check module is unlocked (skip for CA pathway — no unlock gate).
  // 04B is always unlocked at enrolment (the foundation bridge).
  // 04C unlocks only when 04B is complete.
  if (!isCA) {
    if (isBridge && bridgeSubKey === 'c') {
      // 04C requires 04B completion first
      const mod04bState = await getBridgeModuleState(participantEmail, 'b', db);
      if (!mod04bState?.completed_at) {
        await sendTelegramMessage(msg.chat.id,
          `⚠️ Module 04C (Money & Benefits Rules) unlocks after Module 04B is finished.\n` +
          `Complete all 3 touchpoints in Module 04B first.`
        );
        return true;
      }
    } else if (!isBridge) {
      const moduleState = await getParticipantModuleState(participantEmail, moduleNum, db);
      if (!moduleState?.unlocked_at) {
        await sendTelegramMessage(msg.chat.id,
          `⚠️ Module ${moduleNum} is not unlocked yet.\n` +
          `Complete all 3 touchpoints in the previous module first.`
        );
        return true;
      }
    }
    // isBridge && bridgeSubKey === 'b' falls through — 04B is always unlocked.
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
    moduleSubKey: bridgeSubKey ?? undefined,
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
    const bridgeLabel = bridgeSubKey === 'b'
      ? 'Module 04B (AI Tools Tour)'
      : 'Module 04C (Money & Benefits Rules — HARD SAFETY GATE)';
    const label = isCA
      ? `Affiliate Pathway CA-${String(moduleNum).padStart(2, '0')} Touchpoint ${touchpoint.toUpperCase()}`
      : isBridge
        ? `${bridgeLabel} Touchpoint ${touchpoint.toUpperCase()}`
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
    : isBridge
      ? (bridgeSubKey === 'b' ? `Module 04B (AI Tools Tour)` : `Module 04C (Money & Benefits Rules)`)
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

  await checkAndAdvanceModule(
    participantEmail,
    closed.moduleNum,
    closed.moduleSubKey ?? null,
    db,
  );
}

// ---------------------------------------------------------------------------
// Module progression  (Priority 3)
// Unlock chain:
//   04B (mod_num=4, sub_key='b') → 04C (mod_num=4, sub_key='c') → 05 → 06 → ... → 24
// ---------------------------------------------------------------------------

async function checkAndAdvanceModule(
  participantEmail: string,
  moduleNum: number,
  moduleSubKey: BridgeSubKey | null,
  db: unknown,
): Promise<void> {
  // Bridge modules use the bridge state lookup; regular modules use the standard one.
  const state = moduleSubKey
    ? await getBridgeModuleState(participantEmail, moduleSubKey, db)
    : await getParticipantModuleState(participantEmail, moduleNum, db);
  if (!state) return;

  const allClosed =
    state.touchpoint_a_closed_at &&
    state.touchpoint_b_closed_at &&
    state.touchpoint_c_closed_at;

  if (!allClosed) return;

  // Mark module complete
  if (moduleSubKey) {
    await upsertBridgeModule(participantEmail, moduleSubKey, { completedAt: new Date() }, db);
  } else {
    await upsertParticipantModule(participantEmail, moduleNum, { completedAt: new Date() }, db);
  }

  // Decide what unlocks next:
  //   04B complete → unlock 04C
  //   04C complete → unlock 05 (first regular module)
  //   regular module N complete → unlock N+1 (graduation if N == LMC_MODULE_RANGE.max)
  if (moduleSubKey === 'b') {
    await upsertBridgeModule(participantEmail, 'c', { unlockedAt: new Date() }, db);
    const participantTgId = await getParticipantTelegramId(participantEmail, db);
    if (participantTgId) {
      await sendTelegramMessage(participantTgId,
        `🎉 *Module 04B complete!* Module 04C (Money & Benefits Rules) is now unlocked.\n\n` +
        `This is a hard safety gate — Module 05 won't unlock until you finish 04C ` +
        `including the free benefits adviser conversation.`
      );
    }
    return;
  }

  // moduleSubKey === 'c' OR a regular module completed
  const nextModule = moduleSubKey === 'c' ? LMC_MODULE_RANGE.min : moduleNum + 1;

  if (!moduleSubKey && nextModule > LMC_MODULE_RANGE.max) {
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
    const completedLabel = moduleSubKey === 'c' ? 'Module 04C' : `Module ${moduleNum}`;
    await sendTelegramMessage(participantTgId,
      `🎉 ${completedLabel} complete! *Module ${nextModule} is now unlocked.*\n\n` +
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
  moduleSubKey?: BridgeSubKey;          // 'b' or 'c' for bridge modules; undefined for regulars
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
): Promise<{ moduleNum: number; moduleSubKey?: BridgeSubKey; touchpoint: string } | null> {
  throw new Error('Not implemented — add to server/db.ts');
}

type ModuleStateRow = {
  unlocked_at: Date | null;
  touchpoint_a_closed_at: Date | null;
  touchpoint_b_closed_at: Date | null;
  touchpoint_c_closed_at: Date | null;
  completed_at: Date | null;
};

async function getParticipantModuleState(
  email: string, moduleNum: number, db: unknown
): Promise<ModuleStateRow | null> {
  // Resolves regular modules (module_sub_key IS NULL).
  // SELECT ... FROM participant_modules WHERE participant_email=? AND module_num=? AND module_sub_key IS NULL
  throw new Error('Not implemented — add to server/db.ts');
}

async function getBridgeModuleState(
  email: string, subKey: BridgeSubKey, db: unknown
): Promise<ModuleStateRow | null> {
  // Resolves bridge modules 04B/04C only.
  // SELECT ... FROM participant_modules WHERE participant_email=? AND module_num=4 AND module_sub_key=?
  throw new Error('Not implemented — add to server/db.ts');
}

async function upsertParticipantModule(
  email: string, moduleNum: number, fields: Record<string, unknown>, db: unknown
): Promise<void> {
  // Upsert a regular-module row (module_sub_key IS NULL).
  throw new Error('Not implemented — add to server/db.ts');
}

async function upsertBridgeModule(
  email: string, subKey: BridgeSubKey, fields: Record<string, unknown>, db: unknown
): Promise<void> {
  // Upsert a bridge-module row (module_num=4, module_sub_key='b' or 'c').
  throw new Error('Not implemented — add to server/db.ts');
}

async function getOpenBillingEventsOlderThan(seconds: number, db: unknown): Promise<any[]> {
  throw new Error('Not implemented — add to server/db.ts');
}

async function getParticipantsWithNoEventIn(seconds: number, db: unknown): Promise<any[]> {
  throw new Error('Not implemented — add to server/db.ts');
}
