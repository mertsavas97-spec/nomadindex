import {
  getAllSettingsMap,
  parseJsonArray,
  parseJsonFaqs,
} from "@/lib/cms/settings";
import { SETTING_KEYS } from "@/lib/cms/settings-keys";
import {
  getFeaturedComparisonPairs,
  getFeaturedCountries,
  getFeaturedVisas,
} from "@/data";
import { getLatestGuides, getGuideBySlug } from "@/data/guides";
import { getCountryBySlug } from "@/data/countries";
import { getVisaBySlug } from "@/data/visa-programs";
import type { Country } from "@/types/nomadindex";
import type { VisaProgram } from "@/types/nomadindex";
import type { Guide } from "@/types/guides";
import {
  DEFAULT_SITE_DESCRIPTION,
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_FAQS,
  HOMEPAGE_TITLE,
  SITE_NAME,
} from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export type ResolvedSiteSettings = {
  siteTitle: string;
  homepageTitle: string;
  homepageDescription: string;
  defaultOgTitle: string;
  defaultOgDescription: string;
  organizationName: string;
  contactEmail: string;
  googleSearchConsole: string;
  bingVerification: string;
  googleAnalyticsId: string;
  microsoftClarityId: string;
  canonicalDomain: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  featuredCountrySlugs: string[];
  featuredVisaSlugs: string[];
  featuredComparisonPairs: string[];
  featuredGuideSlugs: string[];
  homepageFaqs: { question: string; answer: string }[];
  bottomCtaTitle: string;
  bottomCtaDescription: string;
};

const DEFAULTS: ResolvedSiteSettings = {
  siteTitle: SITE_NAME,
  homepageTitle: HOMEPAGE_TITLE,
  homepageDescription: HOMEPAGE_DESCRIPTION,
  defaultOgTitle: HOMEPAGE_TITLE,
  defaultOgDescription: DEFAULT_SITE_DESCRIPTION,
  organizationName: SITE_NAME,
  contactEmail: "hello@nomadindex.app",
  googleSearchConsole: "",
  bingVerification: "",
  googleAnalyticsId: "",
  microsoftClarityId: "",
  canonicalDomain: getSiteUrl(),
  heroEyebrow: "Global mobility intelligence platform",
  heroTitle: "Compare visa pathways before you relocate",
  heroSubtitle:
    "NomadIndex helps founders, freelancers and remote workers compare visa programs — income rules, processing times and residency paths in one place.",
  primaryCtaLabel: "Visa Pathway Matcher",
  primaryCtaHref: "/tools/visa-eligibility-checker",
  secondaryCtaLabel: "Compare countries",
  secondaryCtaHref: "/compare",
  featuredCountrySlugs: getFeaturedCountries().map((country) => country.slug),
  featuredVisaSlugs: getFeaturedVisas().map((visa) => visa.slug),
  featuredComparisonPairs: getFeaturedComparisonPairs().map((pair) => pair.slug),
  featuredGuideSlugs: getLatestGuides(4).map((guide) => guide.slug),
  homepageFaqs: HOMEPAGE_FAQS,
  bottomCtaTitle: "Turn research into a shortlist",
  bottomCtaDescription:
    "Run the pathway matcher, compare your top two countries, then open program pages to verify requirements with official sources.",
};

export async function getResolvedSiteSettings(): Promise<ResolvedSiteSettings> {
  const stored = await getAllSettingsMap();

  const featuredCountrySlugs = stored[SETTING_KEYS.featuredCountrySlugs]
    ? parseJsonArray(stored[SETTING_KEYS.featuredCountrySlugs])
    : DEFAULTS.featuredCountrySlugs;

  const featuredVisaSlugs = stored[SETTING_KEYS.featuredVisaSlugs]
    ? parseJsonArray(stored[SETTING_KEYS.featuredVisaSlugs])
    : DEFAULTS.featuredVisaSlugs;

  const featuredComparisonPairs = stored[SETTING_KEYS.featuredComparisonPairs]
    ? parseJsonArray(stored[SETTING_KEYS.featuredComparisonPairs])
    : DEFAULTS.featuredComparisonPairs;

  const featuredGuideSlugs = stored[SETTING_KEYS.featuredGuideSlugs]
    ? parseJsonArray(stored[SETTING_KEYS.featuredGuideSlugs])
    : DEFAULTS.featuredGuideSlugs;

  const homepageFaqs = stored[SETTING_KEYS.homepageFaqs]
    ? parseJsonFaqs(stored[SETTING_KEYS.homepageFaqs])
    : DEFAULTS.homepageFaqs;

  return {
    siteTitle: stored[SETTING_KEYS.siteTitle] || DEFAULTS.siteTitle,
    homepageTitle: stored[SETTING_KEYS.homepageTitle] || DEFAULTS.homepageTitle,
    homepageDescription:
      stored[SETTING_KEYS.homepageDescription] || DEFAULTS.homepageDescription,
    defaultOgTitle: stored[SETTING_KEYS.defaultOgTitle] || DEFAULTS.defaultOgTitle,
    defaultOgDescription:
      stored[SETTING_KEYS.defaultOgDescription] || DEFAULTS.defaultOgDescription,
    organizationName:
      stored[SETTING_KEYS.organizationName] || DEFAULTS.organizationName,
    contactEmail: stored[SETTING_KEYS.contactEmail] || DEFAULTS.contactEmail,
    googleSearchConsole:
      stored[SETTING_KEYS.googleSearchConsole] || DEFAULTS.googleSearchConsole,
    bingVerification:
      stored[SETTING_KEYS.bingVerification] || DEFAULTS.bingVerification,
    googleAnalyticsId:
      stored[SETTING_KEYS.googleAnalyticsId] || DEFAULTS.googleAnalyticsId,
    microsoftClarityId:
      stored[SETTING_KEYS.microsoftClarityId] || DEFAULTS.microsoftClarityId,
    canonicalDomain:
      stored[SETTING_KEYS.canonicalDomain] || DEFAULTS.canonicalDomain,
    heroEyebrow: stored[SETTING_KEYS.heroEyebrow] || DEFAULTS.heroEyebrow,
    heroTitle: stored[SETTING_KEYS.heroTitle] || DEFAULTS.heroTitle,
    heroSubtitle: stored[SETTING_KEYS.heroSubtitle] || DEFAULTS.heroSubtitle,
    primaryCtaLabel:
      stored[SETTING_KEYS.primaryCtaLabel] || DEFAULTS.primaryCtaLabel,
    primaryCtaHref: stored[SETTING_KEYS.primaryCtaHref] || DEFAULTS.primaryCtaHref,
    secondaryCtaLabel:
      stored[SETTING_KEYS.secondaryCtaLabel] || DEFAULTS.secondaryCtaLabel,
    secondaryCtaHref:
      stored[SETTING_KEYS.secondaryCtaHref] || DEFAULTS.secondaryCtaHref,
    featuredCountrySlugs:
      featuredCountrySlugs.length > 0
        ? featuredCountrySlugs
        : DEFAULTS.featuredCountrySlugs,
    featuredVisaSlugs:
      featuredVisaSlugs.length > 0 ? featuredVisaSlugs : DEFAULTS.featuredVisaSlugs,
    featuredComparisonPairs:
      featuredComparisonPairs.length > 0
        ? featuredComparisonPairs
        : DEFAULTS.featuredComparisonPairs,
    featuredGuideSlugs:
      featuredGuideSlugs.length > 0
        ? featuredGuideSlugs
        : DEFAULTS.featuredGuideSlugs,
    homepageFaqs:
      homepageFaqs.length > 0 ? homepageFaqs : DEFAULTS.homepageFaqs,
    bottomCtaTitle: stored[SETTING_KEYS.bottomCtaTitle] || DEFAULTS.bottomCtaTitle,
    bottomCtaDescription:
      stored[SETTING_KEYS.bottomCtaDescription] || DEFAULTS.bottomCtaDescription,
  };
}

export { DEFAULTS as SITE_SETTINGS_DEFAULTS };

export function resolveFeaturedCountries(settings: ResolvedSiteSettings): Country[] {
  const resolved = settings.featuredCountrySlugs
    .map((slug) => getCountryBySlug(slug))
    .filter((country): country is Country => Boolean(country));
  return resolved.length > 0 ? resolved : getFeaturedCountries();
}

export function resolveFeaturedVisas(settings: ResolvedSiteSettings): VisaProgram[] {
  const resolved = settings.featuredVisaSlugs
    .map((slug) => getVisaBySlug(slug))
    .filter((visa): visa is VisaProgram => Boolean(visa));
  return resolved.length > 0 ? resolved : getFeaturedVisas();
}

export function resolveFeaturedComparisonSlugs(settings: ResolvedSiteSettings): string[] {
  return settings.featuredComparisonPairs.length > 0
    ? settings.featuredComparisonPairs
    : getFeaturedComparisonPairs().map((pair) => pair.slug);
}

export function resolveFeaturedGuides(settings: ResolvedSiteSettings): Guide[] {
  const resolved = settings.featuredGuideSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((guide): guide is Guide => Boolean(guide));
  return resolved.length > 0 ? resolved : getLatestGuides(4);
}
