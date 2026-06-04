// Employment-law jurisdiction config for ER Advisor.
//
// Mirrors the shape of src/lib/jurisdiction.ts (the ClaimShield insurance
// jurisdictions) but carries employment-relations context instead. AU is the
// only fully-populated jurisdiction in Phase 0; US/UK are stubbed so the
// multi-jurisdiction architecture is in place without rework later.

export const EMPLOYMENT_JURISDICTIONS = {
  AU: {
    code: "AU",
    name: "Australia",
    locale: "en-AU",
    primaryStatute: "Fair Work Act 2009 (Cth)",
    tribunal: "Fair Work Commission (FWC)",
    regulator: "Fair Work Ombudsman (FWO)",
    promptNotes:
      "National workplace relations system. Cite the Fair Work Act 2009 (Cth) by section (e.g. s.387), the National Employment Standards (NES), and the relevant modern award by clause. Note WA non-national-system employees and state public sectors as out-of-scope edge cases that warrant professional advice.",
    enabled: true,
  },
  US: {
    code: "US",
    name: "United States",
    locale: "en-US",
    primaryStatute: "Fair Labor Standards Act + state law",
    tribunal: "EEOC / state labor boards",
    regulator: "Department of Labor",
    promptNotes: "Not enabled in Phase 0.",
    enabled: false,
  },
  UK: {
    code: "UK",
    name: "United Kingdom",
    locale: "en-GB",
    primaryStatute: "Employment Rights Act 1996",
    tribunal: "Employment Tribunal",
    regulator: "ACAS",
    promptNotes: "Not enabled in Phase 0.",
    enabled: false,
  },
} as const;

export type EmploymentJurisdiction = keyof typeof EMPLOYMENT_JURISDICTIONS;

export const ENABLED_EMPLOYMENT_JURISDICTIONS = (
  Object.keys(EMPLOYMENT_JURISDICTIONS) as EmploymentJurisdiction[]
).filter((j) => EMPLOYMENT_JURISDICTIONS[j].enabled);

export function employmentJurisdictionConfig(
  j: EmploymentJurisdiction | undefined | null,
) {
  return EMPLOYMENT_JURISDICTIONS[j ?? "AU"] ?? EMPLOYMENT_JURISDICTIONS.AU;
}

export function isEmploymentJurisdiction(
  value: unknown,
): value is EmploymentJurisdiction {
  return typeof value === "string" && value in EMPLOYMENT_JURISDICTIONS;
}
