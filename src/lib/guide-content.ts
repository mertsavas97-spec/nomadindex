import { getComparisonPairSlug } from "@/data/comparisons";
import { getCountryBySlug } from "@/data/countries";
import { getVisaBySlug } from "@/data/visa-programs";
import { formatMinIncome, formatMinIncomeMonthlyEquivalent } from "@/lib/format";
import { VISA_TYPE_LABELS } from "@/lib/visa-types";
import type { Guide, GuideSection } from "@/types/guides";
import type { Country, VisaProgram } from "@/types/nomadindex";
import { DATA_DISCLAIMER, getVerificationStatusLabel } from "@/types/nomadindex";

export type GuideVisaContext = {
  program: VisaProgram;
  country: Country;
};

export type EnhancedGuideContent = {
  sections: GuideSection[];
  wordCount: number;
  visaContexts: GuideVisaContext[];
  compareLinks: { href: string; label: string }[];
};

function countWords(parts: string[]): number {
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

export function resolveGuideVisaContexts(guide: Guide): GuideVisaContext[] {
  return guide.relatedVisaSlugs
    .map((slug) => {
      const program = getVisaBySlug(slug);
      if (!program) {
        return null;
      }
      const country = getCountryBySlug(program.countrySlug);
      if (!country) {
        return null;
      }
      return { program, country };
    })
    .filter((item): item is GuideVisaContext => item !== null);
}

const POPULAR_COMPARE_PARTNERS: Record<string, string[]> = {
  uae: ["thailand", "portugal", "spain"],
  thailand: ["uae", "portugal", "spain"],
  germany: ["netherlands", "portugal", "spain"],
  estonia: ["portugal", "canada", "spain"],
  canada: ["uk", "estonia", "portugal"],
};

export function buildGuideCompareLinks(guide: Guide): { href: string; label: string }[] {
  const countries = guide.relatedCountrySlugs
    .map((slug) => getCountryBySlug(slug))
    .filter((c): c is Country => c !== undefined);

  const links: { href: string; label: string }[] = [];
  const seen = new Set<string>();

  function addPair(a: Country, b: Country) {
    const slug = getComparisonPairSlug(a.slug, b.slug);
    if (!seen.has(slug)) {
      seen.add(slug);
      links.push({
        href: `/compare/${slug}`,
        label: `${a.name} vs ${b.name}`,
      });
    }
  }

  for (let i = 0; i < countries.length; i++) {
    for (let j = i + 1; j < countries.length; j++) {
      addPair(countries[i], countries[j]);
    }
  }

  if (countries.length === 1) {
    const primary = countries[0];
    const partners = POPULAR_COMPARE_PARTNERS[primary.slug] ?? [];
    for (const partnerSlug of partners) {
      const partner = getCountryBySlug(partnerSlug);
      if (partner) {
        addPair(primary, partner);
      }
    }
  }

  return links.slice(0, 6);
}

function formatIncomeLine(program: VisaProgram): string {
  if (program.minIncome === null) {
    return "no fixed minimum income in our dataset";
  }
  const formatted = formatMinIncome(program);
  const monthly = formatMinIncomeMonthlyEquivalent(program);
  if (program.incomePeriod === "annual" && monthly) {
    return `${formatted} (~${monthly} monthly equivalent, ${getVerificationStatusLabel(program.verificationStatus)})`;
  }
  return `${formatted} (${getVerificationStatusLabel(program.verificationStatus)})`;
}

function formatFeeLine(program: VisaProgram): string {
  if (program.applicationFee === null) {
    return "fee not specified in dataset";
  }
  return `${program.applicationFee} ${program.currency} (${getVerificationStatusLabel(program.verificationStatus)})`;
}

function formatProcessingLine(program: VisaProgram): string {
  return program.processingTime ?? "not specified in dataset";
}

function buildIntroduction(
  guide: Guide,
  contexts: GuideVisaContext[]
): GuideSection {
  const countries = guide.relatedCountrySlugs
    .map((slug) => getCountryBySlug(slug))
    .filter((c): c is Country => c !== undefined);

  const programNames = contexts.map((c) => c.program.name).join(", ");
  const countryNames = countries.map((c) => c.name).join(", ");

  const paragraphs = [
    `${guide.excerpt} This guide references ${contexts.length} visa programs across ${countries.length} countries (${countryNames}) in the NomadIndex dataset as of ${guide.dateModified}.`,
    `Target audience: ${guide.targetAudience.replace("-", " ")}. Category: ${guide.category}. Data status for this guide: ${getVerificationStatusLabel(guide.verificationStatus)}. ${DATA_DISCLAIMER}`,
    ...countries.slice(0, 4).map(
      (c) =>
        `${c.name} (${c.region}, capital ${c.capital}, currency ${c.currency}): ${c.summary} NomadIndex tracks ${contexts.filter((ctx) => ctx.country.slug === c.slug).length} linked program(s) in this guide.`
    ),
    `Programs covered: ${programNames || "see related visa pages"}. Types include ${[...new Set(contexts.map((c) => VISA_TYPE_LABELS[c.program.type]))].join(", ") || "multiple categories"}.`,
    `Use this guide with NomadIndex country pages, visa program detail pages, compare tools and calculators — all figures below come from our static dataset and must be confirmed with official sources before applying.`,
  ];

  return {
    id: "introduction",
    heading: "Introduction",
    paragraphs,
  };
}

function buildRequirements(
  guide: Guide,
  contexts: GuideVisaContext[]
): GuideSection {
  const paragraphs = [
    `Requirements vary by program. The following summaries reflect NomadIndex fields for visas linked to "${guide.title}" — not exhaustive consulate checklists.`,
    `Income thresholds use each program's stored currency and income period. Applicant multipliers for dependents are not modelled here; family inclusion flags indicate whether dependents may be included on some routes.`,
  ];

  const bullets = contexts.map(
    ({ program, country }) =>
      `${country.flagEmoji} ${program.name} (${VISA_TYPE_LABELS[program.type]}): income ${formatIncomeLine(program)}; requirement level ${program.requirementLevel}; family ${program.familyAllowed ? "allowed" : "not listed"}; citizenship path ${program.citizenshipPath ? "yes" : "no"}; source confidence ${program.sourceConfidence}`
  );

  return {
    id: "requirements",
    heading: "Requirements",
    paragraphs,
    bullets,
  };
}

function buildProcess(
  guide: Guide,
  contexts: GuideVisaContext[]
): GuideSection {
  const paragraphs = [
    `Processing timelines below are planning ranges from our dataset — not guarantees. Missing documents, nationality and consulate workload affect real timelines.`,
    `Every program lists an official reference URL in NomadIndex. Cross-check current forms, biometrics appointments and translation requirements on the issuing authority site before filing.`,
  ];

  const bullets = contexts.map(
    ({ program, country }) =>
      `${program.name} (${country.name}): processing ${formatProcessingLine(program)}; stay duration ${program.stayDuration}; renewable ${program.renewable ? "yes" : "no"}; last verified ${program.lastVerified}`
  );

  const verifiedCount = contexts.filter(
    (c) => c.program.verificationStatus === "verified"
  ).length;
  const estimateCount = contexts.filter(
    (c) => c.program.verificationStatus === "placeholder"
  ).length;
  const sourceReviewCount =
    contexts.length - verifiedCount - estimateCount;

  paragraphs.push(
    `Dataset status mix for this guide: ${verifiedCount} verified, ${sourceReviewCount} under source review, ${estimateCount} estimate programs. Confirm estimate figures with official sources before you rely on any step sequence.`
  );

  return {
    id: "process",
    heading: "Process",
    paragraphs,
    bullets,
  };
}

function buildCosts(
  guide: Guide,
  contexts: GuideVisaContext[]
): GuideSection {
  const withFees = contexts.filter((c) => c.program.applicationFee !== null);
  const withIncome = contexts.filter((c) => c.program.minIncome !== null);

  const paragraphs = [
    `Costs in this guide mean visa application fees and stated minimum income proof — not rent, healthcare, relocation flights or tax liabilities.`,
    `${withFees.length} of ${contexts.length} linked programs record an application fee; ${withIncome.length} record a minimum income figure. Programs without fees may still require paid medical exams, translations or zone licenses not tracked here.`,
  ];

  const bullets = contexts.map(
    ({ program, country }) =>
      `${program.name}: application fee ${formatFeeLine(program)}; income proof ${formatIncomeLine(program)}; tax note excerpt — "${program.taxNotes.slice(0, 120)}${program.taxNotes.length > 120 ? "…" : ""}"`
  );

  paragraphs.push(
    `Use the Income Requirement Calculator (/tools/income-requirement-calculator) and Relocation Cost Calculator (/tools/relocation-cost-calculator) to model your earnings against ${contexts.map((c) => c.program.slug).slice(0, 3).join(", ")} and related routes.`
  );

  return {
    id: "costs",
    heading: "Costs",
    paragraphs,
    bullets,
  };
}

function buildCommonMistakes(
  guide: Guide,
  contexts: GuideVisaContext[]
): GuideSection {
  const placeholderPrograms = contexts.filter(
    (c) => c.program.verificationStatus === "placeholder"
  );
  const annualIncomePrograms = contexts.filter(
    (c) => c.program.incomePeriod === "annual"
  );
  const eResidency = contexts.find((c) => c.program.slug === "estonia-e-residency");
  const noIncome = contexts.filter((c) => c.program.minIncome === null);

  const bullets: string[] = [
    `Relying on NomadIndex estimate figures (${placeholderPrograms.map((c) => c.program.name).join(", ") || "none in this guide"}) without checking consulate websites.`,
    `Treating monthly income tools as applying to annual-threshold programs${annualIncomePrograms.length > 0 ? ` such as ${annualIncomePrograms.map((c) => c.program.name).join(", ")}` : ""} without converting periods.`,
    `Assuming a visa type matches your activity (employment vs freelance vs passive income) — check each program's ${VISA_TYPE_LABELS[contexts[0]?.program.type ?? "other"]} classification.`,
  ];

  if (eResidency) {
    bullets.push(
      "Confusing Estonia e-Residency (digital ID for company formation) with the Startup Visa or Digital Nomad Visa — only the latter grant residence rights."
    );
  }

  if (noIncome.length > 0) {
    bullets.push(
      `Applying without a viable business plan or client pipeline where no minimum income is listed (${noIncome.map((c) => c.program.name).join(", ")}) — authorities may still require proof of subsistence.`
    );
  }

  bullets.push(
    "Skipping family and dependent rules when relocating with a partner or children — check familyAllowed on each program.",
    "Using this guide as legal, tax or immigration advice — it summarises dataset fields only."
  );

  const paragraphs = [
    `These mistakes appear frequently when planners use comparison sites without reading program-level detail. The errors below are tied to programs referenced in "${guide.title}".`,
    `Always reconcile NomadIndex data with official sources listed on each visa program page before booking flights or signing leases.`,
  ];

  return {
    id: "common-mistakes",
    heading: "Common Mistakes",
    paragraphs,
    bullets,
  };
}

export function generateEnhancedGuideContent(guide: Guide): EnhancedGuideContent {
  const visaContexts = resolveGuideVisaContexts(guide);
  const compareLinks = buildGuideCompareLinks(guide);

  const sections = [
    buildIntroduction(guide, visaContexts),
    buildRequirements(guide, visaContexts),
    buildProcess(guide, visaContexts),
    buildCosts(guide, visaContexts),
    buildCommonMistakes(guide, visaContexts),
  ];

  const allText = [
    guide.summaryBox,
    ...guide.keyTakeaways,
    ...sections.flatMap((s) => [
      ...(s.paragraphs ?? []),
      ...(s.bullets ?? []),
    ]),
    ...guide.faqs.flatMap((f) => [f.question, f.answer]),
  ];

  return {
    sections,
    wordCount: countWords(allText),
    visaContexts,
    compareLinks,
  };
}

export function estimateGuideReadingTime(wordCount: number): number {
  return Math.max(5, Math.ceil(wordCount / 200));
}
