import { formatMinIncome } from "@/lib/format";
import { getMonthlyMinIncome } from "@/lib/income";
import { VISA_TYPE_LABELS } from "@/lib/visa-types";
import type { FaqItem } from "@/lib/seo";
import type {
  ComparisonRecommendation,
  CountryComparisonData,
  VisaProgram,
  VisaType,
} from "@/types/nomadindex";
import {
  DATA_DISCLAIMER,
  LEGAL_NOTICE,
} from "@/types/nomadindex";

export type CompareContentSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ComparePageContent = {
  quickAnswer: string;
  editorialSummary: string[];
  keyTakeaways: string[];
  chooseCountryA: CompareContentSection;
  chooseCountryB: CompareContentSection;
  costComparison: CompareContentSection;
  taxComparison: CompareContentSection;
  residencyCitizenship: CompareContentSection;
  remoteWorkerSuitability: CompareContentSection;
  freelancerSuitability: CompareContentSection;
  founderSuitability: CompareContentSection;
  familyRelocation: CompareContentSection;
  lifestyleComparison: CompareContentSection;
  faqs: FaqItem[];
  wordCount: number;
};

function countWords(parts: string[]): number {
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

function rowValue(
  data: CountryComparisonData,
  label: string,
  side: "a" | "b"
): string {
  const row = data.rows.find((r) => r.label === label);
  if (!row) {
    return "Not specified in dataset";
  }
  return side === "a" ? row.valueA : row.valueB;
}

function programsByType(visas: VisaProgram[], type: VisaType): VisaProgram[] {
  return visas.filter((v) => v.type === type);
}

function formatProgramList(programs: VisaProgram[]): string {
  if (programs.length === 0) {
    return "none tracked";
  }
  return programs.map((p) => p.name).join(", ");
}

function formatProgramIncomeDetails(programs: VisaProgram[]): string[] {
  return programs
    .filter((p) => p.minIncome !== null)
    .map((p) => {
      const monthly = getMonthlyMinIncome(p);
      const formatted = formatMinIncome(p);
      const monthlyNote =
        monthly !== null && p.incomePeriod === "annual"
          ? ` (~${monthly.toLocaleString()} ${p.currency}/mo equivalent)`
          : "";
      return `${p.name}: ${formatted}${monthlyNote}`;
    });
}

function recommendationFor(
  recommendations: ComparisonRecommendation[],
  id: string
): ComparisonRecommendation | undefined {
  return recommendations.find((r) => r.id === id);
}

function uniqueTypes(visas: VisaProgram[]): string {
  return [...new Set(visas.map((v) => VISA_TYPE_LABELS[v.type]))].join(", ") || "multiple categories";
}

function winsForCountry(
  data: CountryComparisonData,
  slug: string
): ComparisonRecommendation[] {
  return data.recommendations.filter((r) => r.winnerSlug === slug);
}

function buildEditorialSummary(data: CountryComparisonData): string[] {
  const { countryA, countryB, visasA, visasB, recommendations } = data;
  const winsA = winsForCountry(data, data.countryASlug);
  const winsB = winsForCountry(data, data.countryBSlug);
  const sameRegion = countryA.region === countryB.region;
  const regionNote = sameRegion
    ? `Both sit in ${countryA.region}, which may simplify regional mobility planning but narrows lifestyle differentiation.`
    : `${countryA.name} (${countryA.region}) and ${countryB.name} (${countryB.region}) represent different regional contexts for relocation — visa rules, tax treatment and long-term settlement options diverge accordingly.`;

  const programDelta =
    visasA.length === visasB.length
      ? `Each country tracks ${visasA.length} immigration programs in this pairing.`
      : `${countryA.name} lists ${visasA.length} programs versus ${visasB.length} for ${countryB.name} — route breadth differs even when headline visa types look similar.`;

  const heuristicNote =
    winsA.length === 0 && winsB.length === 0
      ? "No single country leads every heuristic category in tracked data; your profile (remote work, freelancing, founding, family needs) should drive which side you explore first."
      : winsA.length > winsB.length
        ? `${countryA.name} leads ${winsA.length} of ${recommendations.length} heuristic categories (${winsA.map((w) => w.label.toLowerCase()).join(", ")}), while ${countryB.name} leads ${winsB.length}${winsB.length > 0 ? ` (${winsB.map((w) => w.label.toLowerCase()).join(", ")})` : ""}.`
        : winsB.length > winsA.length
          ? `${countryB.name} leads ${winsB.length} of ${recommendations.length} heuristic categories (${winsB.map((w) => w.label.toLowerCase()).join(", ")}), while ${countryA.name} leads ${winsA.length}${winsA.length > 0 ? ` (${winsA.map((w) => w.label.toLowerCase()).join(", ")})` : ""}.`
          : `Each country leads ${winsA.length} heuristic categories — the pairing is balanced on paper, but specific programs may still fit one profile better.`;

  return [
    `Choosing between ${countryA.name} and ${countryB.name} for visa, residency or relocation planning means weighing ${uniqueTypes(visasA)} routes against ${uniqueTypes(visasB)} options — not picking a universal winner. ${programDelta}`,
    regionNote,
    heuristicNote,
  ];
}

function buildChooseCountry(
  data: CountryComparisonData,
  side: "a" | "b"
): CompareContentSection {
  const country = side === "a" ? data.countryA : data.countryB;
  const other = side === "a" ? data.countryB : data.countryA;
  const visas = side === "a" ? data.visasA : data.visasB;
  const otherVisas = side === "a" ? data.visasB : data.visasA;
  const slug = side === "a" ? data.countryASlug : data.countryBSlug;
  const otherSide = side === "a" ? "b" : "a";

  const wins = winsForCountry(data, slug);
  const nomadPrograms = programsByType(visas, "digital-nomad");
  const freelancerPrograms = programsByType(visas, "freelancer");
  const startupPrograms = programsByType(visas, "startup");
  const passivePrograms = programsByType(visas, "passive-income");

  const topProgram = visas[0]?.name ?? "linked program pages";
  const distinctive =
    nomadPrograms.length > programsByType(otherVisas, "digital-nomad").length
      ? `stronger digital nomad coverage (${formatProgramList(nomadPrograms)})`
      : freelancerPrograms.length >
          programsByType(otherVisas, "freelancer").length
        ? `more freelancer routes (${formatProgramList(freelancerPrograms)})`
        : startupPrograms.length >
            programsByType(otherVisas, "startup").length
          ? `broader startup pathways (${formatProgramList(startupPrograms)})`
          : `residency depth (${rowValue(data, "Residency pathways", side)})`;

  const paragraphs = [
    `Who should choose ${country.name}? Remote workers, freelancers, founders and families evaluating ${country.name} against ${other.name} should start here if ${distinctive} matches their relocation goal.`,
    wins.length > 0
      ? `${country.name} leads tracked heuristics for ${wins.map((w) => w.label.toLowerCase()).join(", ")} in this pairing. That signals relative strength on those dimensions — not guaranteed eligibility or approval.`
      : `${country.name} does not lead any heuristic category outright, but may still fit if a specific route — such as ${topProgram} — matches your income, family and timeline constraints better than ${other.name} alternatives.`,
    `${country.summary}`,
    `Next step: compare ${formatProgramList(nomadPrograms)} and ${formatProgramList(startupPrograms)} on their program pages, then cross-check ${rowValue(data, "Family inclusion", side)} family rules and ${rowValue(data, "Citizenship path", side)} citizenship horizon against ${other.name} (${rowValue(data, "Citizenship path", otherSide)}). ${DATA_DISCLAIMER}`,
  ];

  const bullets = [
    `Programs tracked: ${visas.length} (${other.name}: ${otherVisas.length})`,
    `Digital nomad: ${formatProgramList(nomadPrograms)}`,
    `Freelancer: ${formatProgramList(freelancerPrograms)}`,
    `Startup: ${formatProgramList(startupPrograms)}`,
    ...(passivePrograms.length > 0
      ? [`Passive income: ${formatProgramList(passivePrograms)}`]
      : []),
    ...formatProgramIncomeDetails(
      [...nomadPrograms, ...freelancerPrograms].slice(0, 3)
    ),
  ];

  return {
    id: side === "a" ? "choose-country-a" : "choose-country-b",
    heading: `Who should choose ${country.name}?`,
    paragraphs,
    bullets,
  };
}

function buildCostComparison(data: CountryComparisonData): CompareContentSection {
  const { countryA, countryB, visasA, visasB } = data;
  const incomeRec = recommendationFor(data.recommendations, "low-income");

  const lowestFeeA = visasA
    .filter((v) => v.applicationFee !== null)
    .sort((a, b) => a.applicationFee! - b.applicationFee!)[0];
  const lowestFeeB = visasB
    .filter((v) => v.applicationFee !== null)
    .sort((a, b) => a.applicationFee! - b.applicationFee!)[0];

  return {
    id: "cost-comparison",
    heading: `How do ${countryA.name} and ${countryB.name} compare on visa costs?`,
    paragraphs: [
      `Cost comparison covers application fees, income proof thresholds and processing timelines — not city-level living expenses. See the Cost rows in the table above for headline ranges.`,
      `Lowest recorded application fees: ${lowestFeeA ? `${lowestFeeA.name} (${lowestFeeA.applicationFee} ${lowestFeeA.currency}) in ${countryA.name}` : `not recorded for ${countryA.name}`}; ${lowestFeeB ? `${lowestFeeB.name} (${lowestFeeB.applicationFee} ${lowestFeeB.currency}) in ${countryB.name}` : `not recorded for ${countryB.name}`}.`,
      incomeRec?.summary
        ? `Income threshold heuristic: ${incomeRec.summary}`
        : "Income thresholds are similar or not directly comparable across tracked programs.",
    ],
    bullets: formatProgramIncomeDetails(
      [...visasA, ...visasB].filter((v) => v.minIncome !== null).slice(0, 6)
    ),
  };
}

function buildTaxComparison(data: CountryComparisonData): CompareContentSection {
  const { countryA, countryB, visasA, visasB } = data;
  const taxNotesA = [...new Set(visasA.map((v) => v.taxNotes).filter(Boolean))];
  const taxNotesB = [...new Set(visasB.map((v) => v.taxNotes).filter(Boolean))];

  return {
    id: "tax-comparison",
    heading: `What are the tax differences between ${countryA.name} and ${countryB.name}?`,
    paragraphs: [
      `Tax treatment varies by visa type and personal circumstances. Program-level notes are summarised in the table; NomadIndex does not provide personalised tax advice.`,
      `${countryA.name} tax notes appear on ${taxNotesA.length} program summaries; ${countryB.name} on ${taxNotesB.length}. Remote-worker exemptions, flat-tax regimes and standard progressive rules may all apply depending on route and stay length.`,
      LEGAL_NOTICE,
    ],
    bullets: [
      ...taxNotesA.slice(0, 3).map((note) => `${countryA.name}: ${note}`),
      ...taxNotesB.slice(0, 3).map((note) => `${countryB.name}: ${note}`),
    ],
  };
}

function buildResidencyCitizenship(data: CountryComparisonData): CompareContentSection {
  const { countryA, countryB, visasA, visasB } = data;
  const citizenshipRec = recommendationFor(data.recommendations, "citizenship");
  const renewableA = visasA.filter((v) => v.renewable).length;
  const renewableB = visasB.filter((v) => v.renewable).length;
  const citizenshipPathA = visasA.filter((v) => v.citizenshipPath).length;
  const citizenshipPathB = visasB.filter((v) => v.citizenshipPath).length;

  return {
    id: "residency-citizenship",
    heading: `How do residency and citizenship pathways compare?`,
    paragraphs: [
      `Residency planning compares renewable permits, stay durations and long-term settlement routes. ${countryA.name}: ${rowValue(data, "Residency pathways", "a")}. ${countryB.name}: ${rowValue(data, "Residency pathways", "b")}.`,
      `Renewable programs: ${renewableA}/${visasA.length} (${countryA.name}) vs ${renewableB}/${visasB.length} (${countryB.name}). Programs mentioning citizenship path: ${citizenshipPathA} vs ${citizenshipPathB}.`,
      citizenshipRec?.summary ?? "Citizenship timelines are similar or unavailable in tracked records.",
    ],
    bullets: visasA
      .concat(visasB)
      .filter((p) => p.renewable || p.citizenshipPath)
      .slice(0, 8)
      .map(
        (p) =>
          `${p.countrySlug === data.countryASlug ? countryA.name : countryB.name} — ${p.name}: ${p.stayDuration}, renewable ${p.renewable ? "yes" : "no"}`
      ),
  };
}

function buildRemoteWorkerSuitability(data: CountryComparisonData): CompareContentSection {
  const { countryA, countryB, visasA, visasB } = data;
  const remoteRec = recommendationFor(data.recommendations, "remote-workers");
  const nomadA = programsByType(visasA, "digital-nomad");
  const nomadB = programsByType(visasB, "digital-nomad");

  return {
    id: "remote-worker-suitability",
    heading: `Which is better for remote workers: ${countryA.name} or ${countryB.name}?`,
    paragraphs: [
      `Remote work comparison focuses on dedicated digital nomad routes and location-independent employment rules. ${countryA.name}: ${formatProgramList(nomadA)}. ${countryB.name}: ${formatProgramList(nomadB)}.`,
      remoteRec?.summary ?? "Both countries show comparable remote-work coverage in tracked programs.",
      `Confirm whether your employment type (employed remote, self-employed, contractor) is permitted on each route before applying.`,
    ],
    bullets: [
      ...formatProgramIncomeDetails(nomadA),
      ...formatProgramIncomeDetails(nomadB),
    ],
  };
}

function buildFreelancerSuitability(data: CountryComparisonData): CompareContentSection {
  const { countryA, countryB, visasA, visasB } = data;
  const freelancerRec = recommendationFor(data.recommendations, "freelancers");
  const freelancerA = programsByType(visasA, "freelancer");
  const freelancerB = programsByType(visasB, "freelancer");

  return {
    id: "freelancer-suitability",
    heading: `Which is better for freelancers: ${countryA.name} or ${countryB.name}?`,
    paragraphs: [
      `Freelancer comparison covers self-employment and independent-contractor permits. ${countryA.name} tracks ${freelancerA.length} freelancer-type program(s); ${countryB.name} tracks ${freelancerB.length}.`,
      freelancerRec?.summary ?? "Freelancer visa availability is similar or limited on both sides.",
      `Some countries route freelancers through autónomo, self-employed or general work permits rather than a labelled freelancer visa — check linked programs for activity restrictions.`,
    ],
    bullets: [
      ...formatProgramIncomeDetails(freelancerA),
      ...formatProgramIncomeDetails(freelancerB),
    ],
  };
}

function buildFounderSuitability(data: CountryComparisonData): CompareContentSection {
  const { countryA, countryB, visasA, visasB } = data;
  const startupRec = recommendationFor(data.recommendations, "startup-founders");
  const startupA = programsByType(visasA, "startup");
  const startupB = programsByType(visasB, "startup");
  const investorA = programsByType(visasA, "investor");
  const investorB = programsByType(visasB, "investor");

  return {
    id: "founder-suitability",
    heading: `Which is better for startup founders: ${countryA.name} or ${countryB.name}?`,
    paragraphs: [
      `Founder comparison covers startup visas, investor routes and entrepreneur permits. ${countryA.name}: ${formatProgramList(startupA)} plus ${investorA.length} investor route(s). ${countryB.name}: ${formatProgramList(startupB)} plus ${investorB.length} investor route(s).`,
      startupRec?.summary ?? "Both countries list startup or founder-friendly routes in tracked data.",
      `Endorsement, capital and hiring requirements often sit outside summary fields — review requirement levels on each program page.`,
    ],
    bullets: [...startupA, ...startupB, ...investorA.slice(0, 2), ...investorB.slice(0, 2)].map(
      (p) =>
        `${p.name} (${p.countrySlug === data.countryASlug ? countryA.name : countryB.name}): ${p.requirementLevel} requirement`
    ),
  };
}

function buildFamilyRelocation(data: CountryComparisonData): CompareContentSection {
  const { countryA, countryB, visasA, visasB } = data;
  const familyRec = recommendationFor(data.recommendations, "family-relocation");
  const familyA = visasA.filter((v) => v.familyAllowed).length;
  const familyB = visasB.filter((v) => v.familyAllowed).length;

  return {
    id: "family-relocation",
    heading: `Which is better for family relocation: ${countryA.name} or ${countryB.name}?`,
    paragraphs: [
      `Family relocation compares dependent inclusion rules across tracked programs. ${countryA.name}: ${rowValue(data, "Family inclusion", "a")} (${familyA}/${visasA.length} programs allow family). ${countryB.name}: ${rowValue(data, "Family inclusion", "b")} (${familyB}/${visasB.length} programs).`,
      familyRec?.summary ?? "Family inclusion rules are broadly comparable across tracked programs.",
      `Dependent age limits, marriage documentation and separate income thresholds are program-specific — verify on official sources.`,
    ],
    bullets: [
      ...visasA
        .filter((v) => v.familyAllowed)
        .slice(0, 4)
        .map((p) => `${countryA.name} — ${p.name}: family allowed`),
      ...visasB
        .filter((v) => v.familyAllowed)
        .slice(0, 4)
        .map((p) => `${countryB.name} — ${p.name}: family allowed`),
    ],
  };
}

function buildLifestyleComparison(data: CountryComparisonData): CompareContentSection {
  const { countryA, countryB } = data;

  return {
    id: "lifestyle-comparison",
    heading: `How do lifestyle and location context differ?`,
    paragraphs: [
      `Lifestyle factors — climate, language, timezone, healthcare and expat community — are not scored in NomadIndex visa data. Context from country records: ${countryA.name} (${countryA.capital}, ${countryA.currency}, ${countryA.region}) vs ${countryB.name} (${countryB.capital}, ${countryB.currency}, ${countryB.region}).`,
      `${countryA.summary}`,
      `${countryB.summary}`,
    ],
    bullets: [
      `${countryA.name}: ${rowValue(data, "Lifestyle & location context", "a")}`,
      `${countryB.name}: ${rowValue(data, "Lifestyle & location context", "b")}`,
    ],
  };
}

function buildCompareFaqs(data: CountryComparisonData): FaqItem[] {
  const { countryA, countryB, visasA, visasB, recommendations } = data;
  const remoteRec = recommendationFor(recommendations, "remote-workers");
  const freelancerRec = recommendationFor(recommendations, "freelancers");
  const startupRec = recommendationFor(recommendations, "startup-founders");
  const familyRec = recommendationFor(recommendations, "family-relocation");
  const incomeRec = recommendationFor(recommendations, "low-income");
  const citizenshipRec = recommendationFor(recommendations, "citizenship");

  const featuredA = visasA.slice(0, 2).map((p) => p.name).join(", ");
  const featuredB = visasB.slice(0, 2).map((p) => p.name).join(", ");

  return [
    {
      question: `Is ${countryA.name} or ${countryB.name} better for digital nomads?`,
      answer: `${countryA.name}: ${rowValue(data, "Digital nomad visa", "a")} (${formatProgramList(programsByType(visasA, "digital-nomad"))}). ${countryB.name}: ${rowValue(data, "Digital nomad visa", "b")} (${formatProgramList(programsByType(visasB, "digital-nomad"))}). ${remoteRec?.summary ?? "Comparable remote-work coverage."}`,
    },
    {
      question: `Which country is better for freelancers — ${countryA.name} or ${countryB.name}?`,
      answer: `${countryA.name} tracks ${programsByType(visasA, "freelancer").length} freelancer route(s); ${countryB.name} tracks ${programsByType(visasB, "freelancer").length}. ${freelancerRec?.summary ?? "Freelancer availability is similar or limited on both sides."}`,
    },
    {
      question: `Which is better for startup founders: ${countryA.name} vs ${countryB.name}?`,
      answer: `${rowValue(data, "Startup visa", "a")} vs ${rowValue(data, "Startup visa", "b")}. ${startupRec?.summary ?? "Both list founder routes."} Key programs: ${formatProgramList(programsByType(visasA, "startup"))} (${countryA.name}) vs ${formatProgramList(programsByType(visasB, "startup"))} (${countryB.name}).`,
    },
    {
      question: `Can families relocate to ${countryA.name} or ${countryB.name} together?`,
      answer: `${countryA.name}: ${rowValue(data, "Family inclusion", "a")}. ${countryB.name}: ${rowValue(data, "Family inclusion", "b")}. ${familyRec?.summary ?? "Family rules are broadly comparable."}`,
    },
    {
      question: `Which has lower visa income requirements: ${countryA.name} or ${countryB.name}?`,
      answer: `${rowValue(data, "Minimum income range", "a")} (${countryA.name}) vs ${rowValue(data, "Minimum income range", "b")} (${countryB.name}). ${incomeRec?.summary ?? "Thresholds may be similar or not directly comparable."}`,
    },
    {
      question: `How do ${countryA.name} and ${countryB.name} compare on citizenship timelines?`,
      answer: `${rowValue(data, "Citizenship path", "a")} (${countryA.name}) vs ${rowValue(data, "Citizenship path", "b")} (${countryB.name}). ${citizenshipRec?.summary ?? "Timelines are similar or unavailable."}`,
    },
    {
      question: `What residency pathways exist in ${countryA.name} vs ${countryB.name}?`,
      answer: `${countryA.name}: ${rowValue(data, "Residency pathways", "a")}. ${countryB.name}: ${rowValue(data, "Residency pathways", "b")}. Featured routes: ${featuredA || "see country page"} vs ${featuredB || "see country page"}.`,
    },
    {
      question: `How do processing times compare for ${countryA.name} and ${countryB.name} visas?`,
      answer: `${rowValue(data, "Processing time range", "a")} (${countryA.name}) vs ${rowValue(data, "Processing time range", "b")} (${countryB.name}). Individual programs vary — see linked visa pages.`,
    },
    {
      question: `What are the tax differences between ${countryA.name} and ${countryB.name}?`,
      answer: `${countryA.name}: "${rowValue(data, "Tax notes", "a")}". ${countryB.name}: "${rowValue(data, "Tax notes", "b")}". ${LEGAL_NOTICE}`,
    },
    {
      question: `How does lifestyle context differ between ${countryA.name} and ${countryB.name}?`,
      answer: `${countryA.name} (${countryA.region}, ${countryA.capital}): ${rowValue(data, "Lifestyle & location context", "a")}. ${countryB.name} (${countryB.region}, ${countryB.capital}): ${rowValue(data, "Lifestyle & location context", "b")}.`,
    },
    {
      question: `Which ${countryA.name} vs ${countryB.name} visa programs should I read first?`,
      answer: `Start with ${featuredA || "country visa listings"} (${countryA.name}) and ${featuredB || "country visa listings"} (${countryB.name}), then use the side-by-side table and heuristic cards on this page to narrow by profile.`,
    },
    {
      question: `Is this ${countryA.name} vs ${countryB.name} comparison official immigration advice?`,
      answer: `No. ${DATA_DISCLAIMER} ${LEGAL_NOTICE}`,
    },
  ];
}

export function generateComparePageContent(
  data: CountryComparisonData
): ComparePageContent {
  const editorialSummary = buildEditorialSummary(data);
  const chooseCountryA = buildChooseCountry(data, "a");
  const chooseCountryB = buildChooseCountry(data, "b");
  const costComparison = buildCostComparison(data);
  const taxComparison = buildTaxComparison(data);
  const residencyCitizenship = buildResidencyCitizenship(data);
  const remoteWorkerSuitability = buildRemoteWorkerSuitability(data);
  const freelancerSuitability = buildFreelancerSuitability(data);
  const founderSuitability = buildFounderSuitability(data);
  const familyRelocation = buildFamilyRelocation(data);
  const lifestyleComparison = buildLifestyleComparison(data);
  const faqs = buildCompareFaqs(data);

  const { countryA, countryB } = data;
  const winsA = winsForCountry(data, data.countryASlug);
  const winsB = winsForCountry(data, data.countryBSlug);

  const quickAnswer = `${countryA.name} vs ${countryB.name}: ${data.visasA.length} vs ${data.visasB.length} tracked visa and residency programs. ${winsA.length > winsB.length ? `${countryA.name} leads ${winsA.length} heuristic categories` : winsB.length > winsA.length ? `${countryB.name} leads ${winsB.length} heuristic categories` : "Neither country leads every category"} — compare remote work, freelancer, startup, family, cost, tax and citizenship rows below.`;

  const keyTakeaways = [
    `Programs: ${data.visasA.length} (${countryA.name}) · ${data.visasB.length} (${countryB.name})`,
    `Remote work: ${rowValue(data, "Digital nomad visa", "a")} vs ${rowValue(data, "Digital nomad visa", "b")}`,
    `Residency: ${rowValue(data, "Residency pathways", "a")} vs ${rowValue(data, "Residency pathways", "b")}`,
    `Cost (min income): ${rowValue(data, "Minimum income range", "a")} vs ${rowValue(data, "Minimum income range", "b")}`,
    winsA.length > 0 || winsB.length > 0
      ? `Heuristic lean: ${winsA.length > winsB.length ? countryA.name : winsB.length > winsA.length ? countryB.name : "balanced"} (${Math.max(winsA.length, winsB.length)} categories)`
      : "Heuristic lean: balanced — verify on program pages",
  ];

  const allSections = [
    ...editorialSummary,
    ...chooseCountryA.paragraphs,
    ...(chooseCountryA.bullets ?? []),
    ...chooseCountryB.paragraphs,
    ...(chooseCountryB.bullets ?? []),
    ...costComparison.paragraphs,
    ...(costComparison.bullets ?? []),
    ...taxComparison.paragraphs,
    ...(taxComparison.bullets ?? []),
    ...residencyCitizenship.paragraphs,
    ...(residencyCitizenship.bullets ?? []),
    ...remoteWorkerSuitability.paragraphs,
    ...(remoteWorkerSuitability.bullets ?? []),
    ...freelancerSuitability.paragraphs,
    ...(freelancerSuitability.bullets ?? []),
    ...founderSuitability.paragraphs,
    ...(founderSuitability.bullets ?? []),
    ...familyRelocation.paragraphs,
    ...(familyRelocation.bullets ?? []),
    ...lifestyleComparison.paragraphs,
    ...(lifestyleComparison.bullets ?? []),
    ...faqs.flatMap((f) => [f.question, f.answer]),
  ];

  return {
    quickAnswer,
    editorialSummary,
    keyTakeaways,
    chooseCountryA,
    chooseCountryB,
    costComparison,
    taxComparison,
    residencyCitizenship,
    remoteWorkerSuitability,
    freelancerSuitability,
    founderSuitability,
    familyRelocation,
    lifestyleComparison,
    faqs,
    wordCount: countWords(allSections),
  };
}
