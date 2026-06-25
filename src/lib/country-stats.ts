import { getCountryProcessingRange } from "@/data/comparisons";
import { filterImmigrationPrograms } from "@/data/visa-programs";
import { getLowestMinIncome } from "@/lib/format";
import { getMonthlyMinIncome } from "@/lib/income";
import { parseProcessingDays } from "@/lib/visa-types";
import type { Country, VisaProgram, VisaType } from "@/types/nomadindex";

const EU_MEMBER_SLUGS = new Set([
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

/** EU members except Ireland (common travel area, not Schengen). */
const SCHENGEN_SLUGS = new Set(
  [...EU_MEMBER_SLUGS].filter((slug) => slug !== "ireland")
);

const COUNTRY_LANGUAGES: Record<string, string> = {
  portugal: "Portuguese",
  spain: "Spanish",
  uae: "Arabic (English widely used)",
  thailand: "Thai",
  estonia: "Estonian",
  germany: "German",
  italy: "Italian",
  greece: "Greek",
  malta: "Maltese, English",
  netherlands: "Dutch",
  croatia: "Croatian",
  "czech-republic": "Czech",
  hungary: "Hungarian",
  romania: "Romanian",
  cyprus: "Greek, Turkish",
  france: "French",
  ireland: "English, Irish",
  uk: "English",
  canada: "English, French",
  australia: "English",
  "new-zealand": "English",
  singapore: "English, Malay, Mandarin, Tamil",
};

const FEATURED_VISA_TYPE_PRIORITY: VisaType[] = [
  "digital-nomad",
  "startup",
  "freelancer",
  "passive-income",
  "investor",
];

const PATHWAY_LABELS: Partial<Record<VisaType, string>> = {
  "digital-nomad": "Digital Nomad",
  startup: "Startup",
  freelancer: "Freelancer",
  "passive-income": "Passive Income",
  investor: "Investor",
  work: "Work",
  residency: "Residency",
  other: "Other",
};

export type CountrySnapshotData = {
  programCount: number;
  lowestIncome: string | null;
  fastestProcessing: string;
  processingRange: string;
  citizenshipTimeline: string;
  currency: string;
  capital: string;
  language: string;
  euStatus: string;
  schengenStatus: string;
  familyRoutesCount: number;
  familyRoutesLabel: string;
  remoteWorkerFriendly: boolean;
  remoteWorkerLabel: string;
  availablePathways: { type: VisaType; label: string }[];
};

export type CountryQuickStats = {
  programCount: number;
  lowestIncome: string | null;
  fastestProcessing: string;
  citizenshipTimeline: string;
  familyFriendly: string;
  euSchengen: string;
};

export type CountryEditorial = {
  bestFor: string[];
  considerations: string[];
};

function formatCitizenshipYears(years: number | null): string {
  if (years === null) {
    return "Not specified in dataset";
  }

  return `${years} years (typical)`;
}

function getEuStatus(country: Country): string {
  if (country.region !== "Europe") {
    return "Not applicable";
  }

  return EU_MEMBER_SLUGS.has(country.slug) ? "EU member" : "Not an EU member";
}

function getSchengenStatus(country: Country): string {
  if (country.region !== "Europe") {
    return "Not applicable";
  }

  if (!EU_MEMBER_SLUGS.has(country.slug) && country.slug === "uk") {
    return "Not in Schengen";
  }

  if (country.slug === "ireland") {
    return "Not in Schengen";
  }

  return SCHENGEN_SLUGS.has(country.slug) ? "Schengen area" : "Not in Schengen";
}

function getFastestProcessing(visas: VisaProgram[]): string {
  const withTime = visas.filter((v) => v.processingTime);
  if (withTime.length === 0) {
    return "Varies";
  }

  const fastest = withTime.reduce((min, visa) =>
    parseProcessingDays(visa.processingTime) < parseProcessingDays(min.processingTime)
      ? visa
      : min
  );

  return fastest.processingTime ?? "Varies";
}

function getAvailablePathways(visas: VisaProgram[]): { type: VisaType; label: string }[] {
  const types = new Set(visas.map((v) => v.type));
  const ordered: VisaType[] = [
    "digital-nomad",
    "startup",
    "freelancer",
    "passive-income",
    "investor",
    "work",
    "residency",
    "other",
  ];

  return ordered
    .filter((type) => types.has(type))
    .map((type) => ({
      type,
      label: PATHWAY_LABELS[type] ?? type,
    }));
}

export function getCountrySnapshot(
  country: Country,
  visas: VisaProgram[]
): CountrySnapshotData {
  const immigrationVisas = filterImmigrationPrograms(visas);
  const familyRoutes = immigrationVisas.filter((v) => v.familyAllowed);

  return {
    programCount: immigrationVisas.length,
    lowestIncome: getLowestMinIncome(immigrationVisas),
    fastestProcessing: getFastestProcessing(immigrationVisas),
    processingRange: getCountryProcessingRange(country.slug),
    citizenshipTimeline: formatCitizenshipYears(country.citizenshipYears),
    currency: country.currency,
    capital: country.capital,
    language: COUNTRY_LANGUAGES[country.slug] ?? "See official sources",
    euStatus: getEuStatus(country),
    schengenStatus: getSchengenStatus(country),
    familyRoutesCount: familyRoutes.length,
    familyRoutesLabel:
      familyRoutes.length === 0
        ? "None tracked with family inclusion"
        : `${familyRoutes.length} of ${immigrationVisas.length} programs`,
    remoteWorkerFriendly: immigrationVisas.some(
      (v) => v.type === "digital-nomad" || v.type === "freelancer"
    ),
    remoteWorkerLabel: immigrationVisas.some((v) => v.type === "digital-nomad")
      ? "Digital nomad routes tracked"
      : immigrationVisas.some((v) => v.type === "freelancer")
        ? "Freelancer routes tracked"
        : "Limited remote-work routes in dataset",
    availablePathways: getAvailablePathways(immigrationVisas),
  };
}

export function getCountryQuickStats(
  country: Country,
  visas: VisaProgram[]
): CountryQuickStats {
  const snapshot = getCountrySnapshot(country, visas);
  const euSchengen =
    snapshot.euStatus === "Not applicable"
      ? "—"
      : snapshot.schengenStatus === "Schengen area"
        ? "EU · Schengen"
        : snapshot.euStatus === "EU member"
          ? "EU · Not Schengen"
          : "Not EU";

  return {
    programCount: snapshot.programCount,
    lowestIncome: snapshot.lowestIncome,
    fastestProcessing: snapshot.fastestProcessing,
    citizenshipTimeline: snapshot.citizenshipTimeline,
    familyFriendly: snapshot.familyRoutesLabel,
    euSchengen,
  };
}

export function getFeaturedPrograms(visas: VisaProgram[]): VisaProgram[] {
  const featured: VisaProgram[] = [];
  const usedIds = new Set<string>();

  for (const type of FEATURED_VISA_TYPE_PRIORITY) {
    const candidates = visas.filter((v) => v.type === type);
    const pick =
      candidates.find((v) => v.featured) ??
      candidates.sort((a, b) => a.name.localeCompare(b.name))[0];

    if (pick && !usedIds.has(pick.id)) {
      featured.push(pick);
      usedIds.add(pick.id);
    }
  }

  return featured;
}

export function getRemainingPrograms(
  visas: VisaProgram[],
  featured: VisaProgram[]
): VisaProgram[] {
  const featuredIds = new Set(featured.map((v) => v.id));
  return visas.filter((v) => !featuredIds.has(v.id));
}

export function getCountryEditorial(
  country: Country,
  visas: VisaProgram[]
): CountryEditorial {
  const immigrationVisas = filterImmigrationPrograms(visas);
  const bestFor: string[] = [];
  const considerations: string[] = [];

  if (immigrationVisas.some((v) => v.type === "digital-nomad")) {
    bestFor.push("Remote workers with employer or client income abroad");
  }

  if (immigrationVisas.some((v) => v.type === "startup")) {
    bestFor.push("Founders exploring startup or innovator routes");
  }

  if (immigrationVisas.some((v) => v.type === "freelancer")) {
    bestFor.push("Freelancers and self-employed professionals");
  }

  if (immigrationVisas.some((v) => v.familyAllowed)) {
    bestFor.push("Applicants who may relocate with family members");
  }

  if (immigrationVisas.some((v) => v.type === "passive-income")) {
    bestFor.push("Passive-income and financially independent applicants");
  }

  if (bestFor.length === 0) {
    bestFor.push("Applicants comparing structured mobility pathways in our dataset");
  }

  const monthlyIncomes = immigrationVisas
    .map(getMonthlyMinIncome)
    .filter((v): v is number => v !== null);
  const maxIncome = monthlyIncomes.length > 0 ? Math.max(...monthlyIncomes) : null;

  if (maxIncome !== null && maxIncome >= 3500) {
    considerations.push("Some programs require relatively high declared income");
  }

  const processingDays = immigrationVisas
    .map((v) => parseProcessingDays(v.processingTime))
    .filter(Number.isFinite);
  if (processingDays.length > 0 && Math.max(...processingDays) >= 90) {
    considerations.push("Processing times can exceed 90 days for some routes");
  }

  if (country.citizenshipYears === null) {
    considerations.push("Citizenship timeline not clearly mapped in our dataset");
  }

  if (immigrationVisas.length <= 2) {
    considerations.push("Fewer tracked pathways than larger destinations in NomadIndex");
  }

  if (immigrationVisas.some((v) => v.taxNotes && v.taxNotes.length > 20)) {
    considerations.push("Tax treatment varies — professional advice recommended");
  }

  if (considerations.length === 0) {
    considerations.push("Requirements change — confirm every figure with official sources");
  }

  return { bestFor: bestFor.slice(0, 4), considerations: considerations.slice(0, 4) };
}
