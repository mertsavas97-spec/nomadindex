import type { InternalLinkItem } from "@/components/seo/internal-links-section";
import type { Country } from "@/types/nomadindex";
import type { VisaProgram } from "@/types/nomadindex";
import type { Guide } from "@/types/guides";
import type { CountryPair } from "@/types/nomadindex";

import {
  getComparisonsForCountry,
  getFeaturedComparisonsForCountry,
} from "@/data/comparisons";
import { getCountryBySlug } from "@/data/countries";
import { getAllCountries } from "@/data/countries";
import { getGuidesForCountry, getGuidesForVisa } from "@/data/guides";
import { TOOL_LINKS } from "@/lib/tools";

export const HUB_CROSS_LINKS: InternalLinkItem[] = [
  {
    href: "/countries",
    label: "Country directory",
    description: "Browse all tracked destinations",
  },
  {
    href: "/visas",
    label: "Visa program directory",
    description: "Immigration routes by country",
  },
  {
    href: "/compare",
    label: "Compare countries",
    description: "Side-by-side visa comparisons",
  },
  {
    href: "/guides",
    label: "Relocation guides",
    description: "Structured planning playbooks",
  },
  {
    href: "/tools",
    label: "Planning tools",
    description: "Calculators and pathway matchers",
  },
  {
    href: "/methodology",
    label: "Data methodology",
    description: "How NomadIndex verifies data",
  },
];

export function hubCrossLinks(excludeHref?: string): InternalLinkItem[] {
  if (!excludeHref) {
    return HUB_CROSS_LINKS;
  }
  return HUB_CROSS_LINKS.filter((link) => link.href !== excludeHref);
}

export function methodologyLink(): InternalLinkItem {
  return { href: "/methodology", label: "Data methodology" };
}

export function toolLinks(limit = 4): InternalLinkItem[] {
  return TOOL_LINKS.slice(0, limit).map((tool) => ({
    href: `/tools/${tool.slug}`,
    label: tool.title,
  }));
}

export function countryOverviewLink(country: Country): InternalLinkItem {
  return {
    href: `/countries/${country.slug}`,
    label: `${country.flagEmoji} ${country.name} overview`,
  };
}

export function comparePairLink(pair: CountryPair): InternalLinkItem {
  const countryA = getCountryBySlug(pair.countryASlug);
  const countryB = getCountryBySlug(pair.countryBSlug);
  return {
    href: `/compare/${pair.slug}`,
    label: `${countryA?.name ?? pair.countryASlug} vs ${countryB?.name ?? pair.countryBSlug}`,
  };
}

export function visaPageLinks(
  program: VisaProgram,
  country: Country,
  options: {
    sameCountry?: VisaProgram[];
    sameType?: VisaProgram[];
  } = {}
): InternalLinkItem[] {
  const links: InternalLinkItem[] = [
    methodologyLink(),
    countryOverviewLink(country),
    { href: "/visas", label: "Visa program directory" },
    { href: "/guides", label: "Relocation guides" },
    { href: `/compare?a=${country.slug}`, label: `Compare ${country.name}` },
    ...getFeaturedComparisonsForCountry(country.slug, 4).map(comparePairLink),
    ...(options.sameCountry ?? [])
      .slice(0, 3)
      .map((p) => ({
        href: `/visas/${p.slug}`,
        label: p.name,
      })),
    ...(options.sameType ?? [])
      .slice(0, 2)
      .map((p) => ({
        href: `/visas/${p.slug}`,
        label: p.name,
      })),
    ...getGuidesForVisa(program.slug)
      .slice(0, 3)
      .map((guide) => ({
        href: `/guides/${guide.slug}`,
        label: guide.title,
      })),
    ...toolLinks(3),
  ];

  return dedupeLinks(links);
}

export function comparePageLinks(
  countryASlug: string,
  countryBSlug: string,
  options: {
    visasA?: VisaProgram[];
    visasB?: VisaProgram[];
    guides?: Guide[];
  } = {}
): InternalLinkItem[] {
  const countryA = getCountryBySlug(countryASlug);
  const countryB = getCountryBySlug(countryBSlug);

  const links: InternalLinkItem[] = [
    methodologyLink(),
    { href: "/compare", label: "All country comparisons" },
    ...(countryA ? [countryOverviewLink(countryA)] : []),
    ...(countryB ? [countryOverviewLink(countryB!)] : []),
    ...getComparisonsForCountry(countryASlug, 4).map(comparePairLink),
    ...getComparisonsForCountry(countryBSlug, 4)
      .filter((pair) => pair.slug !== `${countryASlug}-vs-${countryBSlug}`)
      .slice(0, 2)
      .map(comparePairLink),
    ...(options.visasA ?? []).slice(0, 3).map((program) => ({
      href: `/visas/${program.slug}`,
      label: `${countryA?.flagEmoji ?? ""} ${program.name}`.trim(),
    })),
    ...(options.visasB ?? []).slice(0, 3).map((program) => ({
      href: `/visas/${program.slug}`,
      label: `${countryB?.flagEmoji ?? ""} ${program.name}`.trim(),
    })),
    ...(options.guides ?? []).slice(0, 4).map((guide) => ({
      href: `/guides/${guide.slug}`,
      label: guide.title,
    })),
    { href: "/visas", label: "Visa program directory" },
    { href: "/guides", label: "Relocation guides" },
    ...toolLinks(3),
  ];

  return dedupeLinks(links);
}

export function countryPageLinks(
  country: Country,
  options: {
    relatedCountries?: Country[];
    comparisons?: CountryPair[];
    visas?: VisaProgram[];
    guides?: Guide[];
  } = {}
): InternalLinkItem[] {
  const links: InternalLinkItem[] = [
    methodologyLink(),
    { href: "/countries", label: "Country directory" },
    { href: "/visas", label: "Visa program directory" },
    ...getFeaturedComparisonsForCountry(country.slug, 4).map(comparePairLink),
    ...(options.comparisons ?? []).slice(0, 2).map(comparePairLink),
    ...(options.relatedCountries ?? []).slice(0, 3).map((c) => ({
      href: `/countries/${c.slug}`,
      label: `${c.flagEmoji} ${c.name}`,
    })),
    ...(options.visas ?? []).slice(0, 3).map((program) => ({
      href: `/visas/${program.slug}`,
      label: program.name,
    })),
    ...(options.guides ?? []).slice(0, 3).map((guide) => ({
      href: `/guides/${guide.slug}`,
      label: guide.title,
    })),
    ...getGuidesForCountry(country.slug)
      .slice(0, 2)
      .map((guide) => ({
        href: `/guides/${guide.slug}`,
        label: guide.title,
      })),
    ...toolLinks(2),
    { href: "/compare", label: "Compare countries" },
  ];

  return dedupeLinks(links);
}

export function popularDestinationLinks(limit = 6): InternalLinkItem[] {
  return getAllCountries()
    .slice(0, limit)
    .map((country) => ({
      href: `/countries/${country.slug}`,
      label: `${country.flagEmoji} ${country.name}`,
    }));
}

function dedupeLinks(links: InternalLinkItem[]): InternalLinkItem[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }
    seen.add(link.href);
    return true;
  });
}
