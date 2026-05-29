export const JURISDICTIONS = {
  AU: {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    locale: "en-AU",
    complaintBody: "AFCA (Australian Financial Complaints Authority)",
    complaintEmail: "complaints@afca.org.au",
    promptNotes:
      "Cite specific provisions of the General Insurance Code of Practice (GICOP) and ASIC RG 271 (Internal Dispute Resolution) where applicable. The external dispute body is AFCA. Use AUD throughout.",
  },
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    complaintBody: "the state Department of Insurance",
    complaintEmail: "",
    promptNotes:
      "Identify the policyholder's state from the documents. Cite that state's Unfair Claims Settlement Practices Act, the applicable NAIC model provisions, and the state Department of Insurance complaint process. For employer-provided health plans, also cite ERISA where relevant. Use USD throughout.",
  },
  UK: {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    complaintBody: "the Financial Ombudsman Service (FOS)",
    complaintEmail: "complaint.info@financial-ombudsman.org.uk",
    promptNotes:
      "Cite FCA Handbook ICOBS provisions and FCA DISP rules on complaint handling (including the 8-week response window). The external dispute body is the Financial Ombudsman Service. Use GBP throughout.",
  },
} as const;

export type Jurisdiction = keyof typeof JURISDICTIONS;

export const ALL_JURISDICTIONS: Jurisdiction[] = ["AU", "US", "UK"];

export function isJurisdiction(value: unknown): value is Jurisdiction {
  return typeof value === "string" && value in JURISDICTIONS;
}

export function jurisdictionConfig(j: Jurisdiction | undefined | null) {
  return JURISDICTIONS[j ?? "AU"] ?? JURISDICTIONS.AU;
}

export function formatMoney(
  amount: number,
  j: Jurisdiction | undefined | null,
): string {
  const cfg = jurisdictionConfig(j);
  return (Number.isFinite(amount) ? amount : 0).toLocaleString(cfg.locale, {
    style: "currency",
    currency: cfg.currency,
    maximumFractionDigits: 0,
  });
}
