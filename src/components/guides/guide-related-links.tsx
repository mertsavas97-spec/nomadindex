import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CountryCard } from "@/components/country-card";
import { InternalLinksSection } from "@/components/seo/internal-links-section";
import { VisaProgramCard } from "@/components/visa-program-card";
import {
  getCountryBySlug,
  getVisaBySlug,
  getVisasByCountry,
} from "@/data";
import { buildGuideCompareLinks } from "@/lib/guide-content";
import { TOOL_LINKS } from "@/lib/tools";
import type { Guide } from "@/types/guides";

type GuideRelatedLinksProps = {
  guide: Guide;
};

export function GuideRelatedLinks({ guide }: GuideRelatedLinksProps) {
  const countries = guide.relatedCountrySlugs
    .map((slug) => getCountryBySlug(slug))
    .filter((c) => c !== undefined)
    .slice(0, 4);

  const visas = guide.relatedVisaSlugs
    .map((slug) => {
      const program = getVisaBySlug(slug);
      const country = program
        ? getCountryBySlug(program.countrySlug)
        : undefined;
      return program && country ? { program, country } : null;
    })
    .filter((item) => item !== null)
    .slice(0, 4);

  const compareLinks = buildGuideCompareLinks(guide);

  const utilityLinks: { href: string; label: string; description?: string }[] =
    [
      { href: "/methodology", label: "Data methodology" },
      { href: "/countries", label: "Country directory" },
      { href: "/visas", label: "Visa program directory" },
      { href: "/compare", label: "Compare countries" },
      { href: "/tools", label: "Planning tools" },
    ];

  for (const compare of compareLinks) {
    utilityLinks.unshift({
      href: compare.href,
      label: compare.label,
      description: "Dataset-driven comparison",
    });
  }

  const relevantTools = TOOL_LINKS.filter((tool) => {
    if (guide.targetAudience === "founders") {
      return tool.slug === "country-comparison-tool";
    }
    if (guide.category === "planning" || guide.category === "visa-playbook") {
      return (
        tool.slug === "income-requirement-calculator" ||
        tool.slug === "visa-eligibility-checker"
      );
    }
    return true;
  }).slice(0, 3);

  for (const tool of relevantTools) {
    if (!utilityLinks.some((link) => link.href === `/tools/${tool.slug}`)) {
      utilityLinks.push({
        href: `/tools/${tool.slug}`,
        label: tool.title,
      });
    }
  }

  return (
    <div id="related-resources" className="scroll-mt-24 space-y-12">
      <div>
        <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
          Related Resources
        </h2>
        <p className="mt-1 text-sm text-brand-muted">
          Countries, visa programs, compare pages and planning tools linked to
          this guide.
        </p>
      </div>

      {compareLinks.length > 0 && (
        <InternalLinksSection
          title="Compare pages"
          description="Side-by-side country comparisons from the NomadIndex dataset."
          links={compareLinks.map((c) => ({
            href: c.href,
            label: c.label,
          }))}
        />
      )}

      {countries.length > 0 && (
        <section>
          <h3 className="font-heading text-lg font-semibold text-navy">
            Related countries
          </h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {countries.map((country) => (
              <CountryCard
                key={country.slug}
                country={country}
                visas={getVisasByCountry(country.slug)}
              />
            ))}
          </div>
          {guide.relatedCountrySlugs.length > 4 && (
            <Link
              href="/countries"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary"
            >
              View all countries
              <ArrowRight className="size-4" />
            </Link>
          )}
        </section>
      )}

      {visas.length > 0 && (
        <section>
          <h3 className="font-heading text-lg font-semibold text-navy">
            Related visa programs
          </h3>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {visas.map(({ program, country }) => (
              <VisaProgramCard
                key={program.id}
                program={program}
                country={country}
              />
            ))}
          </div>
          {guide.relatedVisaSlugs.length > 4 && (
            <Link
              href="/visas"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary"
            >
              View all visa programs
              <ArrowRight className="size-4" />
            </Link>
          )}
        </section>
      )}

      <InternalLinksSection
        title="Directories and tools"
        description="Browse NomadIndex data and run planning calculators."
        links={utilityLinks}
      />
    </div>
  );
}
