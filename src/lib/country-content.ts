import { getCountryBySlug } from "@/data/countries";
import {
  getCountryFeeRange,
  getCountryMinIncomeRange,
  getCountryProcessingRange,
} from "@/data/comparisons";
import type { Guide } from "@/types/guides";
import { formatMinIncome } from "@/lib/format";
import {
  getCountryEditorial,
  getCountrySnapshot,
} from "@/lib/country-stats";
import { VISA_TYPE_LABELS } from "@/lib/visa-types";
import type { FaqItem } from "@/lib/seo";
import { absoluteUrl } from "@/lib/seo";
import type { Country, CountryPair, VisaProgram, VisaType } from "@/types/nomadindex";
import {
  DATA_DISCLAIMER,
  getVerificationStatusLabel,
  LEGAL_NOTICE,
} from "@/types/nomadindex";

export type CountryContentLink = {
  href: string;
  label: string;
  description?: string;
};

export type CountryContentSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  links?: CountryContentLink[];
};

export type CountryPageContent = {
  quickAnswer: string;
  keyTakeaways: string[];
  overview: CountryContentSection;
  whyChoose: CountryContentSection;
  visaPathways: CountryContentSection;
  residency: CountryContentSection;
  citizenship: CountryContentSection;
  taxOverview: CountryContentSection;
  costOverview: CountryContentSection;
  faqs: FaqItem[];
  wordCount: number;
};

function countWords(parts: string[]): number {
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

function programsByType(visas: VisaProgram[], type: VisaType): VisaProgram[] {
  return visas.filter((v) => v.type === type);
}

function formatProgramNames(programs: VisaProgram[]): string {
  if (programs.length === 0) {
    return "none tracked in our dataset";
  }

  return programs.map((p) => p.name).join(", ");
}

function aggregateTaxNotes(visas: VisaProgram[]): string[] {
  const notes = [...new Set(visas.map((v) => v.taxNotes).filter(Boolean))];
  return notes.slice(0, 4);
}

function formatComparisonNames(pairs: CountryPair[], countryName: string): string {
  return pairs
    .slice(0, 3)
    .map((pair) => {
      const a = getCountryBySlug(pair.countryASlug);
      const b = getCountryBySlug(pair.countryBSlug);
      if (!a || !b) {
        return pair.slug.replace("-vs-", " vs ");
      }
      const other = a.name === countryName ? b.name : a.name;
      return `${countryName} vs ${other}`;
    })
    .join(", ");
}

function buildProgramLinks(visas: VisaProgram[], limit = 4): CountryContentLink[] {
  return visas.slice(0, limit).map((program) => ({
    href: `/visas/${program.slug}`,
    label: program.name,
    description: VISA_TYPE_LABELS[program.type],
  }));
}

function buildComparisonLinks(pairs: CountryPair[]): CountryContentLink[] {
  return pairs.slice(0, 4).map((pair) => {
    const a = getCountryBySlug(pair.countryASlug);
    const b = getCountryBySlug(pair.countryBSlug);
    const label =
      a && b ? `${a.name} vs ${b.name}` : pair.slug.replace("-vs-", " vs ");

    return {
      href: `/compare/${pair.slug}`,
      label,
      description: "Compare income, processing and pathways",
    };
  });
}

function buildGuideLinks(guides: Guide[]): CountryContentLink[] {
  return guides.slice(0, 3).map((guide) => ({
    href: `/guides/${guide.slug}`,
    label: guide.title,
    description: guide.excerpt.slice(0, 80),
  }));
}

export function generateCountryPageContent(input: {
  country: Country;
  visas: VisaProgram[];
  comparisons: CountryPair[];
  guides: Guide[];
}): CountryPageContent {
  const { country, visas, comparisons, guides } = input;
  const snapshot = getCountrySnapshot(country, visas);
  const editorial = getCountryEditorial(country, visas);
  const incomeRange = getCountryMinIncomeRange(country.slug);
  const feeRange = getCountryFeeRange(country.slug);
  const processingRange = getCountryProcessingRange(country.slug);
  const taxNotes = aggregateTaxNotes(visas);
  const dnPrograms = programsByType(visas, "digital-nomad");
  const startupPrograms = programsByType(visas, "startup");
  const freelancerPrograms = programsByType(visas, "freelancer");
  const passivePrograms = programsByType(visas, "passive-income");
  const renewableCount = visas.filter((v) => v.renewable).length;
  const citizenshipPrograms = visas.filter((v) => v.citizenshipPath);

  const overview: CountryContentSection = {
    id: "overview",
    heading: `What visa and residency options exist in ${country.name}?`,
    paragraphs: [
      country.summary,
      `${country.name} draws remote workers, founders and skilled professionals for practical reasons: ${snapshot.programCount} tracked visa pathway${snapshot.programCount === 1 ? "" : "s"} spanning ${snapshot.availablePathways.map((p) => p.label).join(", ") || "multiple route types"}, with minimum income thresholds from ${incomeRange} and typical processing within ${processingRange}. Capital: ${country.capital}. Currency: ${country.currency}. Primary language: ${snapshot.language}.`,
      editorial.considerations.length > 0
        ? `It pays to stay objective. ${editorial.considerations.slice(0, 2).join(" ")} Figures marked as estimates or under source review should always be confirmed with official authorities.`
        : `Requirements change and program details vary by route. Figures marked as estimates or under source review should always be confirmed with official authorities before you apply.`,
      `Read on for pathway-by-pathway detail, residency rules and long-term options — then use the comparisons and planning tools below when you are ready to shortlist a route.`,
    ],
    bullets: editorial.bestFor.slice(0, 4),
    links: [
      { href: "/countries", label: "All destinations", description: "22 countries tracked" },
      { href: "/methodology", label: "How we verify data", description: "Source standards" },
      { href: "/visas", label: "Visa directory" },
    ],
  };

  const whyChoose: CountryContentSection = {
    id: "why-choose",
    heading: `How does ${country.name} compare for relocation?`,
    paragraphs: [
      snapshot.euStatus === "EU member"
        ? `${country.name} is an EU member state${snapshot.schengenStatus === "Schengen area" ? " in the Schengen area" : " outside the Schengen area"}. That shapes how residence here interacts with travel and mobility across Europe — subject to the specific visa route you hold and current official rules.`
        : `${country.name} sits in ${country.region}. EU and Schengen membership do not apply in our dataset classification, which affects how this destination compares with European options on mobility and residency.`,
      `Applicants often evaluate ${country.name} alongside ${formatComparisonNames(comparisons, country.name) || "other NomadIndex destinations"} when weighing income requirements, processing speed and long-term residency potential.`,
    ],
    links: buildComparisonLinks(comparisons),
  };

  const visaPathways: CountryContentSection = {
    id: "visa-pathways",
    heading: `Which visa pathways does ${country.name} offer for remote workers and founders?`,
    paragraphs: [
      `NomadIndex groups ${country.name} programs by pathway type. Digital nomad routes: ${formatProgramNames(dnPrograms)}. Startup routes: ${formatProgramNames(startupPrograms)}. Freelancer/self-employed routes: ${formatProgramNames(freelancerPrograms)}. Passive-income routes: ${formatProgramNames(passivePrograms)}.`,
      `Minimum income across tracked programs ranges from ${incomeRange}. Application fees span ${feeRange}, with processing typically within ${processingRange} — though individual routes vary.`,
    ],
    bullets: visas.slice(0, 6).map((program) => {
      const income = formatMinIncome(program);
      const incomeNote = income
        ? ` — from ${income} (${getVerificationStatusLabel(program.verificationStatus)})`
        : "";
      return `${program.name} (${VISA_TYPE_LABELS[program.type]})${incomeNote}. ${program.summary}`;
    }),
    links: buildProgramLinks(visas, 6),
  };

  const residency: CountryContentSection = {
    id: "residency",
    heading: `What are the residency and stay rules in ${country.name}?`,
    paragraphs: [
      `Residency in ${country.name} depends on the visa or permit you select. In our dataset, ${renewableCount} of ${visas.length} tracked program${visas.length === 1 ? "" : "s"} are marked renewable — suggesting potential paths to extend beyond an initial grant. Always confirm renewal conditions with the issuing authority.`,
      `${snapshot.familyRoutesLabel}. Dependent rules differ by program; check individual visa pages for whether family members can be included.`,
      `Typical stay durations include: ${visas
        .slice(0, 4)
        .map((v) => `${v.name} (${v.stayDuration})`)
        .join("; ")}${visas.length > 4 ? "; plus additional routes listed below" : ""}.`,
    ],
    links: [
      {
        href: "/tools/visa-eligibility-checker",
        label: "Visa Pathway Matcher",
        description: "Match visa programs to your profile",
      },
      {
        href: "/tools/relocation-cost-calculator",
        label: "Estimate relocation costs",
        description: "Fees, buffers and setup",
      },
    ],
  };

  const citizenship: CountryContentSection = {
    id: "citizenship",
    heading: `Can ${country.name} lead to citizenship or long-term residency?`,
    paragraphs: [
      country.citizenshipYears !== null
        ? `Our country record lists a typical citizenship timeline of ${country.citizenshipYears} years of legal residence for ${country.name}. Actual eligibility depends on continuous residence, language tests, integration requirements and nationality law — none of which NomadIndex verifies.`
        : `A standard citizenship timeline is not specified in our dataset for ${country.name}. Some visa routes may still lead toward long-term residence or naturalisation, but you should confirm with official sources.`,
      citizenshipPrograms.length > 0
        ? `${citizenshipPrograms.length} tracked program${citizenshipPrograms.length === 1 ? "" : "s"} in our dataset explicitly reference a citizenship or long-term residence path: ${citizenshipPrograms.map((p) => p.name).join(", ")}.`
        : `No tracked programs in our dataset explicitly flag a citizenship path for ${country.name}. Long-term options may still exist outside our records.`,
    ],
    links: guides.length > 0 ? buildGuideLinks(guides) : [],
  };

  const taxOverview: CountryContentSection = {
    id: "tax-overview",
    heading: `What tax considerations apply when relocating to ${country.name}?`,
    paragraphs: [
      `NomadIndex does not provide tax advice. The notes below summarise tax-related fields attached to visa programs in our dataset — general planning pointers only.`,
      taxNotes.length > 0
        ? `Program-level tax notes for ${country.name} include: ${taxNotes.join(" ")}`
        : `Our dataset does not include detailed tax notes for most ${country.name} programs. Tax residency often depends on days spent in country, income source and bilateral treaties.`,
      `${LEGAL_NOTICE} Consult a qualified tax adviser before relying on any summary here.`,
    ],
    links: [
      { href: "/methodology", label: "How we verify data" },
      { href: "/terms", label: "Terms of use" },
    ],
  };

  const costOverview: CountryContentSection = {
    id: "cost-overview",
    heading: `What do relocation costs look like for ${country.name}?`,
    paragraphs: [
      `Our dataset focuses on visa fees and income thresholds rather than full living expenses. Application fees range from ${feeRange}. Minimum income requirements: ${incomeRange}.`,
      `These are planning estimates from NomadIndex program records — not a full relocation budget. Housing, healthcare and adviser fees sit outside this summary. Use the calculators below to model your scenario.`,
    ],
    bullets: editorial.considerations.map((item) => item),
    links: [
      {
        href: "/tools/income-requirement-calculator",
        label: "Income requirement calculator",
      },
      {
        href: "/tools/country-comparison-tool",
        label: "Compare destinations",
      },
      ...buildComparisonLinks(comparisons).slice(0, 2),
    ],
  };

  const allText = [
    ...overview.paragraphs,
    ...whyChoose.paragraphs,
    ...visaPathways.paragraphs,
    ...visaPathways.bullets ?? [],
    ...residency.paragraphs,
    ...citizenship.paragraphs,
    ...taxOverview.paragraphs,
    ...costOverview.paragraphs,
    ...costOverview.bullets ?? [],
    ...editorial.bestFor,
    ...editorial.considerations,
  ];

  const faqs = buildCountryFaqs({
    country,
    visas,
    comparisons,
    guides,
    snapshot,
    dnPrograms,
    incomeRange,
    processingRange,
  });

  const faqWords = countWords(faqs.flatMap((f) => [f.question, f.answer]));

  const quickAnswer = `${country.name} offers ${snapshot.programCount} tracked immigration visa and residency pathway${snapshot.programCount === 1 ? "" : "s"} for remote workers, freelancers and founders — including ${snapshot.availablePathways.map((p) => p.label).join(", ") || "multiple route types"}. Minimum income in our dataset ranges from ${incomeRange}; processing typically ${processingRange}. ${snapshot.remoteWorkerLabel}.`;

  const keyTakeaways = [
    `${snapshot.programCount} immigration programs tracked · ${renewableCount} marked renewable in dataset`,
    `Minimum income range: ${incomeRange} · Application fees: ${feeRange}`,
    dnPrograms.length > 0
      ? `Digital nomad visa: yes — ${dnPrograms.map((p) => p.name).join(", ")}`
      : "Digital nomad visa: no dedicated route listed in dataset",
    startupPrograms.length > 0
      ? `Startup pathway: ${formatProgramNames(startupPrograms)}`
      : "Startup pathway: none tracked in dataset",
    country.citizenshipYears !== null
      ? `Typical citizenship timeline: ${country.citizenshipYears} years (country record)`
      : "Citizenship timeline: not specified in country record",
  ];

  return {
    quickAnswer,
    keyTakeaways,
    overview,
    whyChoose,
    visaPathways,
    residency,
    citizenship,
    taxOverview,
    costOverview,
    faqs,
    wordCount: countWords(allText) + faqWords,
  };
}

export function buildCountryFaqs(input: {
  country: Country;
  visas: VisaProgram[];
  comparisons: CountryPair[];
  guides: Guide[];
  snapshot: ReturnType<typeof getCountrySnapshot>;
  dnPrograms: VisaProgram[];
  incomeRange: string;
  processingRange: string;
}): FaqItem[] {
  const {
    country,
    visas,
    comparisons,
    guides,
    snapshot,
    dnPrograms,
    incomeRange,
    processingRange,
  } = input;

  const compareExamples =
    comparisons.length > 0
      ? comparisons
          .slice(0, 2)
          .map((p) => absoluteUrl(`/compare/${p.slug}`))
          .join(" and ")
      : absoluteUrl("/tools/country-comparison-tool");

  const dnAnswer =
    dnPrograms.length > 0
      ? `Yes. NomadIndex tracks ${dnPrograms.length} digital nomad route${dnPrograms.length === 1 ? "" : "s"} for ${country.name}: ${dnPrograms.map((p) => p.name).join(", ")}. Verify current requirements on official sources.`
      : `Our dataset does not currently list a dedicated digital nomad visa for ${country.name}. Other remote-work or freelancer routes may exist — see the visa programs section on this page.`;

  const topProgram = visas[0];
  const incomeDetail =
    topProgram && topProgram.minIncome !== null
      ? ` For example, ${topProgram.name} lists ${formatMinIncome(topProgram)} (${getVerificationStatusLabel(topProgram.verificationStatus)}).`
      : "";

  return [
    {
      question: `What visa options exist in ${country.name} for remote workers?`,
      answer: `NomadIndex tracks ${visas.length} program${visas.length === 1 ? "" : "s"} for ${country.name}, including ${snapshot.availablePathways.map((p) => p.label).join(", ") || "various pathways"}. ${snapshot.remoteWorkerLabel}. Browse individual program pages for income, fees and processing details.`,
    },
    {
      question: `Does ${country.name} have a digital nomad visa?`,
      answer: dnAnswer,
    },
    {
      question: `What is the minimum income requirement for ${country.name} visas?`,
      answer: `In our dataset, minimum income thresholds range from ${incomeRange}.${incomeDetail} Requirements differ by program and may use monthly or annual figures — always confirm with official sources.`,
    },
    {
      question: `How long does visa processing take in ${country.name}?`,
      answer: `Processing times in our dataset typically fall within ${processingRange}. The fastest listed route is ${snapshot.fastestProcessing}. Timelines change — check the issuing authority before applying.`,
    },
    {
      question: `Can I move to ${country.name} with my family?`,
      answer:
        snapshot.familyRoutesCount > 0
          ? `${snapshot.familyRoutesCount} of ${visas.length} tracked programs allow family inclusion in our dataset. Dependent rules vary by route — review each visa program page for details.`
          : `No tracked programs in our dataset explicitly include family members for ${country.name}. Some routes may still allow dependents under official rules not captured here.`,
    },
    {
      question: `How long does it take to get citizenship in ${country.name}?`,
      answer:
        country.citizenshipYears !== null
          ? `Our country record lists ${country.citizenshipYears} years as a typical citizenship timeline. Naturalisation rules depend on residence history, language and integration requirements defined by ${country.name} authorities.`
          : `A citizenship timeline is not specified in our dataset for ${country.name}. Long-term residence may still be possible through specific visa routes.`,
    },
    {
      question: `How does ${country.name} compare to other countries for relocation?`,
      answer: `Use NomadIndex compare pages such as ${compareExamples} to review income ranges, processing times and pathway availability side by side. ${guides.length > 0 ? `See also our guides: ${guides.slice(0, 2).map((g) => g.title).join(" and ")}.` : ""}`,
    },
    {
      question: `Is NomadIndex ${country.name} data official?`,
      answer: `${DATA_DISCLAIMER} ${LEGAL_NOTICE} See ${absoluteUrl("/methodology")} for verification statuses and source confidence labels.`,
    },
  ];
}

export function getCountryH1(countryName: string): string {
  return `${countryName} Visas, Residency & Remote Work Guide`;
}
