-- Migration: 0013_participant_modules
-- Purpose: Track per-learner module state for AI Launchpad LMC.
-- A module row is created when the module unlocks.
-- touchpoint_*_closed_at is stamped when billing_events for that touchpoint close.
-- completed_at is stamped when all three touchpoints have been closed.
-- The web client reads this table to lock/unlock module pages.

CREATE TABLE participant_modules (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  participant_email VARCHAR(255) NOT NULL,
  module_num      TINYINT UNSIGNED NOT NULL COMMENT 'LMC module number (5–24)',
  unlocked_at     DATETIME      NULL COMMENT 'NULL = still locked',
  touchpoint_a_closed_at DATETIME NULL,
  touchpoint_b_closed_at DATETIME NULL,
  touchpoint_c_closed_at DATETIME NULL,
  completed_at    DATETIME      NULL COMMENT 'Set when all 3 touchpoints closed',

  PRIMARY KEY (id),
  UNIQUE KEY uq_pm (participant_email, module_num),
  INDEX idx_pm_participant   (participant_email),
  INDEX idx_pm_incomplete    (completed_at, participant_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed bridge modules as the entry points for all participants.
-- Bridge chain (added by migration 0015 which introduces module_sub_key):
--   04B (module_num=4, sub_key='b') unlocks at enrolment
--   04C (module_num=4, sub_key='c') unlocks when 04B is completed
--   05 (module_num=5) unlocks when 04C is completed
-- All later progression flows through checkAndAdvanceModule in triggerRouter.ts.
--
-- Run this AFTER migrations 0013 + 0015, with actual participant emails.
--
-- INSERT INTO participant_modules (participant_email, module_num, module_sub_key, unlocked_at)
-- SELECT email, 4, 'b', NOW() FROM users WHERE role = 'participant'
-- ON DUPLICATE KEY UPDATE unlocked_at = COALESCE(unlocked_at, NOW());
--
-- Note: 04C is NOT seeded at enrolment — it's created by the trigger router
-- only when 04B is complete (upsertBridgeModule with unlockedAt).
