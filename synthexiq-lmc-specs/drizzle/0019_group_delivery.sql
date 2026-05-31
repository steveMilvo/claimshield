-- Migration: 0019_group_delivery
-- Purpose: Enable cohort workshop billing at the NDIS Group Skill Development
-- line item. Adds delivery_mode + workshop_id to billing_events and creates
-- cohorts / cohort_members / workshops tables.
-- See GROUP_WORKSHOP_REFACTOR_SPEC.md for the full design rationale.
--
-- Apply order: 0011 → 0012 → 0013 → 0014 → 0015 → 0016 → 0017 → 0018 → 0019.

ALTER TABLE billing_events
  ADD COLUMN delivery_mode ENUM(
    'async_telegram',
    'sync_voice_call',
    'sync_video_call',
    'in_person_field_visit',
    'group_workshop',
    'group_co_working'
  ) NOT NULL DEFAULT 'async_telegram'
  AFTER ndis_line_item;

ALTER TABLE billing_events
  ADD COLUMN workshop_id INT UNSIGNED NULL
  AFTER delivery_mode
  COMMENT 'FK to workshops table for group sessions; NULL for 1:1 events';


CREATE TABLE cohorts (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cohort_name     VARCHAR(100) NOT NULL,
  intake_month    DATE NOT NULL,
  program_year    TINYINT UNSIGNED NOT NULL,
  sw_email        VARCHAR(255) NOT NULL,
  current_module  TINYINT UNSIGNED NOT NULL DEFAULT 5,
  status          ENUM('forming','active','completed','disbanded') NOT NULL DEFAULT 'forming',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_cohort_name (cohort_name),
  INDEX idx_cohort_sw (sw_email),
  INDEX idx_cohort_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE cohort_members (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cohort_id         INT UNSIGNED NOT NULL,
  participant_email VARCHAR(255) NOT NULL,
  joined_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  left_at           DATETIME NULL,
  left_reason       ENUM('completed','transferred','withdrew','exited') NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_cm (cohort_id, participant_email),
  INDEX idx_cm_participant (participant_email),
  CONSTRAINT fk_cm_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE workshops (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  module_num        TINYINT UNSIGNED NOT NULL,
  module_sub_key    CHAR(1) NULL,
  sw_email          VARCHAR(255) NOT NULL,
  cohort_id         INT UNSIGNED NOT NULL,
  scheduled_for     DATETIME NOT NULL,
  conducted_at      DATETIME NULL,
  duration_minutes  SMALLINT UNSIGNED NULL,
  delivery_mode     ENUM('group_workshop','group_co_working') NOT NULL,
  facilitator_notes TEXT NULL,
  status            ENUM('scheduled','conducted','cancelled') NOT NULL DEFAULT 'scheduled',

  PRIMARY KEY (id),
  INDEX idx_wk_sw       (sw_email),
  INDEX idx_wk_cohort   (cohort_id),
  INDEX idx_wk_status   (status, scheduled_for),
  CONSTRAINT fk_wk_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Link billing_events.workshop_id to the workshops table (after workshops exists)
ALTER TABLE billing_events
  ADD CONSTRAINT fk_be_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE SET NULL;
