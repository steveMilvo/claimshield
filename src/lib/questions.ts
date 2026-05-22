// Questionnaire definition for Founder Tax Blueprint
// 6 sections, 33 questions total — matches spec sections 6.1-6.6

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

export interface Question {
  id: string;
  type: "radio" | "checkbox" | "text" | "number" | "select";
  label: string;
  hint?: string;
  options?: Option[];
  required?: boolean;
  showIf?: (answers: Answers) => boolean;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  questions: Question[];
}

export interface Answers {
  // Section 1 — Personal Context
  employmentStatus: string;
  personalIncome: string;
  hasPartner: string;
  hasTrustBeneficiaries: string;
  existingInvestments: string[];
  hasHECS: string;
  taxResidency: string;

  // Section 2 — Business Idea
  businessType: string;
  hasIP: string;
  coFounders: string;
  equitySplitAgreed: string;
  primaryMarket: string;

  // Section 3 — Financial Projections
  year1Revenue: string;
  year3Revenue: string;
  salaryPlan: string;
  personalInvestment: string;
  expectsRD: string;

  // Section 4 — Growth, Capital & International
  capitalPlan: string;
  capitalType: string[];
  vcType: string;
  plansToHire: string;
  internationalOperations: string;
  internationalMarkets: string[];
  openToInternational: string;

  // Section 5 — Exit Strategy
  exitPath: string[];
  exitTimeframe: string;
  exitValuation: string;
  considerIPRetention: string;
  isOver55AtExit: string;

  // Section 6 — Preferences & Constraints
  assetProtection: string;
  complianceCostPriority: string;
  complexityPreference: string;
  openToTrust: string;
  setupBudget: string;
}

export const EMPTY_ANSWERS: Answers = {
  employmentStatus: "",
  personalIncome: "",
  hasPartner: "",
  hasTrustBeneficiaries: "",
  existingInvestments: [],
  hasHECS: "",
  taxResidency: "",
  businessType: "",
  hasIP: "",
  coFounders: "",
  equitySplitAgreed: "",
  primaryMarket: "",
  year1Revenue: "",
  year3Revenue: "",
  salaryPlan: "",
  personalInvestment: "",
  expectsRD: "",
  capitalPlan: "",
  capitalType: [],
  vcType: "",
  plansToHire: "",
  internationalOperations: "",
  internationalMarkets: [],
  openToInternational: "",
  exitPath: [],
  exitTimeframe: "",
  exitValuation: "",
  considerIPRetention: "",
  isOver55AtExit: "",
  assetProtection: "",
  complianceCostPriority: "",
  complexityPreference: "",
  openToTrust: "",
  setupBudget: "",
};

export const SECTIONS: Section[] = [
  {
    id: "personal",
    title: "Your Personal Context",
    subtitle: "This shapes your marginal rate, income-splitting opportunities, and overall tax position.",
    questions: [
      {
        id: "employmentStatus",
        type: "radio",
        label: "Are you currently employed?",
        required: true,
        options: [
          { value: "full-time", label: "Full-time" },
          { value: "part-time", label: "Part-time" },
          { value: "none", label: "No — this will be my main income" },
        ],
      },
      {
        id: "personalIncome",
        type: "radio",
        label: "Current annual personal income (excluding your new business)",
        hint: "Includes salary, investment income, etc.",
        required: true,
        options: [
          { value: "0-45k", label: "$0 – $45,000" },
          { value: "45k-120k", label: "$45,001 – $120,000" },
          { value: "120k-190k", label: "$120,001 – $190,000" },
          { value: "190k+", label: "$190,001+" },
        ],
      },
      {
        id: "hasPartner",
        type: "radio",
        label: "Do you have a spouse or partner?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "hasTrustBeneficiaries",
        type: "radio",
        label: "Do you have family members who could be discretionary trust beneficiaries?",
        hint: "Adult family members in lower tax brackets who could receive trust distributions.",
        required: true,
        options: [
          { value: "yes", label: "Yes — I have adult family members in lower brackets" },
          { value: "potentially", label: "Potentially — children who will be adults within 5 years" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "existingInvestments",
        type: "checkbox",
        label: "Existing investments (select all that apply)",
        options: [
          { value: "property", label: "Investment property" },
          { value: "shares", label: "Share portfolio" },
          { value: "super", label: "Superannuation (SMSF or industry/retail fund)" },
          { value: "none", label: "None" },
        ],
      },
      {
        id: "hasHECS",
        type: "radio",
        label: "Do you have an existing HECS/HELP debt?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "taxResidency",
        type: "radio",
        label: "Are you an Australian tax resident?",
        required: true,
        options: [
          { value: "yes", label: "Yes — Australian tax resident" },
          { value: "no", label: "No — I am a foreign resident for tax purposes" },
          { value: "unsure", label: "Unsure" },
        ],
      },
    ],
  },
  {
    id: "business",
    title: "Your Business",
    subtitle: "The nature of your business determines which structures are commercially appropriate.",
    questions: [
      {
        id: "businessType",
        type: "radio",
        label: "What type of business are you building?",
        required: true,
        options: [
          { value: "saas", label: "SaaS / Software product" },
          { value: "professional-services", label: "Professional services (consulting, advisory, etc.)" },
          { value: "physical-product", label: "Physical product / manufacturing" },
          { value: "marketplace", label: "Marketplace or platform" },
          { value: "content-media", label: "Content, media, or creator business" },
          { value: "trades-construction", label: "Trades / construction" },
          { value: "ecommerce", label: "E-commerce / retail" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "hasIP",
        type: "radio",
        label: "Is intellectual property (IP) being created that could appreciate in value?",
        hint: "Software, patents, trade secrets, brand, proprietary data, algorithms, etc.",
        required: true,
        options: [
          { value: "yes", label: "Yes — definitely" },
          { value: "no", label: "No" },
          { value: "unsure", label: "Unsure" },
        ],
      },
      {
        id: "coFounders",
        type: "radio",
        label: "Are you building alone or with co-founders?",
        required: true,
        options: [
          { value: "solo", label: "Solo founder" },
          { value: "two", label: "2 founders" },
          { value: "three-plus", label: "3 or more founders" },
        ],
      },
      {
        id: "equitySplitAgreed",
        type: "radio",
        label: "Have co-founder equity splits been agreed?",
        showIf: (a) => a.coFounders !== "solo",
        options: [
          { value: "yes", label: "Yes — agreed in writing" },
          { value: "verbal", label: "Yes — agreed verbally" },
          { value: "no", label: "Not yet" },
        ],
      },
      {
        id: "primaryMarket",
        type: "radio",
        label: "What is your primary target market?",
        required: true,
        options: [
          { value: "australia", label: "Australia only" },
          { value: "au-nz", label: "Australia + New Zealand" },
          { value: "apac", label: "APAC / Southeast Asia" },
          { value: "global", label: "Global" },
          { value: "us-focused", label: "US-focused" },
        ],
      },
    ],
  },
  {
    id: "financials",
    title: "Financial Projections",
    subtitle: "Realistic numbers help us model the right tax scenarios. Rough estimates are fine.",
    questions: [
      {
        id: "year1Revenue",
        type: "radio",
        label: "Realistic revenue target — Year 1",
        required: true,
        options: [
          { value: "0-50k", label: "$0 – $50,000" },
          { value: "50k-200k", label: "$50,001 – $200,000" },
          { value: "200k-500k", label: "$200,001 – $500,000" },
          { value: "500k+", label: "$500,001+" },
        ],
      },
      {
        id: "year3Revenue",
        type: "radio",
        label: "Realistic revenue target — Year 3",
        required: true,
        options: [
          { value: "0-200k", label: "Under $200,000" },
          { value: "200k-1m", label: "$200,001 – $1,000,000" },
          { value: "1m-5m", label: "$1,000,001 – $5,000,000" },
          { value: "5m+", label: "$5,000,001+" },
        ],
      },
      {
        id: "salaryPlan",
        type: "radio",
        label: "Plan to pay yourself a salary from day one, or reinvest profits?",
        required: true,
        options: [
          { value: "salary", label: "Pay myself a salary from day one" },
          { value: "reinvest", label: "Reinvest all profits initially" },
          { value: "mix", label: "Mix — some salary, reinvest the rest" },
          { value: "distributions", label: "Trust/dividend distributions when profitable" },
        ],
      },
      {
        id: "personalInvestment",
        type: "radio",
        label: "Personal funds being invested into the business",
        options: [
          { value: "under-10k", label: "Under $10,000" },
          { value: "10k-50k", label: "$10,001 – $50,000" },
          { value: "50k-200k", label: "$50,001 – $200,000" },
          { value: "200k+", label: "$200,001+" },
        ],
      },
      {
        id: "expectsRD",
        type: "radio",
        label: "Do you expect to incur R&D expenditure qualifying for the R&D Tax Incentive?",
        hint: "Experimental activities that advance technical knowledge and couldn't be worked out in advance.",
        required: true,
        options: [
          { value: "yes", label: "Yes — definitely" },
          { value: "possibly", label: "Possibly" },
          { value: "no", label: "No" },
          { value: "unsure", label: "Unsure" },
        ],
      },
    ],
  },
  {
    id: "growth",
    title: "Growth, Capital & International",
    subtitle: "Capital raising and international expansion fundamentally change which structures work.",
    questions: [
      {
        id: "capitalPlan",
        type: "radio",
        label: "Do you plan to raise external capital?",
        required: true,
        options: [
          { value: "yes-12mo", label: "Yes — within the next 12 months" },
          { value: "yes-eventually", label: "Yes — eventually (12+ months away)" },
          { value: "no", label: "No — bootstrapped" },
          { value: "unsure", label: "Unsure" },
        ],
      },
      {
        id: "capitalType",
        type: "checkbox",
        label: "Type of capital you plan to raise (select all that apply)",
        showIf: (a) => a.capitalPlan !== "no",
        options: [
          { value: "angel", label: "Angel investors" },
          { value: "vc", label: "Venture capital (VC)" },
          { value: "pe", label: "Private equity (PE)" },
          { value: "grants", label: "Government grants" },
          { value: "crowdfunding", label: "Crowdfunding" },
          { value: "none", label: "None / undecided" },
        ],
      },
      {
        id: "vcType",
        type: "radio",
        label: "If raising VC, which geography?",
        showIf: (a) => a.capitalType.includes("vc"),
        options: [
          { value: "australian", label: "Australian VC" },
          { value: "us", label: "US VC" },
          { value: "international", label: "International / mixed" },
        ],
      },
      {
        id: "plansToHire",
        type: "radio",
        label: "Do you plan to hire employees within 12 months?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "contractors", label: "Contractors only" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "internationalOperations",
        type: "radio",
        label: "Do you plan to operate or sell in markets outside Australia?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "eventually", label: "Eventually" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "internationalMarkets",
        type: "checkbox",
        label: "Which markets? (select all that apply)",
        showIf: (a) => a.internationalOperations !== "no",
        options: [
          { value: "nz", label: "New Zealand" },
          { value: "asean", label: "ASEAN / Southeast Asia" },
          { value: "us", label: "United States" },
          { value: "uk-europe", label: "UK / Europe" },
          { value: "global", label: "Global / multiple" },
        ],
      },
      {
        id: "openToInternational",
        type: "radio",
        label: "Are you open to an international holding structure if it's commercially justified?",
        showIf: (a) => a.internationalOperations !== "no",
        options: [
          { value: "yes", label: "Yes — open to it" },
          { value: "no", label: "No — prefer to keep it domestic" },
          { value: "tell-me-more", label: "Tell me more in the report" },
        ],
      },
    ],
  },
  {
    id: "exit",
    title: "Exit Strategy",
    subtitle: "Your intended exit fundamentally shapes which structure is optimal. Pick all that apply.",
    questions: [
      {
        id: "exitPath",
        type: "checkbox",
        label: "What is your intended exit path? (select all that apply)",
        required: true,
        options: [
          { value: "trade-sale", label: "Trade sale (acquisition by another company)" },
          { value: "ipo", label: "IPO (ASX or international listing)" },
          { value: "mbo", label: "Management buyout (MBO)" },
          { value: "licensing", label: "Licensing / royalty exit (retain IP, licence to buyer)" },
          { value: "lifestyle", label: "Lifestyle business (no planned exit)" },
          { value: "family-succession", label: "Family succession / transfer" },
          { value: "dont-know", label: "Don't know yet" },
        ],
      },
      {
        id: "exitTimeframe",
        type: "radio",
        label: "Expected exit timeframe",
        required: true,
        options: [
          { value: "3-5", label: "3 – 5 years" },
          { value: "5-10", label: "5 – 10 years" },
          { value: "10+", label: "10+ years" },
          { value: "no-exit", label: "No planned exit" },
        ],
      },
      {
        id: "exitValuation",
        type: "radio",
        label: "Expected exit valuation range",
        hint: "Your best guess — this affects Division 152 eligibility and CGT modelling.",
        required: true,
        options: [
          { value: "500k-2m", label: "$500K – $2M" },
          { value: "2m-10m", label: "$2M – $10M" },
          { value: "10m-50m", label: "$10M – $50M" },
          { value: "50m+", label: "$50M+" },
          { value: "no-idea", label: "No idea yet" },
        ],
      },
      {
        id: "considerIPRetention",
        type: "radio",
        label: "Would you consider retaining IP and licensing it to an acquirer, rather than a full sale?",
        options: [
          { value: "yes", label: "Yes — interested in licensing model" },
          { value: "no", label: "No — prefer clean exit" },
          { value: "maybe", label: "Maybe — depends on the offer" },
        ],
      },
      {
        id: "isOver55AtExit",
        type: "radio",
        label: "Will you be 55 or older at your planned exit?",
        hint: "Relevant to the Division 152 retirement exemption and 15-year exemption.",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "possibly", label: "Possibly" },
        ],
      },
    ],
  },
  {
    id: "preferences",
    title: "Preferences & Constraints",
    subtitle: "Your priorities help us weight the trade-offs in the scenarios.",
    questions: [
      {
        id: "assetProtection",
        type: "radio",
        label: "How important is asset protection to you?",
        hint: "Separating business liabilities from personal assets.",
        required: true,
        options: [
          { value: "very", label: "Very important — I want maximum separation" },
          { value: "somewhat", label: "Somewhat important" },
          { value: "not", label: "Not a priority" },
        ],
      },
      {
        id: "complianceCostPriority",
        type: "radio",
        label: "How important is minimising ongoing compliance costs?",
        hint: "Multiple entities = multiple tax returns, ASIC fees, accounting bills.",
        required: true,
        options: [
          { value: "very", label: "Very important — keep it simple and cheap" },
          { value: "somewhat", label: "Somewhat important" },
          { value: "not", label: "Not a priority if the tax savings justify it" },
        ],
      },
      {
        id: "complexityPreference",
        type: "radio",
        label: "Your preference on structural complexity",
        required: true,
        options: [
          { value: "simple", label: "Simplest possible structure, even if it means paying more tax" },
          { value: "moderate", label: "Moderate complexity is fine if the savings are meaningful" },
          { value: "complex-ok", label: "Comfortable with complexity if it materially optimises my position" },
        ],
      },
      {
        id: "openToTrust",
        type: "radio",
        label: "Are you open to a trust structure?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No — I prefer a company" },
          { value: "tell-me-more", label: "Tell me more in the report" },
        ],
      },
      {
        id: "setupBudget",
        type: "radio",
        label: "Budget for initial structure setup",
        required: true,
        options: [
          { value: "under-2k", label: "Under $2,000 (sole trader / simple company)" },
          { value: "2k-5k", label: "$2,000 – $5,000" },
          { value: "5k-15k", label: "$5,000 – $15,000" },
          { value: "15k+", label: "$15,000+" },
          { value: "optimal", label: "Whatever is optimal — budget is not the constraint" },
        ],
      },
    ],
  },
];
