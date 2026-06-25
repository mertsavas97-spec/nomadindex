import { filterImmigrationPrograms, getAllVisaPrograms } from "@/data/visa-programs";
import { getMonthlyMinIncome } from "@/lib/income";
import type { VisaProgram, VisaType } from "@/types/nomadindex";

export type PassportRegion = "eu-eea" | "us-canada" | "uk" | "other";
export type ApplicantCount = "solo" | "couple" | "family";
export type PreferredVisaType =
  | "digital-nomad"
  | "freelancer"
  | "startup"
  | "entrepreneur"
  | "any";
export type EligibilityStatus = "eligible" | "likely-eligible" | "not-enough-data";
export type IncomeCurrency = "EUR" | "USD" | "GBP";

/** Static estimate rates via EUR — not live FX. For planning tools only. */
const RATES_TO_EUR: Record<string, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  AED: 0.25,
  THB: 0.026,
  CAD: 0.68,
  AUD: 0.61,
  NZD: 0.56,
  SGD: 0.69,
  CZK: 0.04,
  HUF: 0.0026,
  RON: 0.2,
};

const EU_EEA_COUNTRY_SLUGS = new Set([
  "portugal",
  "spain",
  "estonia",
  "germany",
  "italy",
  "greece",
  "malta",
  "netherlands",
  "croatia",
  "czech-republic",
  "hungary",
  "romania",
  "cyprus",
  "france",
  "ireland",
]);

export type EligibilityInput = {
  passportRegion: PassportRegion;
  monthlyIncome: number;
  incomeCurrency: IncomeCurrency;
  applicantCount: ApplicantCount;
  preferredVisaType: PreferredVisaType;
  familyNeeded: boolean;
};

export type EligibilityResult = {
  program: VisaProgram;
  status: EligibilityStatus;
  reasons: string[];
};

export function normalizeCurrencyEstimate(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = RATES_TO_EUR[fromCurrency] ?? 1;
  const toRate = RATES_TO_EUR[toCurrency] ?? 1;
  const inEur = amount * fromRate;
  return inEur / toRate;
}

export function getApplicantMultiplier(applicantCount: ApplicantCount): number {
  switch (applicantCount) {
    case "solo":
      return 1;
    case "couple":
      return 1.35;
    case "family":
      return 1.75;
  }
}

function preferredTypeMatches(
  programType: VisaType,
  preferred: PreferredVisaType
): boolean {
  if (preferred === "any") {
    return true;
  }

  if (preferred === "entrepreneur") {
    return (
      programType === "freelancer" ||
      programType === "startup" ||
      programType === "passive-income"
    );
  }

  return programType === preferred;
}

function getRequiredIncome(program: VisaProgram, applicants: ApplicantCount): number | null {
  const monthlyMin = getMonthlyMinIncome(program);
  if (monthlyMin === null) {
    return null;
  }

  return monthlyMin * getApplicantMultiplier(applicants);
}

export function evaluateEligibility(
  program: VisaProgram,
  input: EligibilityInput
): EligibilityResult | null {
  if (!preferredTypeMatches(program.type, input.preferredVisaType)) {
    return null;
  }

  if (input.familyNeeded && !program.familyAllowed) {
    return null;
  }

  const reasons: string[] = [];
  const required = getRequiredIncome(program, input.applicantCount);
  const userIncomeInProgramCurrency = normalizeCurrencyEstimate(
    input.monthlyIncome,
    input.incomeCurrency,
    program.currency
  );

  if (input.passportRegion === "eu-eea" && EU_EEA_COUNTRY_SLUGS.has(program.countrySlug)) {
    reasons.push(
      "EU/EEA nationals may have simpler entry routes to EU destinations — verify current treaty rules."
    );
  } else if (input.passportRegion === "uk" && program.countrySlug === "uk") {
    reasons.push("UK nationals may have specific routes for the United Kingdom.");
  }

  if (program.verificationStatus === "placeholder") {
    reasons.push("Program figures are estimates — confirm with official sources.");
  } else if (program.verificationStatus === "in-progress") {
    reasons.push("Income and fee data are under source review.");
  }

  if (required === null) {
    reasons.push("No minimum income threshold in our dataset for this program.");
    if (program.requirementLevel === "very-high") {
      reasons.push("Program typically has stringent requirements beyond income alone.");
    }
    return {
      program,
      status: "not-enough-data",
      reasons,
    };
  }

  const surplus = userIncomeInProgramCurrency - required;
  const ratio = userIncomeInProgramCurrency / required;

  if (ratio >= 1) {
    reasons.push(
      `Stated minimum (~${Math.round(required).toLocaleString()} ${program.currency}/mo est.) appears met for ${input.applicantCount} applicants.`
    );
    return {
      program,
      status:
        program.verificationStatus === "verified" ? "eligible" : "likely-eligible",
      reasons,
    };
  }

  if (ratio >= 0.85) {
    reasons.push(
      `Income is within ~15% of stated minimum (~${Math.round(required).toLocaleString()} ${program.currency}/mo est.).`
    );
    return { program, status: "likely-eligible", reasons };
  }

  reasons.push(
    `Income appears below stated minimum (~${Math.round(required).toLocaleString()} ${program.currency}/mo est.) by ~${Math.abs(Math.round(surplus)).toLocaleString()} ${program.currency}.`
  );

  if (program.verificationStatus !== "verified") {
    return { program, status: "not-enough-data", reasons };
  }

  return { program, status: "likely-eligible", reasons };
}

export function evaluateAllEligibility(input: EligibilityInput): EligibilityResult[] {
  const results: EligibilityResult[] = [];

  for (const program of filterImmigrationPrograms(getAllVisaPrograms())) {
    const result = evaluateEligibility(program, input);
    if (result) {
      results.push(result);
    }
  }

  const order: Record<EligibilityStatus, number> = {
    eligible: 0,
    "likely-eligible": 1,
    "not-enough-data": 2,
  };

  return results.sort(
    (a, b) => order[a.status] - order[b.status] || a.program.name.localeCompare(b.program.name)
  );
}

export function getProgramsByVisaType(
  preferred: PreferredVisaType
): VisaProgram[] {
  return filterImmigrationPrograms(getAllVisaPrograms()).filter((p) =>
    preferredTypeMatches(p.type, preferred)
  );
}

export function getSetupCostEstimate(countrySlug: string): {
  amount: number;
  currency: string;
  note: string;
} {
  const estimates: Record<string, { amount: number; currency: string }> = {
    uae: { amount: 3500, currency: "USD" },
    thailand: { amount: 2500, currency: "USD" },
    singapore: { amount: 4000, currency: "SGD" },
    uk: { amount: 3000, currency: "GBP" },
    canada: { amount: 3500, currency: "CAD" },
    australia: { amount: 4500, currency: "AUD" },
    "new-zealand": { amount: 4000, currency: "NZD" },
  };

  const estimate = estimates[countrySlug] ?? { amount: 2500, currency: "EUR" };

  return {
    ...estimate,
    note: "Rough one-time setup estimate (housing deposit, flights, admin). Not official data.",
  };
}

export const PASSPORT_REGION_OPTIONS = [
  { value: "eu-eea", label: "EU / EEA" },
  { value: "us-canada", label: "US / Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "other", label: "Other" },
] as const;

export const APPLICANT_COUNT_OPTIONS = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
] as const;

export const PREFERRED_VISA_TYPE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "digital-nomad", label: "Digital nomad" },
  { value: "freelancer", label: "Freelancer" },
  { value: "startup", label: "Startup" },
  { value: "entrepreneur", label: "Entrepreneur / self-employed" },
] as const;

export const INCOME_CURRENCY_OPTIONS = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
] as const;

export const ORIGIN_REGION_OPTIONS = [
  { value: "europe", label: "Europe" },
  { value: "us-canada", label: "US / Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "asia", label: "Asia" },
  { value: "other", label: "Other" },
] as const;

export type OriginRegion = (typeof ORIGIN_REGION_OPTIONS)[number]["value"];

export const TOOL_LINKS = [
  {
    slug: "visa-eligibility-checker",
    title: "Visa Pathway Matcher",
    description:
      "Answer a few questions to see which immigration programs in our dataset may align with your profile — planning estimates only.",
  },
  {
    slug: "income-requirement-calculator",
    title: "Income Requirement Calculator",
    description:
      "Compare your monthly income against program minimums with surplus or shortfall estimates.",
  },
  {
    slug: "relocation-cost-calculator",
    title: "Relocation Cost Calculator",
    description:
      "Estimate visa fees, income buffers and rough setup costs for a planned move.",
  },
  {
    slug: "country-comparison-tool",
    title: "Country Comparison Tool",
    description:
      "Pick two countries and preview key comparison fields before opening the full compare page.",
  },
] as const;
