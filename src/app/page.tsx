import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  MapPin,
  Scale,
  Sparkles,
} from "lucide-react";

import { CountryCard } from "@/components/country-card";
import { FeaturedComparisons } from "@/components/home/featured-comparisons";
import { FeaturedVisas } from "@/components/home/featured-visas";
import { HomeValueIntro } from "@/components/home/home-value-intro";
import { HomepageCta } from "@/components/home/homepage-cta";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { HowNomadIndexWorks } from "@/components/home/how-nomadindex-works";
import { LatestGuides } from "@/components/home/latest-guides";
import { TrustedSources } from "@/components/home/trusted-sources";
import { WhyNomadIndex } from "@/components/home/why-nomadindex";
import { HomeHero } from "@/components/home-hero";
import { SemanticKeyTakeaways } from "@/components/semantic/semantic-key-takeaways";
import { SemanticSummaryBlock } from "@/components/semantic/semantic-summary-block";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolCard } from "@/components/tool-card";
import {
  getAllCountries,
  getAllVisaPrograms,
  getComparisonPageCount,
  getFeaturedCountries,
  getVisasByCountry,
} from "@/data";
import {
  absoluteUrl,
  buildFaqPageJsonLd,
  buildItemListJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  createPageMetadata,
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_FAQS,
  HOMEPAGE_TITLE,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: HOMEPAGE_TITLE,
  description: HOMEPAGE_DESCRIPTION,
  path: "/",
});

const tools = [
  {
    title: "Visa Pathway Matcher",
    description:
      "Answer a few questions to see which visa programs may match dataset criteria across 22 countries.",
    icon: Sparkles,
    href: "/tools/visa-eligibility-checker",
  },
  {
    title: "Income Requirement Calculator",
    description:
      "Convert minimum income thresholds to your currency and compare affordability by country.",
    icon: Calculator,
    href: "/tools/income-requirement-calculator",
  },
  {
    title: "Relocation Cost Calculator",
    description:
      "Estimate visa fees, income buffers and rough setup costs for your target destination.",
    icon: MapPin,
    href: "/tools/relocation-cost-calculator",
  },
  {
    title: "Country Comparison Tool",
    description:
      "Build custom side-by-side comparisons across visas, taxes, costs and quality of life.",
    icon: Scale,
    href: "/tools/country-comparison-tool",
  },
] as const;

const SECTION_ALT = "border-t border-border/60 bg-neutral-bg/40 py-16 sm:py-24";
const SECTION_BASE = "border-t border-border/60 py-16 sm:py-24";

export default function Home() {
  const countries = getAllCountries();
  const visaPrograms = getAllVisaPrograms();
  const featuredCountries = getFeaturedCountries();
  const comparePageCount = getComparisonPageCount();

  const featuredVisaItems = visaPrograms
    .filter((v) => v.featured)
    .slice(0, 6)
    .map((v) => ({
      name: v.name,
      url: absoluteUrl(`/visas/${v.slug}`),
    }));

  return (
    <>
      <JsonLd
        data={[
          buildWebSiteJsonLd(),
          buildOrganizationJsonLd(),
          buildFaqPageJsonLd(HOMEPAGE_FAQS),
          buildItemListJsonLd("Featured visa programs", featuredVisaItems),
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <HomeHero
          countryCount={countries.length}
          programCount={visaPrograms.length}
          comparePageCount={comparePageCount}
          toolCount={4}
        />

        <section className="border-b border-border/60 bg-neutral-bg/40 py-10 sm:py-12">
          <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
            <SemanticSummaryBlock label="Quick answer">
              <p>
                NomadIndex is a mobility intelligence database for comparing{" "}
                <strong>visa</strong>, <strong>residency</strong> and{" "}
                <strong>startup pathway</strong> options across 22 countries.
                Use it to research <strong>digital nomad</strong>,{" "}
                <strong>freelancer</strong> and <strong>founder</strong> routes
                before <strong>relocation</strong> — with linked official sources
                and verification labels on every program.
              </p>
            </SemanticSummaryBlock>
            <SemanticKeyTakeaways
              takeaways={[
                `${countries.length} countries · ${visaPrograms.length} visa programs · ${comparePageCount} compare pages · 4 planning tools`,
                "Structured fields: minimum income, fees, processing time, family inclusion, citizenship path",
                "For remote workers, freelancers and founders comparing relocation options — not legal advice",
                "Every page includes FAQs, dataset facts and links to methodology and sources",
              ]}
            />
          </div>
        </section>

        {/* 1. Destinations */}
        <section id="countries" className={`${SECTION_BASE} pt-12 sm:pt-16`}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <HomeSectionHeader
              eyebrow="Destinations"
              title="Popular destinations"
              description="Explore visa programs, income requirements and pathways to residency in top nomad-friendly countries."
              href="/countries"
              linkLabel={`All ${countries.length} countries`}
            />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCountries.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  visas={getVisasByCountry(country.slug)}
                  href={`/countries/${country.slug}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 2. Compare */}
        <FeaturedComparisons
          comparePageCount={comparePageCount}
          className={SECTION_ALT}
        />

        {/* 3. Visa programs */}
        <FeaturedVisas className={SECTION_BASE} />

        {/* 4. How it works */}
        <HowNomadIndexWorks
          comparePageCount={comparePageCount}
          className={SECTION_ALT}
        />

        {/* 5. Guides */}
        <LatestGuides className={SECTION_BASE} />

        {/* 6. Tools */}
        <section id="tools" className={SECTION_ALT}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <HomeSectionHeader
              eyebrow="Tools"
              title="Planning tools"
              description="Interactive calculators and checkers to narrow your shortlist before verifying with official sources."
              href="/tools"
              linkLabel="All tools"
            />

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {tools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </div>
        </section>

        {/* 7. What NomadIndex is */}
        <HomeValueIntro className={SECTION_BASE} />

        {/* 8. Why NomadIndex */}
        <WhyNomadIndex className={SECTION_ALT} />

        {/* 9. Data trust */}
        <TrustedSources className={SECTION_BASE} />

        {/* 10. FAQ */}
        <section id="faq" className={SECTION_ALT}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <HomeSectionHeader
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Quick answers about what NomadIndex covers and how to use the data responsibly."
            />

            <dl className="mt-10 space-y-8">
              {HOMEPAGE_FAQS.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm"
                >
                  <dt className="font-heading text-lg font-semibold text-navy">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-sm text-brand-muted">
              Need deeper context? Read our{" "}
              <Link
                href="/methodology"
                className="font-medium text-primary-dark hover:text-primary"
              >
                data methodology
              </Link>{" "}
              or browse{" "}
              <Link
                href="/guides"
                className="font-medium text-primary-dark hover:text-primary"
              >
                relocation guides
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 11. Start planning */}
        <HomepageCta className={`${SECTION_BASE} border-t-0`} />
      </main>

      <SiteFooter />
    </>
  );
}
