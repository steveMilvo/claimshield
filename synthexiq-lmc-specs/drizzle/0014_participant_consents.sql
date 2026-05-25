-- Migration: 0014_participant_consents
-- Purpose: NDIS Australian Privacy Principles compliance.
-- A consent row per (participant, consent_type) is required before:
--   - data_processing: any data is stored for the participant
--   - telegram_messaging: any Telegram message is processed
--   - billing_audit: any billing_events row is created
--   - ndis_data_sharing: any data is shared with the participant's plan manager
-- withdrawn_at non-NULL means consent has been revoked → stop all processing for that type.

CREATE TABLE participant_consents (
  id                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  participant_email   VARCHAR(255)  NOT NULL,
  consent_type        ENUM(
                        'data_processing',
                        'telegram_messaging',
                        'billing_audit',
                        'ndis_data_sharing'
                      ) NOT NULL,
  consent_text_version VARCHAR(20)  NOT NULL DEFAULT 'v1.0' COMMENT 'Version of consent wording shown to participant',
  consented_at        DATETIME      NULL,
  withdrawn_at        DATETIME      NULL,
  consented_by        ENUM('participant','guardian','plan_nominee','support_worker') NOT NULL DEFAULT 'participant',
  sw_witness_email    VARCHAR(255)  NULL COMMENT 'SW email if they witnessed consent on behalf of participant',

  PRIMARY KEY (id),
  UNIQUE KEY uq_pc (participant_email, consent_type),
  INDEX idx_pc_participant (participant_email),
  INDEX idx_pc_active      (consent_type, withdrawn_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
