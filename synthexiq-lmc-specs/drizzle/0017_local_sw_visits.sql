-- Migration: 0017_local_sw_visits
-- Purpose: Local Support Worker workforce + field visit records + travel reimbursement claims.
-- Used by Modules 11, 16, 22 (and on-request for Mod 06, 09, 24 events).
-- See LOCAL_SW_ACTIVATION_SPEC.md for the full design rationale.

CREATE TABLE local_support_workers (
  id                INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  email             VARCHAR(255)   NOT NULL,
  full_name         VARCHAR(255)   NOT NULL,
  phone             VARCHAR(20)    NOT NULL,
  service_postcodes JSON           NOT NULL COMMENT 'Array of postcodes this SW services',
  state             ENUM('NSW','VIC','QLD','WA','SA','TAS','NT','ACT') NOT NULL,
  qualification_ref VARCHAR(64)    NOT NULL,
  wwvp_check_ref    VARCHAR(64)    NOT NULL COMMENT 'Working with vulnerable people clearance',
  wwvp_check_expiry DATE           NOT NULL,
  first_aid_expiry  DATE           NOT NULL,
  max_travel_km     INT UNSIGNED   NOT NULL DEFAULT 25,
  active            BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_lsw_email (email),
  INDEX idx_lsw_state_active (state, active),
  INDEX idx_lsw_wwvp_expiry  (wwvp_check_expiry),
  INDEX idx_lsw_firstaid_expiry (first_aid_expiry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE local_sw_visits (
  id                       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  billing_event_id         INT UNSIGNED  NULL COMMENT 'FK to billing_events when applicable',
  participant_email        VARCHAR(255)  NOT NULL,
  local_sw_email           VARCHAR(255)  NOT NULL,
  visit_kind               ENUM(
                             'mod11_growth_campaign',
                             'mod16_community_intro',
                             'mod22_health_accompaniment',
                             'mod06_first_market_stall',
                             'mod09_first_sale_standby',
                             'mod24_graduation',
                             'on_request_other'
                           ) NOT NULL,
  status                   ENUM('requested','assigned','confirmed','conducted','cancelled','no_show') NOT NULL DEFAULT 'requested',
  requested_at             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  assigned_at              DATETIME      NULL,
  scheduled_for            DATETIME      NULL,
  conducted_at             DATETIME      NULL,
  duration_minutes         INT UNSIGNED  NULL,
  travel_distance_km       DECIMAL(6,2)  NULL COMMENT 'Round trip from SW base to visit location',
  participant_suburb       VARCHAR(100)  NOT NULL,
  participant_postcode     VARCHAR(4)    NOT NULL,
  visit_address_obscured   VARCHAR(255)  NULL COMMENT 'Suburb + nearest cross street; never full street address in logs',
  outcome_notes            TEXT          NULL,
  cancellation_reason      VARCHAR(255)  NULL,

  PRIMARY KEY (id),
  INDEX idx_lsv_participant (participant_email),
  INDEX idx_lsv_local_sw    (local_sw_email),
  INDEX idx_lsv_status_age  (status, requested_at),
  CONSTRAINT fk_lsv_billing FOREIGN KEY (billing_event_id) REFERENCES billing_events(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE travel_reimbursement_claims (
  id                    INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  local_sw_visit_id     INT UNSIGNED   NOT NULL,
  participant_email     VARCHAR(255)   NOT NULL,
  local_sw_email        VARCHAR(255)   NOT NULL,
  travel_distance_km    DECIMAL(6,2)   NOT NULL,
  travel_time_minutes   INT UNSIGNED   NOT NULL,
  km_rate_cents         INT UNSIGNED   NOT NULL COMMENT 'Frozen at time of claim; NDIA-set rate',
  total_claim_cents     INT UNSIGNED   NOT NULL COMMENT 'travel_distance_km * km_rate_cents (rounded)',
  ndis_line_item_code   VARCHAR(20)    NOT NULL,
  plan_allows_travel    BOOLEAN        NOT NULL COMMENT 'Pre-checked against participant plan; FALSE = do not lodge',
  status                ENUM('draft','submitted','approved','rejected','paid') NOT NULL DEFAULT 'draft',
  submitted_at          DATETIME       NULL,
  paid_at               DATETIME       NULL,

  PRIMARY KEY (id),
  INDEX idx_trc_visit  (local_sw_visit_id),
  INDEX idx_trc_status (status),
  CONSTRAINT fk_trc_visit FOREIGN KEY (local_sw_visit_id) REFERENCES local_sw_visits(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
