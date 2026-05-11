export type AnalysisFinding = {
  kind: "exclusion" | "regulation" | "valuation" | "procedure";
  title: string;
  detail: string;
  citation?: string | null;
};

export type Comparable = {
  reference: string;
  insurer: string;
  settlement: string;
  note: string;
};

export type Analysis = {
  insurer: string;
  policyType: string;
  policyNumber: string;
  lossDescription: string;
  insurerOffer: number;
  estimatedFairValue: number;
  upside: number;
  score: number;
  scoreLabel: "Strong" | "Moderate" | "Weak";
  findings: AnalysisFinding[];
  comparables: Comparable[];
  generatedDocs: { name: string; kind: "appeal" | "demand" | "complaint" }[];
  nextSteps: { title: string; detail: string; due: string }[];
  appealLetter: string;
};

export const mockAnalysis: Analysis = {
  insurer: "Auric Mutual Insurance",
  policyType: "Comprehensive Motor",
  policyNumber: "AM-9842-0411",
  lossDescription:
    "Rear-quarter collision damage; third-party at fault; insurer disputes cause of secondary water ingress.",
  insurerOffer: 2100,
  estimatedFairValue: 7400,
  upside: 5300,
  score: 86,
  scoreLabel: "Strong",
  findings: [
    {
      kind: "exclusion",
      title: "Exclusion 2.4(b) misapplied",
      detail:
        "Exclusion 2.4(b) limits cover for deliberate acts. Your loss is documented as third-party negligence. Endorsement E-12 explicitly reinstates accidental water-ingress cover for vehicles >$3,000 ACV.",
      citation: "Policy §2.4(b) · Endorsement E-12",
    },
    {
      kind: "regulation",
      title: "Fair settlement obligation engaged",
      detail:
        "GICOP §8.7 requires insurers to settle at fair value within 10 business days of receiving sufficient evidence. Three independent repair estimates support $7,400 ± $400.",
      citation: "GICOP §8.7",
    },
    {
      kind: "valuation",
      title: "Comparable settlements average $7,210",
      detail:
        "ClaimShield's regulatory database returns 41 comparable AU motor claims with a mean settlement of $7,210 and median $7,150.",
    },
    {
      kind: "procedure",
      title: "Internal Dispute Resolution clock started",
      detail:
        "Insurer must respond within 30 calendar days. AFCA complaint may be lodged after IDR is exhausted or upon expiry.",
      citation: "ASIC RG 271",
    },
  ],
  comparables: [
    { reference: "AU-MTR-08172", insurer: "Auric Mutual", settlement: "$7,150", note: "Same exclusion contested" },
    { reference: "AU-MTR-04429", insurer: "Cobalt General", settlement: "$6,980", note: "GICOP §8.7 cited" },
    { reference: "AU-MTR-11203", insurer: "Auric Mutual", settlement: "$7,640", note: "Endorsement E-12 invoked" },
  ],
  generatedDocs: [
    { name: "Appeal Letter — Auric Mutual (IDR)", kind: "appeal" },
    { name: "Settlement Demand — Fair Value $7,400", kind: "demand" },
    { name: "AFCA Complaint (pre-formatted)", kind: "complaint" },
  ],
  nextSteps: [
    {
      title: "Send appeal letter to Auric Mutual IDR team",
      detail:
        "Email: idr@auricmutual.com.au. Attach the three repair estimates and Endorsement E-12.",
      due: "Within 2 days",
    },
    {
      title: "Diarise insurer response deadline",
      detail:
        "Under RG 271 the insurer must substantively respond within 30 calendar days.",
      due: "Day 30",
    },
    {
      title: "File AFCA complaint if unresolved",
      detail:
        "ClaimShield will pre-fill the AFCA portal form and email you the submission link.",
      due: "Day 31+",
    },
  ],
  appealLetter: `Dear Auric Mutual Claims Team,

I am writing to formally dispute the settlement offer of $2,100 issued on 04/05/2026 in respect of claim AM-9842-0411 (policy holder: [Your Name]).

The denial of full cover relies on exclusion 2.4(b). By its own terms this clause applies only to deliberate acts of the insured. The loss documented in this claim arises from third-party negligence — a fact established by the police event number and the at-fault driver's insurer admission attached herewith. Exclusion 2.4(b) is therefore not engaged.

Further, Endorsement E-12 (incorporated at policy issuance on 11/03/2025) expressly reinstates cover for accidental water ingress consequential to a covered impact event, which is precisely the loss documented in the assessor's report dated 27/04/2026.

The current offer of $2,100 represents 28% of the documented repair cost. Three independent quotes (attached) place the fair repair cost at $7,400 ± $400. ClaimShield's comparable-claims analysis returns a median settlement of $7,150 for losses of this type. The current offer therefore also fails the fair-settlement obligation under GICOP §8.7.

I request that Auric Mutual:
  1. Withdraw the present offer and issue a revised settlement of no less than $7,400; or
  2. Provide, within 10 business days, a written explanation citing the specific policy provisions relied upon, addressing Endorsement E-12 directly.

In the absence of a substantive response within the timeframes required by ASIC RG 271, I will refer this matter to the Australian Financial Complaints Authority.

Yours faithfully,
[Your Name]
[Date]`,
};
