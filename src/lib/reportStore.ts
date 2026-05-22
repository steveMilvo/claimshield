"use client";

import { Answers } from "./questions";

export interface StoredReport {
  id: string;
  generatedAt: string;
  answers: Answers;
  report: GeneratedReport;
}

export interface GeneratedReport {
  situationSummary: string;
  recommendedStructures: RecommendedStructure[];
  structureMatrix: StructureMatrixRow[];
  exitAnalysis: ExitAnalysis;
  irreversibilityMap: IrreversibilityItem[];
  budgetImpact: BudgetImpactItem[];
  actionChecklist: ActionChecklist;
  accountantBrief: string;
  keyRisks: string[];
  internationalAnalysis?: string;
}

export interface RecommendedStructure {
  name: string;
  reason: string;
  priority: "primary" | "secondary" | "consider" | "avoid";
}

export interface StructureMatrixRow {
  structure: string;
  taxEfficiency: 1 | 2 | 3 | 4 | 5;
  assetProtection: 1 | 2 | 3 | 4 | 5;
  capitalRaising: 1 | 2 | 3 | 4 | 5;
  complianceCost: 1 | 2 | 3 | 4 | 5;
  exitFlexibility: 1 | 2 | 3 | 4 | 5;
  relevance: "recommended" | "viable" | "possible" | "not-recommended";
  notes: string;
}

export interface ExitAnalysis {
  primaryExitType: string;
  preConcessionsTax: string;
  div152Eligible: string;
  estimatedAfterTaxProceeds: string;
  postBudget2027Impact: string;
  keyRisks: string[];
  narrative: string;
}

export interface IrreversibilityItem {
  decision: string;
  reversibility: "green" | "amber" | "red";
  detail: string;
  timing: string;
}

export interface BudgetImpactItem {
  change: string;
  impactOnYou: string;
  level: "high" | "medium" | "low";
}

export interface ActionChecklist {
  beforeRegistration: string[];
  within30Days: string[];
  within90Days: string[];
  canWait: string[];
}

const STORAGE_KEY = "ftb_reports";

export function saveReport(answers: Answers, report: GeneratedReport): string {
  const id = crypto.randomUUID();
  const stored: StoredReport = {
    id,
    generatedAt: new Date().toISOString(),
    answers,
    report,
  };

  const existing = getAllReports();
  existing[id] = stored;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return id;
}

export function getReport(id: string): StoredReport | null {
  const all = getAllReports();
  return all[id] ?? null;
}

function getAllReports(): Record<string, StoredReport> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
