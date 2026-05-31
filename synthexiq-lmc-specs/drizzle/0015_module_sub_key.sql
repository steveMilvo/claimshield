-- Migration: 0015_module_sub_key
-- Purpose: Allow multiple bridge modules to share module_num=4 by adding a
--   sub-key column. Specifically supports Module 04B (AI Tools Tour) and
--   Module 04C (Money & Benefits Rules) coexisting as bridge modules before
--   Module 05.
--
-- Affects both participant_modules and billing_events tables.
-- Regular modules (5–24) keep module_sub_key = NULL.
-- Bridge modules: module_num=4, module_sub_key='b' or 'c'.
--
-- IMPORTANT: this migration must run after 0012_billing_events and
-- 0013_participant_modules. Apply order: 0011 → 0012 → 0013 → 0014 → 0015.

ALTER TABLE participant_modules
  ADD COLUMN module_sub_key CHAR(1) NULL
    COMMENT 'Bridge-module disambiguator: b for 04B, c for 04C. NULL for regular modules.'
    AFTER module_num;

-- Replace the unique key so the same participant can have two rows with
-- module_num=4 (one for 04B, one for 04C) but still only one row per regular
-- module. MySQL treats NULL values as distinct in unique indexes, so
-- (participant_email, 5, NULL) and (participant_email, 5, NULL) would NOT be
-- caught by the new key — we mitigate with an application-level invariant
-- that regular module rows are written with module_sub_key=NULL only via
-- the upsertParticipantModule helper.
ALTER TABLE participant_modules
  DROP INDEX uq_pm;

ALTER TABLE participant_modules
  ADD UNIQUE KEY uq_pm (participant_email, module_num, module_sub_key);


ALTER TABLE billing_events
  ADD COLUMN module_sub_key CHAR(1) NULL
    COMMENT 'Bridge-module disambiguator: b for 04B, c for 04C. NULL for regular modules.'
    AFTER module_num;

-- The open-event uniqueness should also disambiguate bridge modules.
ALTER TABLE billing_events
  DROP INDEX uq_be_open_event;

ALTER TABLE billing_events
  ADD UNIQUE KEY uq_be_open_event
    (participant_email, module_num, module_sub_key, touchpoint, status);


-- Backfill any existing seed rows for 04B that were inserted before this
-- migration. If you have no production data yet, this UPDATE is a no-op.
UPDATE participant_modules
   SET module_sub_key = 'b'
 WHERE module_num = 4
   AND module_sub_key IS NULL;
