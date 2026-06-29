import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Scale,
  Sparkles,
  XCircle,
} from "lucide-react";

import { DataVerificationNotice } from "@/components/data-verification-notice";
import { DataTrustFooter } from "@/components/data-trust-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { InternalLinksSection } from "@/components/seo/internal-links-section";
import { MetricCard } from "@/components/metric-card";
import { RelatedComparisons } from "@/components/related-comparisons";
import { RelatedGuides } from "@/components/guides/related-guides";
import { RelatedVisas } from "@/components/related-visas";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SourceCard } from "@/components/source-card";
import { VisaDetailHero } from "@/components/visa-detail-hero";
import { VerificationBadge } from "@/components/verification-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  getAllCountries,
  getAllVisaPrograms,
  getCountryBySlug,
  getFeaturedComparisonsForCountry,
  getGuidesForVisa,
  getRelatedVisasSameCountry,
  getRelatedVisasSameType,
  getVisaBySlug,
} from "@/data";
import { visaPageLinks } from "@/lib/internal-links";
import { formatCurrencyAmount, formatMinIncome } from "@/lib/format";
import {
  REQUIREMENT_LEVEL_LABELS,
  VISA_TYPE_LABELS,
} from "@/lib/visa-types";
import { generateVisaSemanticContent } from "@/lib/visa-content";
import { SemanticFactsList } from "@/components/semantic/semantic-facts-list";
import { SemanticFaqSection } from "@/components/semantic/semantic-faq-section";
import { SemanticKeyTakeaways } from "@/components/semantic/semantic-key-takeaways";
import { SemanticSummaryBlock } from "@/components/semantic/semantic-summary-block";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildWebPageJsonLd,
  createNotFoundMetadata,
  createPageMetadata,
  VISA_METADATA_DESCRIPTION,
  VISA_METADATA_TITLE,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllVisaPrograms().map((program) => ({
    slug: program.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getVisaBySlug(slug);
  const country = program ? getCountryBySlug(program.countrySlug) : undefined;

  if (!program || !country) {
    return createNotFoundMetadata("Visa program not found");
  }

  return createPageMetadata({
    title: VISA_METADATA_TITLE(program.name, country.name),
    description: VISA_METADATA_DESCRIPTION(program.name, country.name),
    path: `/visas/${program.slug}`,
  });
}

function formatProcessingTime(processingTime: string | null): string {
  return processingTime ?? "Not specified";
}

function formatVerifiedDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMetricValue(
  program: NonNullable<ReturnType<typeof getVisaBySlug>>,
  field: "income" | "fee"
): string {
  if (field === "income") {
    const income = formatMinIncome(program);
    if (!income) {
      return "Varies";
    }
    return program.verificationStatus === "verified"
      ? income
      : `${income} (est.)`;
  }

  if (program.applicationFee == null) {
    return "Varies";
  }

  const fee = formatCurrencyAmount(program.applicationFee, program.currency);
  return program.verificationStatus === "verified" ? fee : `${fee} (est.)`;
}

function BoolIndicator({ value, label }: { value: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-4 py-3">
      {value ? (
        <CheckCircle2 className="size-5 shrink-0 text-available-text" />
      ) : (
        <XCircle className="size-5 shrink-0 text-brand-muted" />
      )}
      <span className="text-sm text-ink">{label}</span>
    </div>
  );
}

export default async function VisaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = getVisaBySlug(slug);

  if (!program) {
    notFound();
  }

  const country = getCountryBySlug(program.countrySlug);
  if (!country) {
    notFound();
  }

  const countriesBySlug = Object.fromEntries(
    getAllCountries().map((c) => [c.slug, c])
  );

  const sameCountry = getRelatedVisasSameCountry(
    program.countrySlug,
    program.slug
  );
  const sameType = getRelatedVisasSameType(program.type, program.slug);
  const relatedGuides = getGuidesForVisa(program.slug);
  const relatedComparisons = getFeaturedComparisonsForCountry(
    program.countrySlug,
    6
  );
  const relatedPageLinks = visaPageLinks(program, country, {
    sameCountry,
    sameType,
  });
  const semantic = generateVisaSemanticContent(program, country);
  const faqs = semantic.faqs;
  const pageTitle = VISA_METADATA_TITLE(program.name, country.name);
  const metaDescription = VISA_METADATA_DESCRIPTION(program.name, country.name);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Visas", path: "/visas" },
            { name: country.name, path: `/countries/${country.slug}` },
            { name: program.name, path: `/visas/${program.slug}` },
          ]),
          buildWebPageJsonLd({
            name: pageTitle,
            description: metaDescription,
            path: `/visas/${program.slug}`,
            dateModified: program.lastVerified,
          }),
          buildFaqPageJsonLd(faqs),
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <VisaDetailHero program={program} country={country} />

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              value={formatMetricValue(program, "income")}
              label="Min. income"
              icon={Banknote}
            />
            <MetricCard
              value={formatMetricValue(program, "fee")}
              label="Application fee"
              icon={Coins}
            />
            <MetricCard
              value={formatProcessingTime(program.processingTime)}
              label="Processing time"
              icon={Clock}
            />
            <MetricCard
              value={program.stayDuration}
              label="Stay duration"
              icon={Calendar}
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <SemanticSummaryBlock label="Quick answer">
              <p>{semantic.quickAnswer}</p>
            </SemanticSummaryBlock>
            <SemanticSummaryBlock label="What you'll learn" id="what-youll-learn">
              <p>{semantic.definition}</p>
            </SemanticSummaryBlock>
            <SemanticKeyTakeaways takeaways={semantic.keyTakeaways} />
            <SemanticFactsList
              facts={semantic.structuredFacts}
              title="At a glance"
              id="at-a-glance"
            />
          </div>
        </section>

        <section className="border-t border-border/60 bg-neutral-bg/40 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="section-heading">
              What are the {program.name} requirements?
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Overview based on publicly available information — not a complete
              application checklist.
            </p>

            <div className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-background">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-1/3 font-medium text-brand-muted">
                      Requirement level
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {REQUIREMENT_LEVEL_LABELS[program.requirementLevel]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-brand-muted">
                      Visa type
                    </TableCell>
                    <TableCell>{VISA_TYPE_LABELS[program.type]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-brand-muted">
                      Minimum income
                    </TableCell>
                    <TableCell>{formatMetricValue(program, "income")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-brand-muted">
                      Application fee
                    </TableCell>
                    <TableCell>{formatMetricValue(program, "fee")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-brand-muted">
                      Processing time
                    </TableCell>
                    <TableCell>{formatProcessingTime(program.processingTime)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-brand-muted">
                      Stay duration
                    </TableCell>
                    <TableCell>{program.stayDuration}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="section-heading">
            Does {program.name} allow family, renewal and citizenship?
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <BoolIndicator
              value={program.familyAllowed}
              label={
                program.familyAllowed
                  ? "Family members may be included"
                  : "Family inclusion not available"
              }
            />
            <BoolIndicator
              value={program.renewable}
              label={
                program.renewable
                  ? "Permit is renewable"
                  : "Not renewable under this route"
              }
            />
            <BoolIndicator
              value={program.citizenshipPath}
              label={
                program.citizenshipPath
                  ? "May lead to citizenship"
                  : "No direct citizenship path"
              }
            />
          </div>
        </section>

        {program.taxNotes && (
          <section className="border-t border-border/60 bg-neutral-bg/40 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="section-heading">
                What tax notes apply to {program.name}?
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-brand-muted">
                {program.taxNotes}
              </p>
              <p className="mt-3 text-xs text-brand-muted">
                Tax treatment varies by individual circumstances. Consult a
                qualified tax advisor before relocating.
              </p>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <DataVerificationNotice variant="inline" className="mb-6" />
          <SourceCard
            url={program.officialSourceUrl}
            lastVerified={program.lastVerified}
            verificationStatus={program.verificationStatus}
            program={program}
          />
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-brand-muted">
            <span>Last verified: {formatVerifiedDate(program.lastVerified)}</span>
            <VerificationBadge status={program.verificationStatus} />
          </div>
        </section>

        <section className="border-t border-border/60 bg-neutral-bg/40 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
            <RelatedComparisons
              pairs={relatedComparisons}
              title="Related comparisons"
              description={`Side-by-side comparisons involving ${country.name}.`}
            />
            <RelatedVisas
              title="Other programs in this country"
              description={`More visa options in ${country.name}.`}
              programs={sameCountry}
              countriesBySlug={countriesBySlug}
            />
            <RelatedVisas
              title={`More ${VISA_TYPE_LABELS[program.type]} visas`}
              description="Similar programs in other countries."
              programs={sameType}
              countriesBySlug={countriesBySlug}
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-linear-to-br from-primary-soft to-background p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-navy">
                Compare or match programs
              </h2>
              <p className="mt-1 max-w-md text-sm text-brand-muted">
                See how {program.name} stacks up against other programs or run a
                quick program match check.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-primary/25 text-primary-dark hover:bg-primary-soft"
              >
                <Link href={`/compare?a=${country.slug}`}>
                  <Scale className="size-4" />
                  Compare this visa
                </Link>
              </Button>
              <Button asChild>
                <Link href="/tools/visa-eligibility-checker">
                  <Sparkles className="size-4" />
                  Visa Pathway Matcher
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <RelatedGuides
            guides={relatedGuides}
            title={`Guides mentioning ${program.name}`}
            description="Structured playbooks referencing this visa program."
          />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <SemanticFaqSection faqs={faqs} />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <InternalLinksSection title="Related pages" links={relatedPageLinks} />
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
