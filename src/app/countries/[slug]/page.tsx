import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CountryBestFor } from "@/components/country/country-best-for";
import { CountryFaqSection } from "@/components/country/country-faq";
import { CountryFeaturedComparisons } from "@/components/country/country-featured-comparisons";
import { CountryHero } from "@/components/country/country-hero";
import { CountryRichContent } from "@/components/country/country-rich-content";
import { CountrySnapshot } from "@/components/country/country-snapshot";
import { PlanningToolsSection } from "@/components/country/planning-tools-section";
import { SemanticKeyTakeaways } from "@/components/semantic/semantic-key-takeaways";
import { SemanticSummaryBlock } from "@/components/semantic/semantic-summary-block";
import { DataTrustFooter } from "@/components/data-trust-footer";
import { OfficialSourceList } from "@/components/official-source-list";
import { RelatedGuides } from "@/components/guides/related-guides";
import { RelatedCountries } from "@/components/related-countries";
import { InternalLinksSection } from "@/components/seo/internal-links-section";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisaProgramCard } from "@/components/visa-program-card";
import { getCountryMinIncomeRange } from "@/data/comparisons";
import {
  getAllCountries,
  getFeaturedComparisonsForCountry,
  getCountryBySlug,
  getGuidesForCountry,
  getImmigrationVisasByCountry,
  getRelatedCountries,
  getVisasByCountry,
} from "@/data";
import { generateCountryPageContent, getCountryH1 } from "@/lib/country-content";
import {
  getCountryEditorial,
  getCountryQuickStats,
  getCountrySnapshot,
  getFeaturedPrograms,
  getRemainingPrograms,
} from "@/lib/country-stats";
import {
  buildBreadcrumbJsonLd,
  buildCountryVisaItemListJsonLd,
  buildFaqPageJsonLd,
  buildWebPageJsonLd,
  COUNTRY_METADATA_DESCRIPTION,
  COUNTRY_METADATA_TITLE,
  createNotFoundMetadata,
  createPageMetadata,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCountries().map((country) => ({
    slug: country.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return createNotFoundMetadata("Country not found");
  }

  const immigrationCount = getImmigrationVisasByCountry(slug).length;

  return createPageMetadata({
    title: COUNTRY_METADATA_TITLE(country.name),
    description: COUNTRY_METADATA_DESCRIPTION(country.name, immigrationCount, {
      incomeRange: getCountryMinIncomeRange(slug),
      citizenshipYears: country.citizenshipYears,
    }),
    path: `/countries/${country.slug}`,
  });
}

export default async function CountryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const visas = getVisasByCountry(slug);
  const related = getRelatedCountries(slug);
  const featuredComparisons = getFeaturedComparisonsForCountry(slug, 4);
  const relatedGuides = getGuidesForCountry(slug);
  const programCounts = Object.fromEntries(
    getAllCountries().map((c) => [c.slug, getImmigrationVisasByCountry(c.slug).length])
  );

  const snapshot = getCountrySnapshot(country, visas);
  const quickStats = getCountryQuickStats(country, visas);
  const editorial = getCountryEditorial(country, visas);
  const featuredPrograms = getFeaturedPrograms(visas);
  const remainingPrograms = getRemainingPrograms(visas, featuredPrograms);
  const pageContent = generateCountryPageContent({
    country,
    visas,
    comparisons: featuredComparisons,
    guides: relatedGuides,
  });

  const officialSources = [
    ...new Map(
      visas.map((v) => [v.officialSourceUrl, v.officialSourceUrl])
    ).values(),
  ];

  const pageTitle = getCountryH1(country.name);
  const metaDescription = COUNTRY_METADATA_DESCRIPTION(country.name, visas.length, {
    incomeRange: getCountryMinIncomeRange(slug),
    citizenshipYears: country.citizenshipYears,
  });

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Countries", path: "/countries" },
            { name: country.name, path: `/countries/${country.slug}` },
          ]),
          buildWebPageJsonLd({
            name: pageTitle,
            description: metaDescription,
            path: `/countries/${country.slug}`,
            dateModified: country.lastReviewed,
          }),
          buildFaqPageJsonLd(pageContent.faqs),
          buildCountryVisaItemListJsonLd(country.name, visas),
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <CountryHero country={country} quickStats={quickStats} />

        <section className="border-b border-border/60 bg-neutral-bg/40 py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <CountrySnapshot snapshot={snapshot} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <SemanticSummaryBlock label="Quick answer">
              <p>{pageContent.quickAnswer}</p>
            </SemanticSummaryBlock>
            <SemanticKeyTakeaways takeaways={pageContent.keyTakeaways} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <CountryRichContent content={pageContent} countryName={country.name} />
        </section>

        <section className="border-t border-border/60 bg-neutral-bg/40 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
            <CountryFeaturedComparisons
              country={country}
              pairs={featuredComparisons}
            />
            <CountryBestFor editorial={editorial} countryName={country.name} />
          </div>
        </section>

        {featuredPrograms.length > 0 && (
          <section className="border-t border-border/60 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="section-heading">
                Most relevant visa pathways
              </h2>
              <p className="mt-1 text-brand-muted">
                Explore the most relevant visa pathways currently available for
                remote workers, founders and skilled professionals.
              </p>
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {featuredPrograms.map((program) => (
                  <VisaProgramCard
                    key={program.id}
                    program={program}
                    country={country}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {remainingPrograms.length > 0 && (
          <section className="border-t border-border/60 bg-neutral-bg/40 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="section-heading">
                All visa pathways
              </h2>
              <p className="mt-1 text-brand-muted">
                {visas.length} program{visas.length === 1 ? "" : "s"} tracked
                for {country.name} — including routes beyond the featured
                shortlist above.
              </p>
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {remainingPrograms.map((program) => (
                  <VisaProgramCard
                    key={program.id}
                    program={program}
                    country={country}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-border/60 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <PlanningToolsSection country={country} />
          </div>
        </section>

        <section className="border-t border-border/60 bg-neutral-bg/40 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <RelatedGuides
              guides={relatedGuides}
              title="Read before you apply"
              description={`Practical guides covering ${country.name} visas, comparisons and relocation planning.`}
            />
          </div>
        </section>

        <section className="border-t border-border/60 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <CountryFaqSection faqs={pageContent.faqs} countryName={country.name} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border/60 bg-background p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Official government resources
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Confirm every requirement with the issuing authority before you
              apply. See our{" "}
              <Link
                href="/methodology"
                className="font-medium text-primary-dark hover:text-primary"
              >
                data methodology
              </Link>{" "}
              for how NomadIndex tracks sources.
            </p>
            <OfficialSourceList sources={officialSources} programs={visas} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <RelatedCountries
            countries={related}
            programCounts={programCounts}
          />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <InternalLinksSection
            title="Related pages"
            links={[
              {
                href: "/methodology",
                label: "Data methodology",
              },
              {
                href: "/visas",
                label: "Visa program directory",
              },
              ...related.slice(0, 2).map((relatedCountry) => ({
                href: `/countries/${relatedCountry.slug}`,
                label: `${relatedCountry.flagEmoji} ${relatedCountry.name}`,
              })),
              ...featuredComparisons.slice(0, 2).map((pair) => ({
                href: `/compare/${pair.slug}`,
                label: `${getCountryBySlug(pair.countryASlug)?.name ?? pair.countryASlug} vs ${getCountryBySlug(pair.countryBSlug)?.name ?? pair.countryBSlug}`,
              })),
              ...getImmigrationVisasByCountry(slug)
                .slice(0, 2)
                .map((program) => ({
                  href: `/visas/${program.slug}`,
                  label: program.name,
                })),
              {
                href: "/tools/visa-eligibility-checker",
                label: "Visa Pathway Matcher",
              },
              {
                href: "/tools/country-comparison-tool",
                label: "Country Comparison Tool",
              },
              ...relatedGuides.slice(0, 2).map((guide) => ({
                href: `/guides/${guide.slug}`,
                label: guide.title,
              })),
            ]}
          />
        </section>

        <section className="border-t border-border/60 py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <DataTrustFooter />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
