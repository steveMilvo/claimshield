-- Migration: 0012_billing_events
-- Purpose: NDIS billing audit trail for AI Launchpad LMC trigger phrase system.
-- Every /submit_modNN_[a|b|c] command creates a row. Row closes when SW replies.
-- Both timestamps are NDIS audit evidence for Capacity Building — Skill Development claims.

CREATE TABLE billing_events (
  id            INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  participant_email VARCHAR(255)   NOT NULL,
  module_num    TINYINT UNSIGNED  NOT NULL COMMENT 'LMC module number (5–24)',
  touchpoint    ENUM('a','b','c') NOT NULL,
  trigger_phrase VARCHAR(64)      NOT NULL COMMENT 'Exact slash command that triggered this event',
  ndis_line_item VARCHAR(255)     NOT NULL DEFAULT 'Capacity Building — Skill Development',
  status        ENUM('open','closed','abandoned') NOT NULL DEFAULT 'open',
  triggered_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at     DATETIME          NULL,
  opened_by_telegram_id   BIGINT  NULL COMMENT 'Telegram user_id of the participant',
  closed_by_sw_telegram_id BIGINT NULL COMMENT 'Telegram user_id of the SW who replied',
  duration_seconds INT UNSIGNED   NULL COMMENT 'Computed on close: TIMESTAMPDIFF(SECOND, triggered_at, closed_at)',

  PRIMARY KEY (id),
  UNIQUE KEY uq_be_open_event (participant_email, module_num, touchpoint, status),
  INDEX idx_be_participant  (participant_email),
  INDEX idx_be_status_age   (status, triggered_at),
  INDEX idx_be_sw_closer    (closed_by_sw_telegram_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Companion: crisis_events (logged by the pre-check before the agent runs)
CREATE TABLE crisis_events (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  participant_email VARCHAR(255) NULL COMMENT 'NULL if Telegram ID not yet linked to an account',
  telegram_id     BIGINT        NOT NULL,
  keyword_matched VARCHAR(64)   NOT NULL,
  message_snippet VARCHAR(200)  NOT NULL COMMENT 'First 200 chars only — do not store full message for privacy',
  detected_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  oncall_sw_notified_at DATETIME NULL,
  oncall_sw_telegram_id BIGINT  NULL,
  resolved        BOOLEAN       NOT NULL DEFAULT FALSE,
  resolved_at     DATETIME      NULL,

  PRIMARY KEY (id),
  INDEX idx_ce_participant (participant_email),
  INDEX idx_ce_unresolved  (resolved, detected_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
