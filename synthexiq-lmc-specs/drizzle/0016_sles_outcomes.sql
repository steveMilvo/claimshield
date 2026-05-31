-- Migration: 0016_sles_outcomes
-- Purpose: SLES outcomes capture + annual report tables.
-- These tables hold the audit-defence evidence for AI Launchpad SLES funding.
-- See SLES_OUTCOMES_DASHBOARD_SPEC.md for the full design rationale.
--
-- Apply order: 0011 → 0012 → 0013 → 0014 → 0015 → 0016.

CREATE TABLE sles_monthly_snapshots (
  id                              INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  participant_email               VARCHAR(255)   NOT NULL,
  snapshot_month                  DATE           NOT NULL COMMENT 'First day of the month being snapshotted (YYYY-MM-01)',
  captured_at                     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  program_year                    TINYINT UNSIGNED NOT NULL COMMENT '1 or 2 for SLES Year 1 / Year 2',

  -- Dimension 1: Business income earned
  income_earned_cents             INT UNSIGNED   NOT NULL DEFAULT 0,
  income_earned_cumulative_cents  INT UNSIGNED   NOT NULL DEFAULT 0,

  -- Dimension 2: Work-equivalent activity hours
  activity_hours_billable         DECIMAL(5,2)   NOT NULL DEFAULT 0 COMMENT 'Sum of billing_events.duration_seconds / 3600 this month',
  activity_hours_structured       DECIMAL(5,2)   NOT NULL DEFAULT 0 COMMENT 'Cohort time + self-paced module activity',
  activity_hours_customer_facing  DECIMAL(5,2)   NOT NULL DEFAULT 0 COMMENT 'Markets, customer interactions, community time',
  activity_hours_total            DECIMAL(6,2)   GENERATED ALWAYS AS
                                    (activity_hours_billable + activity_hours_structured + activity_hours_customer_facing) STORED,

  -- Dimension 3: Customers
  customer_count_new              SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  customer_count_repeat           SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  customer_count_lifetime         SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  -- Dimension 4: Independent task completion ratio (0.000–1.000)
  independence_ratio              DECIMAL(4,3)   NOT NULL DEFAULT 0 COMMENT '% of this month touchpoints with APPROVE-only SW response',

  -- Dimension 5: Communication interactions
  comms_customer_count            SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  comms_community_count           SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  comms_supplier_count            SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  -- Dimension 6: Money management
  money_tracker_accuracy_pct      TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '% of tracker entries validated against bank statement',
  bucket_adherence_pct            TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '% of monthly income split per the 3-bucket rule (Module 27)',

  -- Dimension 7: Community connections
  community_new_connections       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  community_active_connections    TINYINT UNSIGNED NOT NULL DEFAULT 0,

  -- Dimension 8: Skill progression
  modules_completed_this_month    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  modules_completed_cumulative    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  quiz_pass_rate_pct              TINYINT UNSIGNED NOT NULL DEFAULT 0,
  safety_gates_passed             TINYINT UNSIGNED NOT NULL DEFAULT 0,

  -- Dimension 9 (Year 2 only): Leadership / mentor
  mentor_checkins_this_month      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  mentor_total_minutes            SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  -- Narrative (optional, additive)
  sw_narrative_note               TEXT           NULL,
  participant_self_reflection     TEXT           NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_sms (participant_email, snapshot_month),
  INDEX idx_sms_month (snapshot_month),
  INDEX idx_sms_year  (program_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE sles_annual_reports (
  id                    INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  participant_email     VARCHAR(255)   NOT NULL,
  program_year          TINYINT UNSIGNED NOT NULL COMMENT '1 or 2',
  report_period_start   DATE           NOT NULL,
  report_period_end     DATE           NOT NULL,
  generated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  generated_by          VARCHAR(255)   NOT NULL COMMENT 'Email of SW or manager who triggered generation',

  -- Headline outcome metrics
  total_income_cents              INT UNSIGNED  NOT NULL,
  total_activity_hours            DECIMAL(7,2)  NOT NULL,
  total_customers_served          SMALLINT UNSIGNED NOT NULL,
  final_independence_ratio        DECIMAL(4,3)  NOT NULL,
  modules_completed               TINYINT UNSIGNED NOT NULL,
  safety_gates_passed             TINYINT UNSIGNED NOT NULL,

  -- Narrative
  goals_set_at_intake             TEXT          NOT NULL,
  goal_progress_summary           TEXT          NOT NULL,
  participant_voice_summary       TEXT          NULL,
  sw_observation                  TEXT          NOT NULL,

  -- Sign-offs
  participant_signed_at           DATETIME      NULL,
  participant_signed_method       ENUM('in_person','video','voice_recording','typed') NULL,
  guardian_signed_at              DATETIME      NULL,
  sw_signed_at                    DATETIME      NULL,
  manager_signed_at               DATETIME      NULL,

  -- Outputs
  pdf_url                         VARCHAR(500)  NULL,
  ndia_submitted_at               DATETIME      NULL,
  ndia_acknowledged_at            DATETIME      NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_sar (participant_email, program_year),
  INDEX idx_sar_period (report_period_start, report_period_end),
  INDEX idx_sar_submitted (ndia_submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE sles_goals (
  id                    INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  participant_email     VARCHAR(255)   NOT NULL,
  set_at_intake         BOOLEAN        NOT NULL DEFAULT FALSE,
  goal_category         ENUM(
                          'income',
                          'customers',
                          'independence',
                          'community',
                          'skills',
                          'health_wellbeing',
                          'leadership',
                          'transition'
                        ) NOT NULL,
  goal_text             VARCHAR(500)   NOT NULL,
  target_value          VARCHAR(100)   NULL,
  target_date           DATE           NULL,
  status                ENUM('active','achieved','adjusted','dropped') NOT NULL DEFAULT 'active',
  achieved_at           DATETIME       NULL,
  adjusted_reason       TEXT           NULL,
  created_at            DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_sg_participant (participant_email),
  INDEX idx_sg_status      (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
