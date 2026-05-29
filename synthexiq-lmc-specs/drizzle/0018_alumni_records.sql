-- Migration: 0018_alumni_records
-- Purpose: Alumni record + check-in history for graduates of AI Launchpad LMC.
-- Created when Module 24 Touchpoint C is logged complete.
-- See ALUMNI_PATHWAYS_SPEC.md for the full design rationale.

CREATE TABLE alumni_records (
  id                       INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  participant_email        VARCHAR(255)   NOT NULL,
  graduated_at             DATETIME       NOT NULL,
  certificate_id           CHAR(36)       NOT NULL COMMENT 'UUID — printed on the certificate',
  pathway_chosen           ENUM('A_deeper_business','B_peer_support','C_affiliate','NONE') NOT NULL,
  pathway_chosen_at        DATETIME       NOT NULL,
  pathway_coi_disclosed_at DATETIME       NULL COMMENT 'Set when pathway = C; SW logs that they verbally disclosed COI',
  pathway_coi_disclosed_by VARCHAR(255)   NULL COMMENT 'SW email who disclosed',
  alumni_sw_email          VARCHAR(255)   NOT NULL COMMENT 'Same caseload SW continues, lighter touch',
  business_continues       BOOLEAN        NOT NULL DEFAULT TRUE,
  business_name            VARCHAR(255)   NULL,
  business_website_url     VARCHAR(255)   NULL,
  alumni_directory_opt_in  BOOLEAN        NOT NULL DEFAULT FALSE COMMENT 'Show in public alumni directory',
  twelve_month_plan_url    VARCHAR(255)   NULL,
  last_check_in_at         DATETIME       NULL,
  certificate_revoked_at   DATETIME       NULL COMMENT 'NULL = cert valid; non-NULL = cert withdrawn',
  certificate_revoked_reason VARCHAR(255) NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_alumni_email  (participant_email),
  UNIQUE KEY uq_alumni_certid (certificate_id),
  INDEX idx_alumni_pathway    (pathway_chosen),
  INDEX idx_alumni_directory  (alumni_directory_opt_in)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE alumni_check_ins (
  id                  INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  alumni_email        VARCHAR(255)   NOT NULL,
  check_in_kind       ENUM('monthly_bot','quarterly_sw','annual_review') NOT NULL,
  triggered_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at        DATETIME       NULL,
  business_status     ENUM('thriving','steady','struggling','paused','closed') NULL,
  pathway_status      ENUM('on_track','adjusting','switched','dropped') NULL,
  notes               TEXT           NULL,
  follow_up_required  BOOLEAN        NOT NULL DEFAULT FALSE,

  PRIMARY KEY (id),
  INDEX idx_aci_alumni   (alumni_email),
  INDEX idx_aci_followup (follow_up_required, triggered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
