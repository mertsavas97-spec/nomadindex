import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, MapPin, Scale, Sparkles } from "lucide-react";

import { DataVerificationNotice } from "@/components/data-verification-notice";
import { DirectoryHero, PageContainer } from "@/components/layout/page-container";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolCard } from "@/components/tool-card";
import { DataTrustFooter } from "@/components/data-trust-footer";
import { SemanticKeyTakeaways } from "@/components/semantic/semantic-key-takeaways";
import { SemanticSummaryBlock } from "@/components/semantic/semantic-summary-block";
import { buildBreadcrumbJsonLd, createPageMetadata, withSiteTitle } from "@/lib/seo";
import { TOOL_LINKS } from "@/lib/tools";

const TOOL_ICONS = {
  "visa-eligibility-checker": Sparkles,
  "income-requirement-calculator": Calculator,
  "relocation-cost-calculator": MapPin,
  "country-comparison-tool": Scale,
} as const;

export const metadata: Metadata = createPageMetadata({
  title: withSiteTitle("Planning Tools"),
  description:
    "Match visa pathways, compare income minimums, estimate relocation costs and preview country comparisons — planning tools powered by NomadIndex data.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Tools", path: "/tools" }])} />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <DirectoryHero
          title="Planning tools"
          description={
            <>
              Interactive calculators and checkers powered by NomadIndex&apos;s
              local visa dataset. Use them to narrow destinations — then verify
              everything with official sources.
            </>
          }
        />

        <PageContainer className="section-padding">
          <div className="space-y-6">
            <SemanticSummaryBlock label="Quick answer">
              <p>
                NomadIndex planning tools help remote workers, freelancers and
                founders match visa pathways, compare income minimums, estimate
                relocation costs and preview country comparisons — all powered by
                the same local immigration dataset used across the site.
              </p>
            </SemanticSummaryBlock>
            <SemanticKeyTakeaways
              takeaways={[
                "Visa eligibility checker matches your profile to tracked visa and residency routes",
                "Income requirement calculator converts program minimums into planning figures",
                "Relocation cost calculator estimates setup and monthly living costs by destination",
                "Country comparison tool previews side-by-side visa and residency data before you open a full compare page",
              ]}
            />
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {TOOL_LINKS.map((tool) => {
              const Icon = TOOL_ICONS[tool.slug];
              return (
                <ToolCard
                  key={tool.slug}
                  title={tool.title}
                  description={tool.description}
                  icon={Icon}
                  href={`/tools/${tool.slug}`}
                />
              );
            })}
          </div>
        </PageContainer>

        <section className="border-t border-border/60 bg-neutral-bg/40 section-padding">
          <PageContainer>
            <h2 className="section-heading">How do NomadIndex planning tools work?</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-background p-5 transition-shadow hover:shadow-sm">
                <p className="font-medium text-navy">Local visa dataset</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  Tools read from the same 62-program, 22-country dataset used
                  across the site — no live API calls.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background p-5 transition-shadow hover:shadow-sm">
                <p className="font-medium text-navy">Estimate markers</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  Currency conversion, applicant multipliers and setup costs use
                  static planning estimates clearly labelled as such.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background p-5 transition-shadow hover:shadow-sm sm:col-span-2 lg:col-span-1">
                <p className="font-medium text-navy">Status aware</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  Programs under source review or marked as estimates are labelled
                  clearly so you know when to confirm figures.{" "}
                  <Link
                    href="/methodology"
                    className="font-medium text-primary-dark underline-offset-4 hover:text-primary hover:underline"
                  >
                    See how we verify data
                  </Link>
                  .
                </p>
              </div>
            </div>
          </PageContainer>
        </section>

        <PageContainer className="section-padding">
          <DataVerificationNotice variant="tool" className="mb-4" />
          <DataTrustFooter className="mt-4" />
          <Link href="/countries" className="link-action mt-6">
            Browse countries →
          </Link>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
