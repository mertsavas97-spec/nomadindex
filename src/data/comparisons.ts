import { getAllCountries, getCountryBySlug } from "@/data/countries";
import { getVisasByCountry, filterImmigrationPrograms } from "@/data/visa-programs";
import { formatCurrencyAmount } from "@/lib/format";
import { getMonthlyMinIncome } from "@/lib/income";
import { parseProcessingDays } from "@/lib/visa-types";
import type {
  Comparison,
  ComparisonRecommendation,
  ComparisonTableRow,
  CountryComparisonData,
  CountryPair,
  VerificationStatus,
  VisaProgram,
  VisaType,
} from "@/types/nomadindex";
import { DATA_DISCLAIMER } from "@/types/nomadindex";

/** Country slug pairs — canonical compare slugs are derived alphabetically. */
const FEATURED_COUNTRY_PAIRS = [
  ["portugal", "spain"],
  ["portugal", "uae"],
  ["italy", "spain"],
  ["croatia", "estonia"],
  ["thailand", "uae"],
  ["germany", "netherlands"],
] as const;

const POPULAR_COUNTRY_PAIRS = [
  ["portugal", "spain"],
  ["greece", "portugal"],
  ["thailand", "uae"],
  ["croatia", "romania"],
  ["italy", "malta"],
  ["australia", "canada"],
  ["ireland", "uk"],
  ["singapore", "uae"],
] as const;

const featuredComparisons = [
  {
    id: "pt-es",
    slug: "portugal-vs-spain",
    countryASlug: "portugal",
    countryBSlug: "spain",
    fields: [
      {
        label: "Digital nomad visa",
        valueA: "Yes — 1 year, renewable",
        valueB: "Yes — 1 year, renewable",
        highlight: null,
        verificationStatus: "in-progress",
      },
      {
        label: "Min. monthly income (nomad)",
        valueA: "€3,680/mo (est.)",
        valueB: "€2,763/mo (est.)",
        highlight: "b",
        verificationStatus: "in-progress",
      },
      {
        label: "Path to citizenship",
        valueA: "5 years",
        valueB: "10 years",
        highlight: "a",
        verificationStatus: "in-progress",
      },
      {
        label: "Tax regime for nomads",
        valueA: "NHR successor TBD",
        valueB: "Beckham Law option",
        highlight: "b",
        verificationStatus: "placeholder",
      },
      {
        label: "Processing time",
        valueA: "60–90 days",
        valueB: "20–45 days",
        highlight: "b",
        verificationStatus: "in-progress",
      },
      {
        label: "Family inclusion",
        valueA: "Yes",
        valueB: "Yes",
        highlight: null,
        verificationStatus: "verified",
      },
    ],
    lastUpdated: "2026-03-01",
    disclaimer: DATA_DISCLAIMER,
  },
] satisfies Comparison[];

export function getComparisonPairSlug(countryA: string, countryB: string): string {
  return [countryA, countryB].sort().join("-vs-");
}

const FEATURED_PAIR_SLUGS = FEATURED_COUNTRY_PAIRS.map(([a, b]) =>
  getComparisonPairSlug(a, b)
);

const POPULAR_PAIR_SLUGS = POPULAR_COUNTRY_PAIRS.map(([a, b]) =>
  getComparisonPairSlug(a, b)
);

function deriveCompareLastUpdated(
  countryA: { lastReviewed: string; lastUpdated: string },
  countryB: { lastReviewed: string; lastUpdated: string },
  visasA: VisaProgram[],
  visasB: VisaProgram[]
): string {
  const dates = [
    countryA.lastReviewed,
    countryB.lastReviewed,
    countryA.lastUpdated,
    countryB.lastUpdated,
    ...visasA.map((v) => v.lastVerified),
    ...visasB.map((v) => v.lastVerified),
    ...visasA.map((v) => v.lastReviewed),
    ...visasB.map((v) => v.lastReviewed),
  ];

  return dates.sort().reverse()[0] ?? countryA.lastReviewed;
}

export function parseComparisonPairSlug(
  pair: string
): { countryASlug: string; countryBSlug: string } | null {
  const parts = pair.split("-vs-");
  if (parts.length !== 2) {
    return null;
  }

  const [countryASlug, countryBSlug] = parts;
  const countryA = getCountryBySlug(countryASlug);
  const countryB = getCountryBySlug(countryBSlug);

  if (!countryA || !countryB || countryASlug === countryBSlug) {
    return null;
  }

  const canonical = getComparisonPairSlug(countryASlug, countryBSlug);
  if (canonical !== pair) {
    return null;
  }

  return { countryASlug, countryBSlug };
}

export function getAllCountryPairs(): CountryPair[] {
  const all = getAllCountries();
  const pairs: CountryPair[] = [];

  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const countryASlug = all[i].slug;
      const countryBSlug = all[j].slug;
      pairs.push({
        slug: getComparisonPairSlug(countryASlug, countryBSlug),
        countryASlug,
        countryBSlug,
      });
    }
  }

  return pairs;
}

function getImmigrationVisas(countrySlug: string) {
  return filterImmigrationPrograms(getVisasByCountry(countrySlug));
}

export function getCountryMinIncomeRange(countrySlug: string): string {
  const visas = getImmigrationVisas(countrySlug);
  const withIncome = visas.filter((v) => getMonthlyMinIncome(v) !== null);

  if (withIncome.length === 0) {
    return "Varies / not specified";
  }

  const amounts = withIncome.map((v) => getMonthlyMinIncome(v)!);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const currency = withIncome[0].currency;
  const suffix = " / mo (est.)";

  if (min === max) {
    return `${formatCurrencyAmount(min, currency)}${suffix}`;
  }

  return `${formatCurrencyAmount(min, currency)}–${formatCurrencyAmount(max, currency)}${suffix}`;
}

export function getCountryProcessingRange(countrySlug: string): string {
  const visas = getImmigrationVisas(countrySlug);
  const dayValues = visas
    .map((v) => parseProcessingDays(v.processingTime))
    .filter((d) => Number.isFinite(d));

  if (dayValues.length === 0) {
    return "Varies";
  }

  const minDays = Math.min(...dayValues);
  const maxDays = Math.max(...dayValues);

  if (minDays === maxDays) {
    const match = visas.find(
      (v) => parseProcessingDays(v.processingTime) === minDays
    );
    return match?.processingTime ?? `${minDays} days`;
  }

  return `${minDays}–${maxDays} days`;
}

export function getCountryFeeRange(countrySlug: string): string {
  const visas = getImmigrationVisas(countrySlug);
  const withFee = visas.filter((v) => v.applicationFee !== null);

  if (withFee.length === 0) {
    return "Varies / not specified";
  }

  const amounts = withFee.map((v) => v.applicationFee!);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const currency = withFee[0].currency;

  if (min === max) {
    return `${formatCurrencyAmount(min, currency)} (est.)`;
  }

  return `${formatCurrencyAmount(min, currency)}–${formatCurrencyAmount(max, currency)} (est.)`;
}

function getVisasByType(countrySlug: string, type: VisaType): VisaProgram[] {
  return getImmigrationVisas(countrySlug).filter((v) => v.type === type);
}

function formatVisaTypeAvailability(
  countrySlug: string,
  type: VisaType,
  countryFlag: boolean
): string {
  const programs = getVisasByType(countrySlug, type);

  if (!countryFlag && programs.length === 0) {
    return "No / limited";
  }

  if (programs.length === 0) {
    return countryFlag ? "Yes (details vary)" : "No / limited";
  }

  if (programs.length === 1) {
    return `Yes — ${programs[0].name}`;
  }

  return `Yes — ${programs.length} programs`;
}

function getFamilyInclusionSummary(countrySlug: string): string {
  const visas = getImmigrationVisas(countrySlug);
  const withFamily = visas.filter((v) => v.familyAllowed);

  if (withFamily.length === 0) {
    return "Limited";
  }

  if (withFamily.length === visas.length) {
    return "Yes — all tracked programs";
  }

  return `Yes — ${withFamily.length} of ${visas.length} programs`;
}

function getTaxSummary(countrySlug: string): string {
  const visas = getImmigrationVisas(countrySlug);
  const notes = [...new Set(visas.map((v) => v.taxNotes).filter(Boolean))];

  if (notes.length === 0) {
    return "Varies — consult a tax advisor";
  }

  const combined = notes.slice(0, 2).join(" ");
  return combined.length > 160 ? `${combined.slice(0, 157)}…` : combined;
}

function getResidencyPathwaySummary(countrySlug: string): string {
  const visas = getImmigrationVisas(countrySlug);
  const residencyTypes: VisaType[] = [
    "residency",
    "passive-income",
    "investor",
    "work",
  ];
  const residencyPrograms = visas.filter((v) => residencyTypes.includes(v.type));
  const renewable = residencyPrograms.filter((v) => v.renewable).length;

  if (residencyPrograms.length === 0) {
    return "No dedicated residency routes tracked";
  }

  const typeLabels = [
    ...new Set(residencyPrograms.map((v) => v.type.replace("-", " "))),
  ].join(", ");

  return `${residencyPrograms.length} route${residencyPrograms.length === 1 ? "" : "s"} (${typeLabels}); ${renewable} renewable`;
}

function getLifestyleContextSummary(countrySlug: string): string {
  const country = getCountryBySlug(countrySlug);
  if (!country) {
    return "Not specified";
  }

  const regionNote =
    country.region === "Europe"
      ? "EU/Schengen context may apply"
      : country.region;

  const summaryLead = country.summary.split(/[.!]/)[0]?.trim();
  const hook = summaryLead ? `${summaryLead}.` : "";

  return `${country.capital} (${country.currency}) · ${regionNote}${hook ? ` · ${hook}` : ""}`;
}

function getFamilyRelocationScore(countrySlug: string): number {
  const visas = getImmigrationVisas(countrySlug);
  return visas.filter((v) => v.familyAllowed).length;
}

function getFreelancerProgramCount(countrySlug: string): number {
  return getVisasByType(countrySlug, "freelancer").length;
}

function getCountryVerificationSummary(countrySlug: string): string {
  const visas = getImmigrationVisas(countrySlug);

  if (visas.some((v) => v.verificationStatus === "placeholder")) {
    return "Includes estimates";
  }

  if (visas.some((v) => v.verificationStatus === "in-progress")) {
    return "Source review";
  }

  if (visas.every((v) => v.verificationStatus === "verified")) {
    return "Dataset verified";
  }

  return "Source review";
}

function worstVerificationStatus(
  statusA: VerificationStatus,
  statusB: VerificationStatus
): VerificationStatus {
  const rank: Record<VerificationStatus, number> = {
    placeholder: 0,
    "in-progress": 1,
    verified: 2,
  };

  return rank[statusA] <= rank[statusB] ? statusA : statusB;
}

function compareNumeric(
  valueA: number | null,
  valueB: number | null,
  lowerIsBetter: boolean
): "a" | "b" | null {
  if (valueA === null || valueB === null) {
    return null;
  }

  if (valueA === valueB) {
    return null;
  }

  return lowerIsBetter
    ? valueA < valueB
      ? "a"
      : "b"
    : valueA > valueB
      ? "a"
      : "b";
}

function getLowestMinIncome(countrySlug: string): number | null {
  const visas = getImmigrationVisas(countrySlug);
  const incomes = visas
    .map((v) => getMonthlyMinIncome(v))
    .filter((v): v is number => v !== null);

  return incomes.length > 0 ? Math.min(...incomes) : null;
}

function getFastestProcessingDays(countrySlug: string): number | null {
  const visas = getImmigrationVisas(countrySlug);
  const days = visas
    .map((v) => parseProcessingDays(v.processingTime))
    .filter((d) => Number.isFinite(d));

  return days.length > 0 ? Math.min(...days) : null;
}

function buildRecommendations(
  countryASlug: string,
  countryBSlug: string
): ComparisonRecommendation[] {
  const countryA = getCountryBySlug(countryASlug)!;
  const countryB = getCountryBySlug(countryBSlug)!;

  const nomadA = countryA.hasDigitalNomadVisa;
  const nomadB = countryB.hasDigitalNomadVisa;
  const startupA = countryA.hasStartupVisa;
  const startupB = countryB.hasStartupVisa;
  const freelancerA = countryA.hasFreelancerVisa;
  const freelancerB = countryB.hasFreelancerVisa;
  const incomeA = getLowestMinIncome(countryASlug);
  const incomeB = getLowestMinIncome(countryBSlug);
  const processingA = getFastestProcessingDays(countryASlug);
  const processingB = getFastestProcessingDays(countryBSlug);
  const familyScoreA = getFamilyRelocationScore(countryASlug);
  const familyScoreB = getFamilyRelocationScore(countryBSlug);
  const freelancerCountA = getFreelancerProgramCount(countryASlug);
  const freelancerCountB = getFreelancerProgramCount(countryBSlug);

  let remoteWinner: string | null = null;
  let remoteSummary =
    "both countries show comparable remote-work visa coverage in tracked programs.";

  if (nomadA && !nomadB) {
    remoteWinner = countryASlug;
    remoteSummary = `${countryA.name} lists a clearer dedicated digital nomad route than ${countryB.name}.`;
  } else if (nomadB && !nomadA) {
    remoteWinner = countryBSlug;
    remoteSummary = `${countryB.name} lists a clearer dedicated digital nomad route than ${countryA.name}.`;
  } else if (incomeA !== null && incomeB !== null && incomeA !== incomeB) {
    remoteWinner = incomeA < incomeB ? countryASlug : countryBSlug;
    remoteSummary = `${remoteWinner === countryASlug ? countryA.name : countryB.name} shows a lower minimum income among tracked remote-work programs.`;
  } else if (processingA !== null && processingB !== null && processingA !== processingB) {
    remoteWinner = processingA < processingB ? countryASlug : countryBSlug;
    remoteSummary = `${remoteWinner === countryASlug ? countryA.name : countryB.name} tends toward faster processing times on tracked routes.`;
  }

  let startupWinner: string | null = null;
  let startupSummary =
    "both countries list startup or founder-friendly routes in tracked data.";

  if (startupA && !startupB) {
    startupWinner = countryASlug;
    startupSummary = `${countryA.name} lists more established startup visa options than ${countryB.name}.`;
  } else if (startupB && !startupA) {
    startupWinner = countryBSlug;
    startupSummary = `${countryB.name} lists more established startup visa options than ${countryA.name}.`;
  } else {
    const startupCountA = getVisasByType(countryASlug, "startup").length;
    const startupCountB = getVisasByType(countryBSlug, "startup").length;
    if (startupCountA !== startupCountB) {
      startupWinner =
        startupCountA > startupCountB ? countryASlug : countryBSlug;
      startupSummary = `${startupWinner === countryASlug ? countryA.name : countryB.name} tracks more startup-focused programs in this pairing.`;
    }
  }

  let freelancerWinner: string | null = null;
  let freelancerSummary =
    "freelancer visa availability is similar or limited on both sides.";

  if (freelancerA && !freelancerB) {
    freelancerWinner = countryASlug;
    freelancerSummary = `${countryA.name} lists clearer freelancer visa routes than ${countryB.name}.`;
  } else if (freelancerB && !freelancerA) {
    freelancerWinner = countryBSlug;
    freelancerSummary = `${countryB.name} lists clearer freelancer visa routes than ${countryA.name}.`;
  } else if (freelancerCountA !== freelancerCountB) {
    freelancerWinner =
      freelancerCountA > freelancerCountB ? countryASlug : countryBSlug;
    freelancerSummary = `${freelancerWinner === countryASlug ? countryA.name : countryB.name} tracks more freelancer-type programs in this pairing.`;
  }

  let familyWinner: string | null = null;
  let familySummary =
    "family inclusion rules are broadly comparable across tracked programs.";

  if (familyScoreA !== familyScoreB) {
    familyWinner =
      familyScoreA > familyScoreB ? countryASlug : countryBSlug;
    familySummary = `${familyWinner === countryASlug ? countryA.name : countryB.name} has more tracked programs that allow family inclusion (${Math.max(familyScoreA, familyScoreB)} vs ${Math.min(familyScoreA, familyScoreB)}).`;
  }

  const incomeWinner =
    incomeA !== null && incomeB !== null && incomeA !== incomeB
      ? incomeA < incomeB
        ? countryASlug
        : countryBSlug
      : null;
  const incomeSummary =
    incomeWinner === null
      ? "minimum income requirements are similar or not directly comparable across tracked programs."
      : `${incomeWinner === countryASlug ? countryA.name : countryB.name} has a lower minimum income among tracked programs in this pairing.`;

  let citizenshipWinner: string | null = null;
  let citizenshipSummary =
    "citizenship timelines are similar or unavailable in tracked country records.";

  if (countryA.citizenshipYears && countryB.citizenshipYears) {
    if (countryA.citizenshipYears !== countryB.citizenshipYears) {
      citizenshipWinner =
        countryA.citizenshipYears < countryB.citizenshipYears
          ? countryASlug
          : countryBSlug;
      citizenshipSummary = `${citizenshipWinner === countryASlug ? countryA.name : countryB.name} has a shorter published citizenship timeline (${Math.min(countryA.citizenshipYears, countryB.citizenshipYears)} vs ${Math.max(countryA.citizenshipYears, countryB.citizenshipYears)} years).`;
    }
  } else if (countryA.citizenshipYears && !countryB.citizenshipYears) {
    citizenshipWinner = countryASlug;
    citizenshipSummary = `${countryA.name} publishes a clearer citizenship timeline than ${countryB.name} in country records.`;
  } else if (!countryA.citizenshipYears && countryB.citizenshipYears) {
    citizenshipWinner = countryBSlug;
    citizenshipSummary = `${countryB.name} publishes a clearer citizenship timeline than ${countryA.name} in country records.`;
  }

  return [
    {
      id: "remote-workers",
      label: "Remote work routes",
      winnerSlug: remoteWinner,
      summary: remoteSummary,
    },
    {
      id: "freelancers",
      label: "Freelancer routes",
      winnerSlug: freelancerWinner,
      summary: freelancerSummary,
    },
    {
      id: "startup-founders",
      label: "Startup routes",
      winnerSlug: startupWinner,
      summary: startupSummary,
    },
    {
      id: "family-relocation",
      label: "Family relocation",
      winnerSlug: familyWinner,
      summary: familySummary,
    },
    {
      id: "low-income",
      label: "Lower income thresholds",
      winnerSlug: incomeWinner,
      summary: incomeSummary,
    },
    {
      id: "citizenship",
      label: "Citizenship timeline",
      winnerSlug: citizenshipWinner,
      summary: citizenshipSummary,
    },
  ];
}

export function getCountryComparisonData(
  countryASlug: string,
  countryBSlug: string
): CountryComparisonData | null {
  const [slugA, slugB] = [countryASlug, countryBSlug].sort();
  const countryA = getCountryBySlug(slugA);
  const countryB = getCountryBySlug(slugB);

  if (!countryA || !countryB || slugA === slugB) {
    return null;
  }

  const visasA = getImmigrationVisas(slugA);
  const visasB = getImmigrationVisas(slugB);

  const incomeA = getLowestMinIncome(slugA);
  const incomeB = getLowestMinIncome(slugB);
  const processingA = getFastestProcessingDays(slugA);
  const processingB = getFastestProcessingDays(slugB);
  const citizenshipHighlight = compareNumeric(
    countryA.citizenshipYears,
    countryB.citizenshipYears,
    true
  );

  const familyScoreA = getFamilyRelocationScore(slugA);
  const familyScoreB = getFamilyRelocationScore(slugB);
  const familyHighlight = compareNumeric(familyScoreA, familyScoreB, false);

  const rows: ComparisonTableRow[] = [
    {
      label: "Digital nomad visa",
      category: "remote-work",
      valueA: formatVisaTypeAvailability(
        slugA,
        "digital-nomad",
        countryA.hasDigitalNomadVisa
      ),
      valueB: formatVisaTypeAvailability(
        slugB,
        "digital-nomad",
        countryB.hasDigitalNomadVisa
      ),
      highlight:
        countryA.hasDigitalNomadVisa && !countryB.hasDigitalNomadVisa
          ? "a"
          : !countryA.hasDigitalNomadVisa && countryB.hasDigitalNomadVisa
            ? "b"
            : null,
      verificationStatus: "in-progress",
    },
    {
      label: "Freelancer visa",
      category: "freelancer",
      valueA: formatVisaTypeAvailability(
        slugA,
        "freelancer",
        countryA.hasFreelancerVisa
      ),
      valueB: formatVisaTypeAvailability(
        slugB,
        "freelancer",
        countryB.hasFreelancerVisa
      ),
      highlight:
        countryA.hasFreelancerVisa && !countryB.hasFreelancerVisa
          ? "a"
          : !countryA.hasFreelancerVisa && countryB.hasFreelancerVisa
            ? "b"
            : null,
      verificationStatus: "in-progress",
    },
    {
      label: "Startup visa",
      category: "startup",
      valueA: formatVisaTypeAvailability(
        slugA,
        "startup",
        countryA.hasStartupVisa
      ),
      valueB: formatVisaTypeAvailability(
        slugB,
        "startup",
        countryB.hasStartupVisa
      ),
      highlight:
        countryA.hasStartupVisa && !countryB.hasStartupVisa
          ? "a"
          : !countryA.hasStartupVisa && countryB.hasStartupVisa
            ? "b"
            : null,
      verificationStatus: "in-progress",
    },
    {
      label: "Family inclusion",
      category: "family",
      valueA: getFamilyInclusionSummary(slugA),
      valueB: getFamilyInclusionSummary(slugB),
      highlight: familyHighlight,
      verificationStatus: "verified",
    },
    {
      label: "Residency pathways",
      category: "residency",
      valueA: getResidencyPathwaySummary(slugA),
      valueB: getResidencyPathwaySummary(slugB),
      highlight: null,
      verificationStatus: "in-progress",
    },
    {
      label: "Citizenship path",
      category: "citizenship",
      valueA: countryA.citizenshipYears
        ? `${countryA.citizenshipYears} years`
        : "Not available",
      valueB: countryB.citizenshipYears
        ? `${countryB.citizenshipYears} years`
        : "Not available",
      highlight: citizenshipHighlight,
      verificationStatus: "placeholder",
    },
    {
      label: "Minimum income range",
      category: "cost",
      valueA: getCountryMinIncomeRange(slugA),
      valueB: getCountryMinIncomeRange(slugB),
      highlight: compareNumeric(incomeA, incomeB, true),
      verificationStatus: worstVerificationStatus(
        "in-progress",
        "in-progress"
      ),
    },
    {
      label: "Application fee range",
      category: "cost",
      valueA: getCountryFeeRange(slugA),
      valueB: getCountryFeeRange(slugB),
      highlight: null,
      verificationStatus: "placeholder",
    },
    {
      label: "Processing time range",
      category: "cost",
      valueA: getCountryProcessingRange(slugA),
      valueB: getCountryProcessingRange(slugB),
      highlight: compareNumeric(processingA, processingB, true),
      verificationStatus: "placeholder",
    },
    {
      label: "Tax notes",
      category: "tax",
      valueA: getTaxSummary(slugA),
      valueB: getTaxSummary(slugB),
      highlight: null,
      verificationStatus: "placeholder",
    },
    {
      label: "Lifestyle & location context",
      category: "lifestyle",
      valueA: getLifestyleContextSummary(slugA),
      valueB: getLifestyleContextSummary(slugB),
      highlight: null,
      verificationStatus: "verified",
    },
    {
      label: "Data status",
      category: "meta",
      valueA: getCountryVerificationSummary(slugA),
      valueB: getCountryVerificationSummary(slugB),
      highlight: null,
      verificationStatus: "in-progress",
    },
  ];

  const hasUnverifiedData = [...visasA, ...visasB].some(
    (v) =>
      v.verificationStatus === "in-progress" ||
      v.verificationStatus === "placeholder"
  );

  return {
    slug: getComparisonPairSlug(slugA, slugB),
    countryASlug: slugA,
    countryBSlug: slugB,
    countryA,
    countryB,
    rows,
    recommendations: buildRecommendations(slugA, slugB),
    visasA,
    visasB,
    lastUpdated: deriveCompareLastUpdated(countryA, countryB, visasA, visasB),
    hasUnverifiedData,
  };
}

export function getRelatedComparisons(
  countryASlug: string,
  countryBSlug: string,
  limit = 6
): CountryPair[] {
  const currentSlug = getComparisonPairSlug(countryASlug, countryBSlug);

  return getAllCountryPairs()
    .filter(
      (pair) =>
        pair.slug !== currentSlug &&
        (pair.countryASlug === countryASlug ||
          pair.countryBSlug === countryASlug ||
          pair.countryASlug === countryBSlug ||
          pair.countryBSlug === countryBSlug)
    )
    .slice(0, limit);
}

export function getComparisonsForCountry(
  countrySlug: string,
  limit = 6
): CountryPair[] {
  return getAllCountryPairs()
    .filter(
      (pair) =>
        pair.countryASlug === countrySlug || pair.countryBSlug === countrySlug
    )
    .slice(0, limit);
}

const PRIORITY_COMPARISON_SLUGS = [
  ...FEATURED_PAIR_SLUGS,
  ...POPULAR_PAIR_SLUGS,
] as const;

export function getFeaturedComparisonsForCountry(
  countrySlug: string,
  limit = 4
): CountryPair[] {
  const involving = getAllCountryPairs().filter(
    (pair) =>
      pair.countryASlug === countrySlug || pair.countryBSlug === countrySlug
  );

  const priorityOrder = new Map<string, number>(
    PRIORITY_COMPARISON_SLUGS.map((slug, index) => [slug, index])
  );

  return [...involving]
    .sort((a, b) => {
      const aRank = priorityOrder.get(a.slug) ?? Number.POSITIVE_INFINITY;
      const bRank = priorityOrder.get(b.slug) ?? Number.POSITIVE_INFINITY;
      if (aRank !== bRank) {
        return aRank - bRank;
      }
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit);
}

export function getFeaturedComparisonPairs(): CountryPair[] {
  return FEATURED_PAIR_SLUGS.flatMap((slug) => {
    const parsed = parseComparisonPairSlug(slug);
    if (!parsed) {
      return [];
    }
    return [
      {
        slug,
        countryASlug: parsed.countryASlug,
        countryBSlug: parsed.countryBSlug,
      },
    ];
  });
}

export function getPopularComparisonPairs(): CountryPair[] {
  return POPULAR_PAIR_SLUGS.flatMap((slug) => {
    const parsed = parseComparisonPairSlug(slug);
    if (!parsed) {
      return [];
    }
    return [
      {
        slug,
        countryASlug: parsed.countryASlug,
        countryBSlug: parsed.countryBSlug,
      },
    ];
  });
}

function findFeaturedComparison(
  countryA: string,
  countryB: string
): Comparison | undefined {
  const [slugA, slugB] = [countryA, countryB].sort();
  return featuredComparisons.find(
    (c) => c.countryASlug === slugA && c.countryBSlug === slugB
  );
}

export function getComparePair(
  countryA: string,
  countryB: string
): Comparison | null {
  const featured = findFeaturedComparison(countryA, countryB);
  if (featured) {
    return featured;
  }

  const data = getCountryComparisonData(countryA, countryB);
  if (!data) {
    return null;
  }

  return {
    id: data.slug,
    slug: data.slug,
    countryASlug: data.countryASlug,
    countryBSlug: data.countryBSlug,
    fields: data.rows.map((row) => ({
      label: row.label,
      valueA: row.valueA,
      valueB: row.valueB,
      highlight: row.highlight,
      verificationStatus: row.verificationStatus,
    })),
    lastUpdated: data.lastUpdated,
    disclaimer: DATA_DISCLAIMER,
  };
}

export function getFeaturedComparison(): Comparison {
  return featuredComparisons[0];
}

export function comparisonToRows(comparison: Comparison) {
  return comparison.fields.map((field) => ({
    label: field.label,
    left: field.valueA,
    right: field.valueB,
    highlight:
      field.highlight === "a"
        ? ("left" as const)
        : field.highlight === "b"
          ? ("right" as const)
          : undefined,
    verificationStatus: field.verificationStatus,
  }));
}

export function hasUnverifiedFields(comparison: Comparison): boolean {
  return comparison.fields.some(
    (f) =>
      f.verificationStatus === "in-progress" ||
      f.verificationStatus === "placeholder"
  );
}

export function comparisonDataToPreviewRows(data: CountryComparisonData) {
  const previewLabels = [
    "Digital nomad visa",
    "Minimum income range",
    "Citizenship path",
    "Family inclusion",
    "Residency pathways",
    "Processing time range",
  ];

  return previewLabels
    .map((label) => data.rows.find((row) => row.label === label))
    .filter((row): row is ComparisonTableRow => row !== undefined)
    .map((row) => ({
      label: row.label,
      left: row.valueA,
      right: row.valueB,
      highlight:
        row.highlight === "a"
          ? ("left" as const)
          : row.highlight === "b"
            ? ("right" as const)
            : undefined,
      verificationStatus: row.verificationStatus,
    }));
}
