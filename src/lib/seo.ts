import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/site-url";
import type { Country, VisaProgram } from "@/types/nomadindex";
import { getMonthlyMinIncome } from "@/lib/income";
import { DATA_DISCLAIMER, LEGAL_NOTICE } from "@/types/nomadindex";

export const SITE_NAME = "NomadIndex";

/** @deprecated Prefer getSiteUrl() for runtime resolution */
export const SITE_URL = getSiteUrl();

export const HOMEPAGE_TITLE = `${SITE_NAME} — Compare Visas, Residency & Startup Paths`;
export const HOMEPAGE_DESCRIPTION =
  "Compare visa programs, residency pathways, and startup visas across 22 countries. Built for founders, freelancers, and remote workers planning their next move.";

export const DEFAULT_SITE_DESCRIPTION =
  "Compare visa programs, residency pathways, and startup visas across 22 countries for founders, freelancers, and remote workers.";

const META_DESCRIPTION_MAX = 160;
const META_DESCRIPTION_MIN = 140;
const GUIDE_META_SUFFIX = " Compare visa and residency options in NomadIndex.";
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export function withSiteTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_NAME}`;
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized === "/" ? "" : normalized}`;
}

function getOgImagePath(path: string): string {
  const normalized = path === "/" ? "" : path.replace(/\/$/, "");
  return `${normalized}/opengraph-image`;
}

export function formatMetaDescription(
  text: string,
  options: { minLength?: number; maxLength?: number; suffix?: string } = {}
): string {
  const minLength = options.minLength ?? 0;
  const maxLength = options.maxLength ?? META_DESCRIPTION_MAX;
  const suffix = options.suffix ?? "";

  let description = text.trim().replace(/\s+/g, " ");

  if (description.length < minLength && suffix) {
    description = `${description}${suffix}`.trim();
  }

  if (description.length <= maxLength) {
    return description;
  }

  const truncated = description.slice(0, maxLength + 1);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > minLength) {
    return truncated.slice(0, lastSpace).trim();
  }

  return description.slice(0, maxLength).trim();
}

export function createNotFoundMetadata(title = "Page not found"): Metadata {
  return {
    title: withSiteTitle(title),
    robots: { index: false, follow: false },
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  absoluteTitle = true,
  openGraphType = "website",
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
  openGraphType?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = absoluteTitle ? title : withSiteTitle(title);
  const resolvedDescription = formatMetaDescription(description);
  const ogImageUrl = absoluteUrl(getOgImagePath(path));

  return {
    title: { absolute: resolvedTitle },
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: SITE_NAME,
      type: openGraphType,
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImageUrl],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export const COUNTRIES_DIRECTORY_TITLE = withSiteTitle(
  "Country Directory — Remote Work & Residency"
);
export const COUNTRIES_DIRECTORY_DESCRIPTION =
  "Explore 22 countries for remote work, residency, and relocation. Compare visa options, citizenship timelines, income requirements, and residency pathways.";

export const VISAS_DIRECTORY_TITLE = withSiteTitle(
  "Visa Programs & Residency Routes"
);
export const VISAS_DIRECTORY_DESCRIPTION =
  "Browse digital nomad visas, freelancer permits, startup pathways, and residency programs. Compare requirements, income thresholds, and stay options.";

export const COMPARE_LANDING_TITLE = withSiteTitle(
  "Side-by-Side Country Comparisons"
);
export const COMPARE_LANDING_DESCRIPTION =
  "Compare visa requirements, residency pathways, processing times, and income thresholds across countries side by side.";

export const METHODOLOGY_TITLE = withSiteTitle(
  "Data Sources & Verification Methodology"
);
export const METHODOLOGY_DESCRIPTION =
  "Learn how NomadIndex collects, reviews, and labels visa data, including confidence levels, update processes, and source verification standards.";

export const COUNTRY_METADATA_TITLE = (name: string) =>
  withSiteTitle(`${name} Visas, Residency & Remote Work Guide`);

export const COUNTRY_METADATA_DESCRIPTION = (
  name: string,
  programCount: number,
  options: {
    incomeRange?: string;
    citizenshipYears?: number | null;
  } = {}
) => {
  const { incomeRange, citizenshipYears } = options;
  const citizenshipNote =
    citizenshipYears != null
      ? ` Citizenship path from ${citizenshipYears} years in our dataset.`
      : "";
  const incomeNote = incomeRange ? ` Income from ${incomeRange}.` : "";

  return formatMetaDescription(
    `Planning a move to ${name}? Compare ${programCount} visa routes for remote workers and founders.${incomeNote}${citizenshipNote} Processing times, residency and official sources.`,
    { minLength: META_DESCRIPTION_MIN }
  );
};

export function buildWebPageJsonLd({
  name,
  description,
  path,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  dateModified: string;
}) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    dateModified,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

export function buildCountryVisaItemListJsonLd(
  countryName: string,
  programs: VisaProgram[]
) {
  return buildItemListJsonLd(
    `${countryName} visa programs`,
    programs.map((program) => ({
      name: program.name,
      url: absoluteUrl(`/visas/${program.slug}`),
    }))
  );
}

export const VISA_METADATA_TITLE = (programName: string, countryName: string) =>
  withSiteTitle(`${programName} in ${countryName}`);

export const VISA_METADATA_DESCRIPTION = (
  programName: string,
  countryName: string
) =>
  formatMetaDescription(
    `${programName} in ${countryName}: income thresholds, processing times, family eligibility, fees and residency details from NomadIndex data.`,
    { minLength: META_DESCRIPTION_MIN }
  );

export const COMPARE_METADATA_TITLE = (a: string, b: string) =>
  withSiteTitle(`${a} vs ${b}: Visas, Residency & Cost Comparison`);

export const COMPARE_METADATA_DESCRIPTION = (a: string, b: string) =>
  formatMetaDescription(
    `Compare visas, residency pathways, income requirements, processing times, and relocation factors between ${a} and ${b}.`,
    { minLength: META_DESCRIPTION_MIN }
  );

export const GUIDE_METADATA_TITLE = (title: string) => withSiteTitle(title);

export const GUIDE_METADATA_DESCRIPTION = (excerpt: string) => {
  const normalized = excerpt.trim().replace(/\s+/g, " ");

  if (
    normalized.length >= META_DESCRIPTION_MIN &&
    normalized.length <= META_DESCRIPTION_MAX
  ) {
    return normalized;
  }

  if (normalized.length < META_DESCRIPTION_MIN) {
    const combined = `${normalized}${GUIDE_META_SUFFIX}`.trim();
    if (combined.length <= META_DESCRIPTION_MAX) {
      return combined;
    }

    const maxExcerptLength = META_DESCRIPTION_MAX - GUIDE_META_SUFFIX.length;
    const shortened = formatMetaDescription(normalized, {
      maxLength: maxExcerptLength,
    });
    return `${shortened}${GUIDE_META_SUFFIX}`.trim();
  }

  return formatMetaDescription(normalized, {
    maxLength: META_DESCRIPTION_MAX,
  });
};

export const TOOL_METADATA_TITLE = (toolName: string) => withSiteTitle(toolName);

export const TOOL_METADATA_DESCRIPTION = (purpose: string) =>
  formatMetaDescription(
    `${purpose} Informational planning tool only — not legal or immigration advice.`
  );

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description:
      "Global mobility intelligence platform comparing digital nomad, freelancer, startup and residency visa programs across 22 countries.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/countries?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/android-chrome-512x512.png"),
    },
    description:
      "Mobility intelligence for founders, freelancers and remote workers comparing visa and residency programs.",
    sameAs: [],
  };
}

export function buildItemListJsonLd(
  name: string,
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        name: item.name,
        url: item.url,
      },
    })),
  };
}

export function buildCompareWebPageJsonLd({
  countryAName,
  countryBName,
  path,
  description,
  dateModified,
}: {
  countryAName: string;
  countryBName: string;
  path: string;
  description: string;
  dateModified: string;
}) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: COMPARE_METADATA_TITLE(countryAName, countryBName),
    description,
    url: absoluteUrl(path),
    dateModified,
    inLanguage: "en",
    about: [
      { "@type": "Country", name: countryAName },
      { "@type": "Country", name: countryBName },
    ],
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

export function buildFaqPageJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleJsonLd(article: {
  title: string;
  excerpt: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  pathPrefix?: string;
  imageUrl?: string;
}) {
  const articlePath = `${article.pathPrefix ?? "/guides"}/${article.slug}`;
  const imageUrl = article.imageUrl ?? absoluteUrl(getOgImagePath(articlePath));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: [imageUrl],
    url: absoluteUrl(articlePath),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/android-chrome-512x512.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(articlePath),
    },
  };
}

export const HOMEPAGE_FAQS: FaqItem[] = [
  {
    question: "What is NomadIndex?",
    answer:
      "NomadIndex is a global mobility intelligence platform that compares visa and residency programs for digital nomads, freelancers, startup founders and remote workers across 22 countries.",
  },
  {
    question: "Who is NomadIndex for?",
    answer:
      "Remote workers comparing digital nomad visas, freelancers evaluating self-employed routes, and founders researching startup or innovator visa programs before relocating abroad.",
  },
  {
    question: "How many countries does NomadIndex cover?",
    answer:
      "NomadIndex currently tracks 22 countries with 60+ visa and residency programs, 231 country comparison pages and four interactive planning tools.",
  },
  {
    question: "How does NomadIndex compare visa programs?",
    answer:
      "Each program is stored in a structured dataset with income thresholds, fees, processing times and official reference links. Compare pages and tools read from the same data so figures stay consistent.",
  },
  {
    question: "Is NomadIndex legal or immigration advice?",
    answer: `${DATA_DISCLAIMER} ${LEGAL_NOTICE}`,
  },
  {
    question: "What is the difference between a visa and residency on NomadIndex?",
    answer:
      "Visa pages describe specific immigration programs (digital nomad, startup, freelancer, etc.). Residency refers to longer-term stay rules, renewals and citizenship timelines tracked at country and program level. NomadIndex uses both terms consistently across compare pages and guides.",
  },
  {
    question: "How do NomadIndex planning tools work?",
    answer:
      "Tools such as the Visa Pathway Matcher and Income Requirement Calculator read the same static dataset as country and visa pages. They return planning estimates — which programs may match your inputs — not eligibility determinations or approval guarantees.",
  },
  {
    question: "Where does NomadIndex data come from?",
    answer:
      "Program records link to government immigration portals and official ministry sources where available. Each record shows verification status (dataset verified, under review, estimate only) and source confidence. See the methodology and sources pages for full standards.",
  },
];

export const COMPARE_LANDING_FAQS: FaqItem[] = [
  {
    question: "How does NomadIndex compare countries?",
    answer:
      "We aggregate tracked visa programs per country and present side-by-side fields including visa types, income ranges, processing times, citizenship paths and tax notes. Figures may be estimates or under source review.",
  },
  {
    question: "Are comparison recommendations personalised?",
    answer:
      "No. Recommendations such as 'better for remote workers' are heuristic summaries based on our dataset, not personalised legal or tax advice.",
  },
  {
    question: "Should I rely on NomadIndex before applying for a visa?",
    answer:
      "No. Always confirm requirements with official government sources before applying. NomadIndex data is for informational planning only.",
  },
];

export function buildVisaFaqs(program: VisaProgram, country: Country): FaqItem[] {
  const incomeNote =
    program.minIncome !== null
      ? `Our dataset lists an estimated minimum income of ${program.minIncome.toLocaleString()} ${program.currency} per ${program.incomePeriod === "annual" ? "year" : "month"} for ${program.name}. Monthly equivalent: ~${getMonthlyMinIncome(program)?.toLocaleString() ?? "unknown"} ${program.currency}. This may not reflect the latest official figure.`
      : `Our dataset does not currently include a fixed minimum income for ${program.name}. Requirements may depend on other factors.`;

  return [
    {
      question: `What is the ${program.name} in ${country.name}?`,
      answer: program.summary,
    },
    {
      question: `What are the income requirements for ${program.name}?`,
      answer: `${incomeNote} Verify with official sources before applying.`,
    },
    {
      question: `Is ${program.name} information on NomadIndex official?`,
      answer: `NomadIndex provides planning information only. ${DATA_DISCLAIMER} ${LEGAL_NOTICE}`,
    },
  ];
}

export function buildToolFaqs(toolName: string): FaqItem[] {
  return [
    {
      question: `How does the ${toolName} work?`,
      answer:
        "It uses NomadIndex's local static dataset of visa programs and countries. Results are planning estimates, not eligibility determinations or legal advice.",
    },
    {
      question: `Can I rely on ${toolName} results for a visa application?`,
      answer: DATA_DISCLAIMER,
    },
  ];
}
