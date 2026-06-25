export type VisaType =
  | "digital-nomad"
  | "freelancer"
  | "startup"
  | "investor"
  | "passive-income"
  | "work"
  | "residency"
  | "other";

export type RequirementLevel = "low" | "moderate" | "high" | "very-high";

export type VerificationStatus = "verified" | "in-progress" | "placeholder";

export const VERIFICATION_STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; description: string; className: string }
> = {
  verified: {
    label: "Dataset verified",
    description:
      "Key fields in this record matched our linked reference source at last review.",
    className: "bg-available-bg text-available-text border-0",
  },
  "in-progress": {
    label: "Under review",
    description:
      "Figures are being cross-checked against reference sources — confirm with authorities before applying.",
    className: "bg-primary-soft text-primary-dark border-0",
  },
  placeholder: {
    label: "Estimate only",
    description:
      "Planning placeholder — core requirements are not confirmed in our dataset yet.",
    className: "bg-warning-bg text-warning-text border border-warning-text/20",
  },
};

export function getVerificationStatusLabel(status: VerificationStatus): string {
  return VERIFICATION_STATUS_CONFIG[status].label;
}

export type SourceConfidence =
  | "official"
  | "government"
  | "secondary"
  | "estimated";

export const SOURCE_CONFIDENCE_CONFIG: Record<
  SourceConfidence,
  { label: string; description: string; className: string }
> = {
  official: {
    label: "Official source",
    description:
      "Dataset-verified record linked to an issuing-authority or government source.",
    className: "bg-available-bg text-available-text border-0",
  },
  government: {
    label: "Government source",
    description:
      "Links to a government domain — figures may still be under dataset review.",
    className: "bg-primary-soft text-primary-dark border-0",
  },
  secondary: {
    label: "Secondary source",
    description:
      "Third-party or program-operator reference — confirm with issuing authorities.",
    className: "bg-neutral-bg text-ink border border-border/60",
  },
  estimated: {
    label: "Estimate",
    description:
      "Planning estimate only — no confirmed official figure in our dataset.",
    className: "bg-warning-bg text-warning-text border border-warning-text/20",
  },
};

export type SourceReference = {
  label: string;
  url: string;
  lastChecked: string;
};

export type Country = {
  id: string;
  slug: string;
  name: string;
  region: "Europe" | "Middle East" | "Asia" | "North America" | "Oceania";
  flagEmoji: string;
  summary: string;
  currency: string;
  capital: string;
  hasDigitalNomadVisa: boolean;
  hasFreelancerVisa: boolean;
  hasStartupVisa: boolean;
  citizenshipYears: number | null;
  lastUpdated: string;
  lastReviewed: string;
  featured?: boolean;
};

export type VisaProgram = {
  id: string;
  slug: string;
  countrySlug: string;
  name: string;
  type: VisaType;
  summary: string;
  minIncome: number | null;
  incomePeriod: "monthly" | "annual" | null;
  currency: string;
  applicationFee: number | null;
  processingTime: string | null;
  stayDuration: string;
  renewable: boolean;
  familyAllowed: boolean;
  citizenshipPath: boolean;
  taxNotes: string;
  requirementLevel: RequirementLevel;
  officialSourceUrl: string;
  lastVerified: string;
  lastReviewed: string;
  verificationStatus: VerificationStatus;
  sourceConfidence: SourceConfidence;
  featured?: boolean;
};

export type ComparisonHighlight = "a" | "b" | null;

export type CompareRowCategory =
  | "remote-work"
  | "freelancer"
  | "startup"
  | "family"
  | "residency"
  | "citizenship"
  | "cost"
  | "tax"
  | "lifestyle"
  | "meta";

export const COMPARE_ROW_CATEGORY_LABELS: Record<CompareRowCategory, string> = {
  "remote-work": "Remote work",
  freelancer: "Freelancer",
  startup: "Startup",
  family: "Family relocation",
  residency: "Residency pathway",
  citizenship: "Citizenship",
  cost: "Cost",
  tax: "Tax",
  lifestyle: "Lifestyle",
  meta: "Data",
};

export type ComparisonField = {
  label: string;
  valueA: string;
  valueB: string;
  highlight: ComparisonHighlight;
  verificationStatus: VerificationStatus;
};

export type Comparison = {
  id: string;
  slug: string;
  countryASlug: string;
  countryBSlug: string;
  fields: ComparisonField[];
  lastUpdated: string;
  disclaimer: string;
};

export type ComparisonTableRow = {
  label: string;
  valueA: string;
  valueB: string;
  highlight: ComparisonHighlight;
  verificationStatus: VerificationStatus;
  category: CompareRowCategory;
};

export type ComparisonRecommendation = {
  id: string;
  label: string;
  winnerSlug: string | null;
  summary: string;
};

export type CountryPair = {
  slug: string;
  countryASlug: string;
  countryBSlug: string;
};

export type CountryComparisonData = {
  slug: string;
  countryASlug: string;
  countryBSlug: string;
  countryA: Country;
  countryB: Country;
  rows: ComparisonTableRow[];
  recommendations: ComparisonRecommendation[];
  visasA: VisaProgram[];
  visasB: VisaProgram[];
  lastUpdated: string;
  hasUnverifiedData: boolean;
};

export const LEGAL_NOTICE =
  "NomadIndex is not legal, tax, or immigration advice.";

export const DATA_DISCLAIMER =
  "NomadIndex data is for informational and planning purposes only. Requirements change frequently — verify with official government sources before applying.";

export const VERIFICATION_NOTICE =
  "Some figures are estimates or source-reviewed values. Always confirm requirements with official government sources before applying.";

export const DATA_TRANSPARENCY_NOTICE_HOMEPAGE =
  "Data transparency: Some values are estimates or source-reviewed. Always check official sources before applying.";

export const TOOL_DISCLAIMER =
  "Tool outputs are planning estimates based on our local dataset. They do not determine legal eligibility or guarantee approval.";
