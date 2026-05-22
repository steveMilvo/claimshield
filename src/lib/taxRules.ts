// Codified Australian tax rule engine — 2026-27 & 2027-28 regimes
// All figures in AUD. Source: ATO + 2026-27 Federal Budget.

export type TaxYear = "2026-27" | "2027-28";

// ─── Individual marginal rates ────────────────────────────────────────────────

interface Bracket {
  from: number;
  to: number;
  rate: number;
  base: number;
}

const BRACKETS_2026_27: Bracket[] = [
  { from: 0, to: 18200, rate: 0, base: 0 },
  { from: 18201, to: 45000, rate: 0.16, base: 0 },
  { from: 45001, to: 135000, rate: 0.28, base: 4288 },
  { from: 135001, to: 190000, rate: 0.35, base: 29488 },
  { from: 190001, to: Infinity, rate: 0.45, base: 48738 },
];

const BRACKETS_2027_28: Bracket[] = [
  { from: 0, to: 18200, rate: 0, base: 0 },
  { from: 18201, to: 45000, rate: 0.16, base: 0 },
  { from: 45001, to: 135000, rate: 0.28, base: 4288 },
  { from: 135001, to: 190000, rate: 0.35, base: 29488 },
  { from: 190001, to: Infinity, rate: 0.45, base: 48738 },
];

const MEDICARE_LEVY = 0.02;

export function individualIncomeTax(
  income: number,
  year: TaxYear = "2026-27",
  includesMedicare = true
): { tax: number; medicare: number; total: number; effectiveRate: number; marginalRate: number } {
  const brackets = year === "2026-27" ? BRACKETS_2026_27 : BRACKETS_2027_28;
  let tax = 0;
  let marginalRate = 0;

  for (const b of brackets) {
    if (income > b.from) {
      const taxable = Math.min(income, b.to) - b.from;
      tax += taxable * b.rate;
      marginalRate = b.rate;
    }
  }

  const medicare = includesMedicare ? income * MEDICARE_LEVY : 0;
  const total = tax + medicare;

  return {
    tax,
    medicare,
    total,
    effectiveRate: income > 0 ? total / income : 0,
    marginalRate: marginalRate + (includesMedicare ? MEDICARE_LEVY : 0),
  };
}

// ─── Company tax ─────────────────────────────────────────────────────────────

export function companyTax(
  profit: number,
  isBaseRateEntity: boolean = true
): { tax: number; rate: number } {
  const rate = isBaseRateEntity ? 0.25 : 0.30;
  return { tax: profit * rate, rate };
}

// ─── CGT calculations ─────────────────────────────────────────────────────────

export interface CGTResult {
  grossGain: number;
  adjustedGain: number;
  taxPayable: number;
  effectiveRate: number;
  discountApplied: boolean;
  indexationApplied: boolean;
  minimumRateApplied: boolean;
  notes: string[];
}

const ANNUAL_CPI_ESTIMATE = 0.03;

export function calculateCGT(opts: {
  costBase: number;
  salePrice: number;
  holdYears: number;
  taxpayerType: "individual" | "company" | "trust";
  incomeForYear: number;
  year: TaxYear;
}): CGTResult {
  const { costBase, salePrice, holdYears, taxpayerType, incomeForYear, year } = opts;
  const grossGain = Math.max(0, salePrice - costBase);
  const notes: string[] = [];

  if (taxpayerType === "company") {
    const tax = grossGain * 0.25;
    return {
      grossGain,
      adjustedGain: grossGain,
      taxPayable: tax,
      effectiveRate: grossGain > 0 ? tax / grossGain : 0,
      discountApplied: false,
      indexationApplied: false,
      minimumRateApplied: false,
      notes: ["Companies do not receive the CGT discount or indexation — full gain taxed at 25%."],
    };
  }

  if (year === "2026-27") {
    // 50% CGT discount for assets held 12+ months (pre-2027)
    if (holdYears >= 1 && taxpayerType === "individual") {
      const discountedGain = grossGain * 0.5;
      const totalIncome = incomeForYear + discountedGain;
      const taxOnTotal = individualIncomeTax(totalIncome, year).total;
      const taxWithout = individualIncomeTax(incomeForYear, year).total;
      const taxPayable = taxOnTotal - taxWithout;
      notes.push("50% CGT discount applied (assets held 12+ months, pre-1 July 2027 regime).");
      return {
        grossGain,
        adjustedGain: discountedGain,
        taxPayable,
        effectiveRate: grossGain > 0 ? taxPayable / grossGain : 0,
        discountApplied: true,
        indexationApplied: false,
        minimumRateApplied: false,
        notes,
      };
    }
    if (taxpayerType === "trust") {
      const discountedGain = holdYears >= 1 ? grossGain * 0.5 : grossGain;
      notes.push(holdYears >= 1 ? "50% CGT discount applied via trust distribution." : "No discount — held <12 months.");
      const taxPayable = discountedGain * 0.30;
      return { grossGain, adjustedGain: discountedGain, taxPayable, effectiveRate: grossGain > 0 ? taxPayable / grossGain : 0, discountApplied: holdYears >= 1, indexationApplied: false, minimumRateApplied: false, notes };
    }
  }

  // Post-1 July 2027: indexation replaces 50% discount, 30% floor
  const indexFactor = Math.pow(1 + ANNUAL_CPI_ESTIMATE, holdYears);
  const indexedCostBase = costBase * indexFactor;
  const indexedGain = Math.max(0, salePrice - indexedCostBase);
  notes.push(`Indexation applied: cost base ${costBase.toFixed(0)} → ${indexedCostBase.toFixed(0)} (${(holdYears).toFixed(1)} yrs × ${(ANNUAL_CPI_ESTIMATE * 100).toFixed(0)}% CPI estimate).`);
  notes.push("30% minimum CGT rate applies from 1 July 2027.");

  if (taxpayerType === "individual") {
    const totalIncome = incomeForYear + indexedGain;
    const taxOnTotal = individualIncomeTax(totalIncome, "2027-28").total;
    const taxWithout = individualIncomeTax(incomeForYear, "2027-28").total;
    const marginalTax = taxOnTotal - taxWithout;
    const minimumTax = indexedGain * 0.30;
    const taxPayable = Math.max(marginalTax, minimumTax);
    const minimumRateApplied = taxPayable === minimumTax;
    if (minimumRateApplied) notes.push("30% minimum rate applied (higher than marginal rate on indexed gain).");
    return { grossGain, adjustedGain: indexedGain, taxPayable, effectiveRate: grossGain > 0 ? taxPayable / grossGain : 0, discountApplied: false, indexationApplied: true, minimumRateApplied, notes };
  }

  // Trust post-2027
  const taxPayable = Math.max(indexedGain * 0.30, indexedGain * 0.30);
  notes.push("Trust capital gain distributions: 30% minimum rate applies (from 1 July 2027).");
  return { grossGain, adjustedGain: indexedGain, taxPayable, effectiveRate: grossGain > 0 ? taxPayable / grossGain : 0, discountApplied: false, indexationApplied: true, minimumRateApplied: true, notes };
}

// ─── Division 152 small business CGT concessions ──────────────────────────────

export interface Div152Assessment {
  netAssetValueEligible: boolean;
  activeAssetTestLikely: boolean;
  stakeholderTestLikely: boolean;
  overallEligibility: "eligible" | "potentially-eligible" | "not-eligible";
  availableConcessions: string[];
  notes: string[];
}

export function assessDiv152(opts: {
  structureType: string;
  exitValuation: string;
  ownershipInterest: number; // percentage 0-100
  holdYears: number;
  age: number;
  isRetiring: boolean;
}): Div152Assessment {
  const { structureType, exitValuation, ownershipInterest, holdYears, age, isRetiring } = opts;
  const notes: string[] = [];
  const availableConcessions: string[] = [];

  // Net asset value test — aggregated net assets must not exceed $6M
  const exceeds6M = ["10m-50m", "50m+"].includes(exitValuation);
  const netAssetValueEligible = !exceeds6M;
  if (!netAssetValueEligible) {
    notes.push("Exit valuation suggests net assets may exceed $6M threshold — Division 152 eligibility uncertain.");
  } else {
    notes.push("Net asset value test ($6M): likely satisfied based on stated valuation range.");
  }

  // Active asset test
  const activeAssetTestLikely = holdYears >= 0.5;
  if (!activeAssetTestLikely) notes.push("Active asset test: business held <6 months — may not satisfy.");

  // Stakeholder test
  const stakeholderTestLikely =
    structureType === "sole-trader" ||
    (structureType.includes("company") && ownershipInterest >= 20) ||
    structureType.includes("trust");
  if (!stakeholderTestLikely) notes.push("Stakeholder test: ownership below 20% threshold for companies.");

  const overallEligibility: Div152Assessment["overallEligibility"] =
    netAssetValueEligible && activeAssetTestLikely && stakeholderTestLikely
      ? "eligible"
      : netAssetValueEligible && activeAssetTestLikely
      ? "potentially-eligible"
      : "not-eligible";

  // Which concessions apply?
  if (overallEligibility !== "not-eligible") {
    if (holdYears >= 15 && age >= 55 && isRetiring) {
      availableConcessions.push("15-year exemption (Subdivision 152-B): complete CGT exemption — most generous.");
    }
    availableConcessions.push("50% active asset reduction (Subdivision 152-C): reduces gain by 50% after indexation.");
    availableConcessions.push("Retirement exemption (Subdivision 152-D): up to $500,000 lifetime CGT exemption.");
    availableConcessions.push("Small business rollover (Subdivision 152-E): defer CGT for up to 2 years.");
  }

  return { netAssetValueEligible, activeAssetTestLikely, stakeholderTestLikely, overallEligibility, availableConcessions, notes };
}

// ─── Structure scoring ────────────────────────────────────────────────────────

export interface StructureScore {
  id: string;
  name: string;
  taxEfficiency: number; // 1-5
  assetProtection: number; // 1-5
  capitalRaising: number; // 1-5
  complianceCost: number; // 1-5 (5 = lowest cost)
  exitFlexibility: number; // 1-5
  setupCost: string;
  annualCompliance: string;
  bestFor: string;
  limitations: string[];
  recommended: boolean;
  recommendationNotes: string;
}

export function estimateYearlyTax(opts: {
  structure: string;
  revenue: number;
  hasPartner: boolean;
  hasTrustBeneficiaries: boolean;
  employmentIncome: number;
}): { tax: number; effectiveRate: number; notes: string } {
  const { structure, revenue, hasPartner, hasTrustBeneficiaries, employmentIncome } = opts;
  const profit = revenue * 0.6; // rough 40% operating cost assumption

  if (structure === "sole-trader") {
    const totalIncome = profit + employmentIncome;
    const { total } = individualIncomeTax(totalIncome);
    const taxOnEmpOnly = individualIncomeTax(employmentIncome).total;
    const businessTax = total - taxOnEmpOnly;
    return { tax: businessTax, effectiveRate: profit > 0 ? businessTax / profit : 0, notes: "Sole trader — profit taxed at personal marginal rate." };
  }

  if (structure === "company") {
    const { tax } = companyTax(profit, true);
    return { tax, effectiveRate: profit > 0 ? tax / profit : 0, notes: "Pty Ltd — profit taxed at 25% (base rate entity)." };
  }

  if (structure === "trust") {
    if (hasTrustBeneficiaries && hasPartner) {
      const splitIncome = profit / 2;
      const tax1 = individualIncomeTax(splitIncome + employmentIncome / 2).total - individualIncomeTax(employmentIncome / 2).total;
      const tax2 = individualIncomeTax(splitIncome).total;
      return { tax: tax1 + tax2, effectiveRate: profit > 0 ? (tax1 + tax2) / profit : 0, notes: "Trust — income split across two beneficiaries." };
    }
    const { total } = individualIncomeTax(profit + employmentIncome);
    const taxOnEmpOnly = individualIncomeTax(employmentIncome).total;
    return { tax: total - taxOnEmpOnly, effectiveRate: profit > 0 ? (total - taxOnEmpOnly) / profit : 0, notes: "Trust — no beneficiaries to split with; taxed at trustee rate." };
  }

  if (structure === "holdco-opco") {
    const { tax } = companyTax(profit, true);
    return { tax, effectiveRate: profit > 0 ? tax / profit : 0, notes: "HoldCo/OpCo — profits retained in OpCo at 25%. Inter-company dividends NANE." };
  }

  const { tax } = companyTax(profit, true);
  return { tax, effectiveRate: profit > 0 ? tax / profit : 0, notes: "Company rate (25%) applied as default." };
}

// ─── DTA withholding rates ────────────────────────────────────────────────────

export const DTA_RATES: Record<string, { dividends: number; dividendsQualified: number; interest: number; royalties: number }> = {
  singapore: { dividends: 0.15, dividendsQualified: 0.15, interest: 0.10, royalties: 0.10 },
  us: { dividends: 0.15, dividendsQualified: 0.05, interest: 0.10, royalties: 0.05 },
  uk: { dividends: 0.15, dividendsQualified: 0.05, interest: 0.10, royalties: 0.05 },
  "hong-kong": { dividends: 0.15, dividendsQualified: 0.05, interest: 0.10, royalties: 0.10 },
  "new-zealand": { dividends: 0.15, dividendsQualified: 0.05, interest: 0.10, royalties: 0.10 },
  ireland: { dividends: 0.15, dividendsQualified: 0.15, interest: 0.10, royalties: 0.10 },
};

// ─── Budget 2026-27 changes summary ──────────────────────────────────────────

export const BUDGET_2026_CHANGES = [
  { change: "Individual tax rate cuts", detail: "30% bracket → 28%, 37% bracket → 35% from 1 July 2026.", impactLevel: "high" as const },
  { change: "CGT discount replaced with indexation", detail: "From 1 July 2027: 50% CGT discount replaced with CPI indexation of cost base.", impactLevel: "high" as const },
  { change: "30% minimum CGT rate", detail: "Floor of 30% on all capital gains for individuals and trusts from 1 July 2027.", impactLevel: "high" as const },
  { change: "Trust CGT distributions", detail: "30% minimum rate on trust capital gain distributions eliminates low-bracket beneficiary strategy.", impactLevel: "high" as const },
  { change: "Start-up company tax offset", detail: "Refundable offset for companies under $10M turnover in first two years (from 1 July 2028).", impactLevel: "medium" as const },
  { change: "Instant asset write-off", detail: "$20,000 threshold made permanent from 1 July 2026.", impactLevel: "medium" as const },
  { change: "Loss carry-back", detail: "Two-year loss carry-back permanent for companies up to $1B turnover.", impactLevel: "medium" as const },
  { change: "Working Australians Tax Offset", detail: "$250 offset from 2027-28.", impactLevel: "low" as const },
];
