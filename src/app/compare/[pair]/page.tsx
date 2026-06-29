import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Calendar } from "lucide-react";

import { CompareNarrativeContent, CompareChooseCountrySection, CompareFaqSection } from "@/components/compare/compare-rich-content";
import { ComparePairNavigation } from "@/components/compare/compare-pair-navigation";
import { CompareCountryCard } from "@/components/compare-country-card";
import { CompareTable } from "@/components/compare-table";
import { RelatedGuides } from "@/components/guides/related-guides";
import { PageContainer, PageHero } from "@/components/layout/page-container";
import { JsonLd } from "@/components/seo/json-ld";
import { InternalLinksSection } from "@/components/seo/internal-links-section";
import { RecommendationCard } from "@/components/recommendation-card";
import { RelatedComparisons } from "@/components/related-comparisons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisaProgramCard } from "@/components/visa-program-card";
import {
  getAdjacentComparisonPairs,
  getAllCountryPairs,
  getCountryComparisonData,
  getGuidesForCountry,
  getRelatedComparisons,
  resolveComparisonPairRoute,
} from "@/data";
import { comparePageLinks } from "@/lib/internal-links";
import {
  buildBreadcrumbJsonLd,
  buildCompareWebPageJsonLd,
  buildFaqPageJsonLd,
  COMPARE_METADATA_DESCRIPTION,
  COMPARE_METADATA_TITLE,
  createNotFoundMetadata,
  createPageMetadata,
} from "@/lib/seo";
import { generateComparePageContent } from "@/lib/compare-content";
import { DataTrustFooter } from "@/components/data-trust-footer";
import { SemanticKeyTakeaways } from "@/components/semantic/semantic-key-takeaways";
import { SemanticSummaryBlock } from "@/components/semantic/semantic-summary-block";

type PageProps = {
  params: Promise<{ pair: string }>;
};

export function generateStaticParams() {
  return getAllCountryPairs().map((pair) => ({
    pair: pair.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const resolved = resolveComparisonPairRoute(pair);

  if (!resolved) {
    return createNotFoundMetadata("Comparison not found");
  }

  const data = getCountryComparisonData(
    resolved.countryASlug,
    resolved.countryBSlug
  );

  if (!data) {
    return createNotFoundMetadata("Comparison not found");
  }

  return createPageMetadata({
    title: COMPARE_METADATA_TITLE(data.countryA.name, data.countryB.name),
    description: COMPARE_METADATA_DESCRIPTION(
      data.countryA.name,
      data.countryB.name
    ),
    path: `/compare/${data.slug}`,
  });
}

function formatLastUpdated(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ComparePairPage({ params }: PageProps) {
  const { pair } = await params;
  const resolved = resolveComparisonPairRoute(pair);

  if (!resolved) {
    notFound();
  }

  if (resolved.shouldRedirect) {
    redirect(`/compare/${resolved.canonicalSlug}`);
  }

  const data = getCountryComparisonData(
    resolved.countryASlug,
    resolved.countryBSlug
  );

  if (!data) {
    notFound();
  }

  const related = getRelatedComparisons(
    data.countryASlug,
    data.countryBSlug
  );
  const navigation = getAdjacentComparisonPairs(data.slug);
  const content = generateComparePageContent(data);
  const guidesA = getGuidesForCountry(data.countryASlug);
  const guidesB = getGuidesForCountry(data.countryBSlug);
  const relatedGuides = [...guidesA, ...guidesB].filter(
    (guide, index, all) => all.findIndex((g) => g.slug === guide.slug) === index
  );
  const exploreLinks = comparePageLinks(data.countryASlug, data.countryBSlug, {
    visasA: data.visasA,
    visasB: data.visasB,
    guides: relatedGuides,
  });
  const metaDescription = COMPARE_METADATA_DESCRIPTION(
    data.countryA.name,
    data.countryB.name
  );

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Compare", path: "/compare" },
            {
              name: `${data.countryA.name} vs ${data.countryB.name}`,
              path: `/compare/${data.slug}`,
            },
          ]),
          buildCompareWebPageJsonLd({
            countryAName: data.countryA.name,
            countryBName: data.countryB.name,
            path: `/compare/${data.slug}`,
            description: metaDescription,
            dateModified: data.lastUpdated,
          }),
          buildFaqPageJsonLd(content.faqs),
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <PageHero>
            <nav className="mb-6 text-sm text-brand-muted">
              <Link href="/compare" className="breadcrumb-link">
                Compare
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink">
                {data.countryA.name} vs {data.countryB.name}
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-4xl" role="img" aria-label={`${data.countryA.name} flag`}>
                {data.countryA.flagEmoji}
              </span>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
                {data.countryA.name}{" "}
                <span className="text-brand-muted">vs</span>{" "}
                {data.countryB.name}
              </h1>
              <span className="text-4xl" role="img" aria-label={`${data.countryB.name} flag`}>
                {data.countryB.flagEmoji}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-muted">
              Visa and mobility comparison for founders, freelancers and remote
              workers.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-muted">
              <Calendar className="size-4 shrink-0" aria-hidden />
              Last updated {formatLastUpdated(data.lastUpdated)}
            </p>
        </PageHero>

        <PageContainer className="section-padding pb-0">
          <div className="space-y-6">
            <SemanticSummaryBlock label="Quick answer">
              <p>{content.quickAnswer}</p>
            </SemanticSummaryBlock>
            <SemanticSummaryBlock label="Summary" id="editorial-summary">
              {content.editorialSummary.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-3 first:mt-0">
                  {paragraph}
                </p>
              ))}
            </SemanticSummaryBlock>
            <SemanticKeyTakeaways takeaways={content.keyTakeaways} />
          </div>
        </PageContainer>

        <PageContainer className="section-padding">
          <div className="grid gap-5 lg:grid-cols-2">
            <CompareCountryCard
              country={data.countryA}
              programCount={data.visasA.length}
              side="a"
            />
            <CompareCountryCard
              country={data.countryB}
              programCount={data.visasB.length}
              side="b"
            />
          </div>

          <div className="mt-10">
            <h2 className="section-heading">
              How do {data.countryA.name} and {data.countryB.name} compare side by side?
            </h2>
            <p className="section-lead text-sm">
              Highlighted cells indicate a relative advantage in our dataset.
            </p>

            <CompareTable
              countryA={data.countryA}
              countryB={data.countryB}
              rows={data.rows}
              className="mt-6"
            />
          </div>
        </PageContainer>

        <PageContainer className="section-padding">
          <h2 className="section-heading">
            Which country fits your profile?
          </h2>
          <p className="section-lead text-sm">
            Decision-oriented summaries — not definitive immigration advice.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CompareChooseCountrySection section={content.chooseCountryA} />
            <CompareChooseCountrySection section={content.chooseCountryB} />
          </div>
        </PageContainer>

        <PageContainer className="section-padding">
          <h2 className="section-heading">
            Dataset heuristics for this pairing
          </h2>
          <p className="section-lead text-sm">
            Each card states a relative lean from tracked program fields — always
            phrased as dataset guidance, not personalised advice.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                countryA={data.countryA}
                countryB={data.countryB}
              />
            ))}
          </div>
        </PageContainer>

        <section className="border-t border-border/60 section-padding">
          <PageContainer>
            <CompareNarrativeContent content={content} />
          </PageContainer>
        </section>

        <section className="border-t border-border/60 bg-neutral-bg/40 section-padding">
          <PageContainer>
            <h2 className="section-heading">Linked visa programs</h2>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 font-medium text-navy">
                  {data.countryA.flagEmoji} {data.countryA.name}
                </h3>
                <div className="space-y-4">
                  {data.visasA.map((program) => (
                    <VisaProgramCard
                      key={program.id}
                      program={program}
                      country={data.countryA}
                      variant="list"
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-medium text-navy">
                  {data.countryB.flagEmoji} {data.countryB.name}
                </h3>
                <div className="space-y-4">
                  {data.visasB.map((program) => (
                    <VisaProgramCard
                      key={program.id}
                      program={program}
                      country={data.countryB}
                      variant="list"
                    />
                  ))}
                </div>
              </div>
            </div>
          </PageContainer>
        </section>

        <PageContainer className="section-padding">
          <RelatedComparisons pairs={related} />
          <div className="mt-12">
            <RelatedGuides
              guides={relatedGuides.slice(0, 4)}
              title="Related guides"
              description={`Planning playbooks covering ${data.countryA.name}, ${data.countryB.name} or both.`}
            />
          </div>
          <InternalLinksSection
            title="Explore further"
            links={exploreLinks}
            className="mt-12"
          />
          <ComparePairNavigation
            previous={navigation.previous}
            next={navigation.next}
          />
        </PageContainer>

        <section className="border-t border-border/60 section-padding">
          <PageContainer>
            <CompareFaqSection faqs={content.faqs} />
          </PageContainer>
        </section>

        <section className="border-t border-border/60 py-10 sm:py-12">
          <PageContainer>
            <DataTrustFooter />
          </PageContainer>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
