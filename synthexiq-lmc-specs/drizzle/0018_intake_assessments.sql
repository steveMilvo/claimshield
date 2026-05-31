-- Migration: 0018_intake_assessments
-- Purpose: Track the 7-stage SLES intake flow for every applicant.
-- See SLES_ENROLMENT_GATE_SPEC.md for the full design rationale.
-- Apply order: 0011 → 0012 → 0013 → 0014 → 0015 → 0016 → 0017 → 0018.

CREATE TABLE intake_assessments (
  id                            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  applicant_email               VARCHAR(255)  NOT NULL,
  applicant_full_name           VARCHAR(255)  NOT NULL,
  applicant_dob                 DATE          NOT NULL,
  primary_support_email         VARCHAR(255)  NULL,
  primary_support_name          VARCHAR(255)  NULL,
  primary_support_relationship  VARCHAR(50)   NULL,

  -- Stage 1: Eligibility checklist
  stage1_completed_at           DATETIME      NULL,
  age_eligible                  BOOLEAN       NULL,
  school_status_eligible        BOOLEAN       NULL,
  has_ndis_plan                 BOOLEAN       NULL,
  has_primary_support           BOOLEAN       NULL,
  within_service_area           BOOLEAN       NULL,
  has_internet_daily            BOOLEAN       NULL,
  has_or_can_telegram           BOOLEAN       NULL,
  centrelink_payment            ENUM('DSP','YA','JS','none','other','unknown') NULL,
  engaged_with_des              ENUM('yes','no','dont_know') NULL,
  disability_context            TEXT          NULL,
  business_interest             TEXT          NULL,
  preferred_times               VARCHAR(100)  NULL,
  support_notes                 TEXT          NULL,

  -- Stage 2: Funding verification
  stage2_completed_at           DATETIME      NULL,
  ndis_plan_expiry              DATE          NULL,
  ndis_plan_manager_type        ENUM('self','plan_managed','agency_managed') NULL,
  sles_funding_confirmed        BOOLEAN       NULL,
  cb_skill_dev_hours_available  SMALLINT UNSIGNED NULL,
  funding_verification_notes    TEXT          NULL,

  -- Stage 3: Consent briefing
  stage3_completed_at           DATETIME      NULL,
  consent_briefing_method       ENUM('async_read','video_call','in_person') NULL,
  all_4_consents_signed         BOOLEAN       NULL,

  -- Stage 4: Readiness conversation
  stage4_completed_at           DATETIME      NULL,
  intake_sw_email               VARCHAR(255)  NULL,
  readiness_summary             TEXT          NULL,
  hard_readiness_passed         BOOLEAN       NULL,
  energy_level                  ENUM('high','medium','low') NULL,
  communication_style           ENUM('verbal','mixed','text','easy_read') NULL,
  business_interest_clarity     ENUM('clear','exploring','none') NULL,
  support_stability             ENUM('strong','variable','fragile') NULL,
  goals_coherence               ENUM('clear','forming','unrealistic') NULL,
  trust_level                   ENUM('warm','cautious','wary') NULL,

  -- Stage 5: Trial week
  stage5_started_at             DATETIME      NULL,
  stage5_completed_at           DATETIME      NULL,
  mod04b_passed                 BOOLEAN       NULL,
  mod04c_passed                 BOOLEAN       NULL,
  trial_outcome                 ENUM('passed','extended','withdrew','stuck') NULL,
  trial_notes                   TEXT          NULL,

  -- Stage 6: Cohort match
  stage6_completed_at           DATETIME      NULL,
  matched_cohort_id             INT UNSIGNED  NULL,
  match_notes                   TEXT          NULL,

  -- Stage 7: Formal enrolment
  stage7_completed_at           DATETIME      NULL,
  service_agreement_signed_at   DATETIME      NULL,
  service_agreement_pdf_url     VARCHAR(500)  NULL,
  manager_countersigned_at      DATETIME      NULL,

  -- Overall outcome
  current_stage                 TINYINT UNSIGNED NOT NULL DEFAULT 1,
  final_outcome                 ENUM('enrolled','declined','withdrew','deferred','signposted') NULL,
  final_outcome_at              DATETIME      NULL,
  decline_reason                VARCHAR(255)  NULL,
  signpost_referred_to          VARCHAR(255)  NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_intake (applicant_email),
  INDEX idx_intake_stage    (current_stage),
  INDEX idx_intake_outcome  (final_outcome),
  CONSTRAINT fk_intake_cohort FOREIGN KEY (matched_cohort_id) REFERENCES cohorts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
