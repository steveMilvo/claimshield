import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Answers } from "@/lib/questions";
import {
  individualIncomeTax,
  companyTax,
  assessDiv152,
  estimateYearlyTax,
  BUDGET_2026_CHANGES,
  DTA_RATES,
} from "@/lib/taxRules";

export const maxDuration = 120;

const client = new Anthropic();

// ─── Pre-compute structured data from the rule engine ────────────────────────

function buildTaxData(answers: Answers) {
  const employmentIncome = {
    "0-45k": 22500,
    "45k-120k": 82500,
    "120k-190k": 155000,
    "190k+": 220000,
  }[answers.personalIncome] ?? 45000;

  const year1Revenue = {
    "0-50k": 25000,
    "50k-200k": 125000,
    "200k-500k": 350000,
    "500k+": 750000,
  }[answers.year1Revenue] ?? 50000;

  const year3Revenue = {
    "0-200k": 100000,
    "200k-1m": 600000,
    "1m-5m": 3000000,
    "5m+": 7500000,
  }[answers.year3Revenue] ?? 500000;

  const exitValue = {
    "500k-2m": 1250000,
    "2m-10m": 6000000,
    "10m-50m": 30000000,
    "50m+": 75000000,
    "no-idea": 5000000,
  }[answers.exitValuation] ?? 5000000;

  const structures = [
    { id: "sole-trader", name: "Sole Trader" },
    { id: "company", name: "Pty Ltd (Company)" },
    { id: "trust", name: "Discretionary Trust" },
    { id: "holdco-opco", name: "HoldCo + OpCo" },
    { id: "trust-company", name: "Trust + Pty Ltd" },
  ];

  const structureTax = structures.map((s) => {
    const y1 = estimateYearlyTax({
      structure: s.id,
      revenue: year1Revenue,
      hasPartner: answers.hasPartner === "yes",
      hasTrustBeneficiaries: answers.hasTrustBeneficiaries !== "no",
      employmentIncome,
    });
    const y3 = estimateYearlyTax({
      structure: s.id,
      revenue: year3Revenue,
      hasPartner: answers.hasPartner === "yes",
      hasTrustBeneficiaries: answers.hasTrustBeneficiaries !== "no",
      employmentIncome,
    });
    return {
      structure: s.name,
      year1TaxAUD: Math.round(y1.tax),
      year1EffectiveRate: (y1.effectiveRate * 100).toFixed(1) + "%",
      year3TaxAUD: Math.round(y3.tax),
      year3EffectiveRate: (y3.effectiveRate * 100).toFixed(1) + "%",
      year1Notes: y1.notes,
      year3Notes: y3.notes,
    };
  });

  const companyY1 = companyTax(year1Revenue * 0.6, true);
  const soleTraderY1 = individualIncomeTax(year1Revenue * 0.6 + employmentIncome);

  const holdYears = { "3-5": 4, "5-10": 7, "10+": 12, "no-exit": 15 }[answers.exitTimeframe] ?? 7;
  const div152 = assessDiv152({
    structureType: "company",
    exitValuation: answers.exitValuation,
    ownershipInterest: answers.coFounders === "solo" ? 100 : answers.coFounders === "two" ? 50 : 33,
    holdYears,
    age: answers.isOver55AtExit === "yes" ? 57 : 42,
    isRetiring: answers.isOver55AtExit !== "no",
  });

  const relevantDTAs: Record<string, typeof DTA_RATES[string]> = {};
  if (answers.internationalMarkets.includes("nz")) relevantDTAs["New Zealand"] = DTA_RATES["new-zealand"];
  if (answers.internationalMarkets.includes("us")) relevantDTAs["United States"] = DTA_RATES["us"];
  if (answers.internationalMarkets.includes("asean")) relevantDTAs["Singapore"] = DTA_RATES["singapore"];
  if (answers.internationalMarkets.includes("uk-europe")) relevantDTAs["United Kingdom"] = DTA_RATES["uk"];

  const budgetImpact = BUDGET_2026_CHANGES.map((c) => ({
    ...c,
    relevance: c.impactLevel,
  }));

  return {
    employmentIncome,
    year1Revenue,
    year3Revenue,
    exitValue,
    holdYears,
    structureTax,
    companyY1: { tax: Math.round(companyY1.tax), rate: (companyY1.rate * 100).toFixed(0) + "%" },
    soleTraderY1: {
      tax: Math.round(soleTraderY1.total),
      effectiveRate: (soleTraderY1.effectiveRate * 100).toFixed(1) + "%",
      marginalRate: (soleTraderY1.marginalRate * 100).toFixed(0) + "%",
    },
    div152,
    relevantDTAs,
    budgetImpact,
  };
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(answers: Answers, taxData: ReturnType<typeof buildTaxData>): string {
  return `You are the Founder Tax Blueprint report engine for MilvoTech Pty Ltd, a SynthexIQ Ecosystem product. Your job is to generate a comprehensive, personalised tax structure and exit planning report for an Australian founder.

IMPORTANT RULES:
1. You are providing GENERAL INFORMATION ONLY — never personal tax advice. Frame everything as scenarios for professional review.
2. All numbers in the report come from the pre-computed tax rule engine data provided below — use them directly; do not recalculate or make up figures.
3. Never "recommend" a structure — present scenarios. Use phrases like "may be worth considering", "the report models", "your accountant should assess".
4. Always flag that international structures require specialist advice with genuine commercial substance.
5. Always mention the 2026-27 Budget changes where relevant.
6. Be specific, technical, and detailed — the audience is a founder who will use this with their accountant.

FOUNDER'S INPUTS:
${JSON.stringify(answers, null, 2)}

PRE-COMPUTED TAX RULE ENGINE DATA:
${JSON.stringify(taxData, null, 2)}

Generate a JSON report with this exact structure. All string fields should be detailed, professional, and specific to this founder's circumstances. Do NOT include markdown in the JSON string values — plain text only.

{
  "situationSummary": "3-4 paragraph plain-English summary of the founder's situation, key tax considerations, and why the structure decision matters now. Reference their specific inputs.",

  "recommendedStructures": [
    {
      "name": "structure name",
      "reason": "2-3 sentence specific reason why this structure is worth modelling for this founder's circumstances",
      "priority": "primary|secondary|consider|avoid"
    }
  ],

  "structureMatrix": [
    {
      "structure": "structure name",
      "taxEfficiency": 1-5,
      "assetProtection": 1-5,
      "capitalRaising": 1-5,
      "complianceCost": 1-5,
      "exitFlexibility": 1-5,
      "relevance": "recommended|viable|possible|not-recommended",
      "notes": "2-3 sentence explanation of why this structure is or isn't relevant for this founder"
    }
  ],

  "exitAnalysis": {
    "primaryExitType": "name of their primary exit path",
    "preConcessionsTax": "estimated tax before Division 152 — use the pre-computed exitValue and structure",
    "div152Eligible": "eligible|potentially-eligible|not-eligible with explanation",
    "estimatedAfterTaxProceeds": "range in AUD with explanation",
    "postBudget2027Impact": "specific impact of the indexation and 30% minimum rate on this founder's exit",
    "keyRisks": ["specific risk 1", "specific risk 2", "specific risk 3"],
    "narrative": "3-4 paragraph detailed exit analysis for the founder's chosen exit type(s), covering CGT implications, Division 152 eligibility, and how different structures affect the exit"
  },

  "irreversibilityMap": [
    {
      "decision": "specific decision",
      "reversibility": "green|amber|red",
      "detail": "why it is or isn't reversible, and the cost if it needs to change",
      "timing": "when this decision must be made"
    }
  ],

  "budgetImpact": [
    {
      "change": "name of the budget change",
      "impactOnYou": "specific impact on this founder given their inputs",
      "level": "high|medium|low"
    }
  ],

  "actionChecklist": {
    "beforeRegistration": ["specific action 1", "specific action 2"],
    "within30Days": ["specific action 1"],
    "within90Days": ["specific action 1"],
    "canWait": ["specific action 1"]
  },

  "accountantBrief": "A one-page brief for the registered tax agent. Structured as: (1) Client overview - 2 sentences; (2) Key inputs - bullet list of the most important facts; (3) Structures to model - which ones and why; (4) Questions for the client - specific things the accountant should explore; (5) Areas of uncertainty - where the general analysis may not apply. Write this as a professional document.",

  "keyRisks": ["specific risk relevant to this founder's circumstances"],

  "internationalAnalysis": "Only if relevant (founder has international markets or open to international holding). 2-3 paragraphs covering the most relevant offshore structure options, CFC analysis summary, substance requirements, and timing considerations. Otherwise return null."
}

The structureMatrix should include ALL of: Sole Trader, Partnership (if co-founders), Pty Ltd, Discretionary Trust, Unit Trust (if relevant), HoldCo/OpCo, Trust + HoldCo + OpCo, and any relevant international structures.

The irreversibilityMap should have at least 6-8 items covering: IP assignment, entity type, trust setup, HoldCo establishment, Singapore/offshore timing, equity grants, ABN registration, and any other relevant decisions.

Return ONLY the JSON object — no markdown, no explanation, no surrounding text.`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers = body.answers as Answers;

    if (!answers) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const taxData = buildTaxData(answers);
    const prompt = buildPrompt(answers, taxData);

    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    let report;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      report = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      return NextResponse.json({ error: "Failed to parse report from AI. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ report });
  } catch (err) {
    console.error("generate-report error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
