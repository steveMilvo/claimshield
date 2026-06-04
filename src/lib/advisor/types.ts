// Shared types for the ER Advisor module (Phase 0 prototype).
// See docs/er-advisor-spec.md §5.5.

import type { EmploymentJurisdiction } from "./employmentJurisdiction";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

/** Facts the triage step tries to establish before advising. */
export type TriageFacts = {
  employeeType?: "permanent" | "casual" | "fixed-term" | "contractor" | "unknown";
  award?: string | null;
  tenureMonths?: number | null;
  smallBusiness?: boolean | null; // employer has < 15 employees
  issue?:
    | "conduct"
    | "capacity"
    | "redundancy"
    | "leave"
    | "flexible-work"
    | "general"
    | "unknown";
  jurisdiction?: EmploymentJurisdiction;
};

export type SupportLevel = "supported" | "partial" | "unsupported";

/**
 * A single proposition in the advice, paired with the provision it relies on
 * and the result of the verification pass. Evolves ClaimShield's FindingSchema.
 */
export type VerifiedClaim = {
  claim: string;
  citationLabel: string | null; // e.g. "s.387 Fair Work Act 2009 (Cth)"
  supported: SupportLevel;
  sourceQuote: string | null; // the exact retrieved text that backs it
  note: string | null;
};

export type RiskFlag = {
  level: "low" | "medium" | "high";
  detail: string;
};

export type AdvisorySource = {
  citationLabel: string;
  title: string;
  url: string | null; // company-policy sources have no external URL
  version: string;
  kind: "legislation" | "company";
};

export type AdvisoryAnswer = {
  summary: string;
  claims: VerifiedClaim[];
  nextSteps: { title: string; detail: string }[];
  riskFlags: RiskFlag[];
  asAtDate: string; // KB version date
  sources: AdvisorySource[];
};

/** One turn of the advisor: either it needs more info, or it has advice. */
export type AdvisorTurn =
  | {
      mode: "clarify";
      reply: string;
      questions: string[];
      facts: TriageFacts;
    }
  | {
      mode: "advise";
      reply: string;
      facts: TriageFacts;
      answer: AdvisoryAnswer;
    };
