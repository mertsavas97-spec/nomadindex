import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CompareSelector } from "@/components/compare-selector";
import { ComparisonPreview } from "@/components/comparison-preview";
import { DataVerificationNotice } from "@/components/data-verification-notice";
import { DirectoryHero, PageContainer } from "@/components/layout/page-container";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  comparisonDataToPreviewRows,
  getAllCountries,
  getAllCountryPairs,
  getComparisonPageCount,
  getCountryBySlug,
  getCountryComparisonData,
  getFeaturedComparisonPairs,
  getPopularComparisonPairs,
} from "@/data";
import { DataTrustFooter } from "@/components/data-trust-footer";
import { SemanticKeyTakeaways } from "@/components/semantic/semantic-key-takeaways";
import { SemanticSummaryBlock } from "@/components/semantic/semantic-summary-block";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildWebPageJsonLd,
  COMPARE_LANDING_DESCRIPTION,
  COMPARE_LANDING_FAQS,
  COMPARE_LANDING_TITLE,
  createPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: COMPARE_LANDING_TITLE,
  description: COMPARE_LANDING_DESCRIPTION,
  path: "/compare",
});

export default function ComparePage() {
  const countries = getAllCountries();
  const featuredPairs = getFeaturedComparisonPairs();
  const popularPairs = getPopularComparisonPairs();

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([{ name: "Compare", path: "/compare" }]),
          buildWebPageJsonLd({
            name: COMPARE_LANDING_TITLE,
            description: COMPARE_LANDING_DESCRIPTION,
            path: "/compare",
            dateModified: "2026-03-01",
          }),
          buildFaqPageJsonLd(COMPARE_LANDING_FAQS),
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <DirectoryHero
          title="Compare countries"
          description={
            <>
              Side-by-side visa comparisons for founders, freelancers and remote
              workers. {getComparisonPageCount()} unique pairings across{" "}
              {countries.length} countries.
            </>
          }
        />

        <PageContainer className="section-padding">
          <div className="space-y-6">
            <SemanticSummaryBlock label="Quick answer">
              <p>
                Compare countries side-by-side on visa, residency, income
                minimums, digital nomad routes and startup pathways. NomadIndex
                generates {getComparisonPageCount()} dedicated comparison pages
                for remote workers, freelancers and founders relocating abroad.
              </p>
            </SemanticSummaryBlock>
            <SemanticKeyTakeaways
              takeaways={[
                "Every unique country pair has a dedicated compare page with structured facts",
                "Side-by-side tables cover visa programs, income ranges, fees and processing times",
                "Heuristic recommendations flag better fits for remote work vs startup founders",
                "Always verify final requirements with official immigration sources",
              ]}
            />
          </div>

          <div className="mt-10 rounded-xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">
              Build a comparison
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-brand-muted">
              Select two countries to generate a side-by-side comparison page.
            </p>
            <CompareSelector
              countries={countries}
              defaultCountryA="portugal"
              defaultCountryB="spain"
              className="mt-6"
            />
          </div>
        </PageContainer>

        <section className="border-t border-border/60 bg-neutral-bg/40 section-padding">
          <PageContainer>
            <h2 className="section-heading">Featured comparisons</h2>
            <p className="section-lead">
              Popular pairings to help you start exploring.
            </p>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {featuredPairs.map((pair) => {
                const data = getCountryComparisonData(
                  pair.countryASlug,
                  pair.countryBSlug
                );
                if (!data) {
                  return null;
                }

                return (
                  <ComparisonPreview
                    key={pair.slug}
                    leftCountry={data.countryA.name}
                    leftFlag={data.countryA.flagEmoji}
                    rightCountry={data.countryB.name}
                    rightFlag={data.countryB.flagEmoji}
                    rows={comparisonDataToPreviewRows(data)}
                    href={`/compare/${pair.slug}`}
                  />
                );
              })}
            </div>
          </PageContainer>
        </section>

        <PageContainer className="section-padding">
          <h2 className="section-heading">Popular comparisons</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {popularPairs.map((pair) => {
              const countryA = getCountryBySlug(pair.countryASlug)!;
              const countryB = getCountryBySlug(pair.countryBSlug)!;

              return (
                <Link key={pair.slug} href={`/compare/${pair.slug}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer px-3 py-1.5 text-sm font-normal hover:bg-primary-soft hover:text-primary-dark"
                  >
                    {countryA.flagEmoji} {countryA.name} vs {countryB.flagEmoji}{" "}
                    {countryB.name}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </PageContainer>

        <section className="border-t border-border/60 bg-neutral-bg/40 section-padding">
          <PageContainer>
            <h2 className="section-heading">How does NomadIndex compare countries?</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-background p-5 transition-shadow hover:shadow-sm">
                <p className="font-medium text-navy">Visa program data</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  We aggregate tracked visa programs per country — digital
                  nomad, freelancer, startup and residency routes.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background p-5 transition-shadow hover:shadow-sm">
                <p className="font-medium text-navy">Ranges, not absolutes</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  Income, fee and processing figures show ranges across programs
                  where exact data varies. Estimates are clearly marked.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background p-5 transition-shadow hover:shadow-sm sm:col-span-2 lg:col-span-1">
                <p className="font-medium text-navy">Recommendations</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  Suggested winners are heuristic summaries — not personalised
                  advice. Always verify with official sources.
                </p>
              </div>
            </div>
          </PageContainer>
        </section>

        <section className="border-t border-border/60 bg-neutral-bg/40 section-padding">
          <PageContainer>
            <h2 className="section-heading">Frequently asked questions</h2>
            <dl className="mt-8 space-y-6">
              {COMPARE_LANDING_FAQS.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-medium text-navy">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </PageContainer>
        </section>

        <PageContainer className="section-padding">
          <DataVerificationNotice variant="inline" className="mb-6" />
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/20 bg-primary-soft/40 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-medium text-navy">
                {getAllCountryPairs().length} comparison pages available
              </p>
              <p className="mt-1 text-sm text-brand-muted">
                Every unique country pair has a dedicated comparison page.
              </p>
            </div>
            <Link
              href="/compare/portugal-vs-spain"
              className="link-action shrink-0"
            >
              Start with Portugal vs Spain
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <DataTrustFooter className="mt-6" />
        </PageContainer>
      </main>

      <SiteFooter />
    </>
  );
}
