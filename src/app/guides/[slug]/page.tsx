import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, Clock } from "lucide-react";

import { DataVerificationNotice } from "@/components/data-verification-notice";
import { RelatedGuides } from "@/components/guides/related-guides";
import { GuideEditorialByline } from "@/components/guides/guide-editorial-byline";
import { GuideKeyTakeaways } from "@/components/guides/guide-key-takeaways";
import { GuideRelatedLinks } from "@/components/guides/guide-related-links";
import { GuideSectionBlock } from "@/components/guides/guide-section";
import { GuideSummaryBox } from "@/components/guides/guide-summary-box";
import { GuideToc } from "@/components/guides/guide-toc";
import { MarkdownContent } from "@/components/markdown-content";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VerificationBadge } from "@/components/verification-badge";
import { Badge } from "@/components/ui/badge";
import { getAllGuides, getGuideBySlug, getRelatedGuides } from "@/data";
import { estimateReadingTimeFromMarkdown } from "@/lib/cms/validation";
import {
  generateEnhancedGuideContent,
  estimateGuideReadingTime,
} from "@/lib/guide-content";
import {
  GUIDE_AUDIENCE_LABELS,
  GUIDE_CATEGORY_LABELS,
} from "@/lib/guide-types";
import { getPublishedGuideBySlug } from "@/lib/guides/resolve";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  createNotFoundMetadata,
  createPageMetadata,
  GUIDE_METADATA_DESCRIPTION,
  GUIDE_METADATA_TITLE,
} from "@/lib/seo";
import { DataTrustFooter } from "@/components/data-trust-footer";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({
    slug: guide.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPublishedGuideBySlug(slug);

  if (!guide) {
    return createNotFoundMetadata("Guide not found");
  }

  const title =
    guide.seoTitle?.trim() ||
    guide.ogTitle?.trim() ||
    GUIDE_METADATA_TITLE(guide.title);
  const description =
    guide.seoDescription?.trim() ||
    guide.ogDescription?.trim() ||
    GUIDE_METADATA_DESCRIPTION(guide.excerpt);

  return createPageMetadata({
    title,
    description,
    path: `/guides/${guide.slug}`,
    openGraphType: "article",
  });
}

function formatGuideDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const publicGuide = getPublishedGuideBySlug(slug)!;
  const markdownBody = publicGuide.markdownBody?.trim() ?? "";
  const useMarkdown = markdownBody.length > 0;
  const enhanced = useMarkdown ? null : generateEnhancedGuideContent(guide);
  const readingTime = useMarkdown
    ? publicGuide.readingTime || estimateReadingTimeFromMarkdown(markdownBody)
    : estimateGuideReadingTime(enhanced!.wordCount);

  const relatedGuidesList = getRelatedGuides(slug, 4);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
          buildArticleJsonLd({
            title: guide.title,
            excerpt: guide.excerpt,
            slug: guide.slug,
            datePublished: guide.datePublished,
            dateModified: guide.dateModified,
          }),
          buildFaqPageJsonLd(guide.faqs),
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <section className="border-b border-border/60 bg-linear-to-b from-primary-soft/50 to-background">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <nav className="mb-6 text-sm text-brand-muted">
              <Link href="/guides" className="hover:text-primary-dark">
                Guides
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink">{guide.title}</span>
            </nav>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {GUIDE_CATEGORY_LABELS[guide.category]}
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    {GUIDE_AUDIENCE_LABELS[guide.targetAudience]}
                  </Badge>
                  <VerificationBadge status={guide.verificationStatus} />
                </div>
                <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
                  {guide.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-brand-muted">
                  {guide.excerpt}
                </p>
                <dl className="mt-6 flex flex-wrap gap-6 text-sm text-brand-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 text-primary" aria-hidden />
                    <dt className="sr-only">Reading time</dt>
                    <dd>{readingTime} min read</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-primary" aria-hidden />
                    <dt className="sr-only">Published</dt>
                    <dd>Published {formatGuideDate(guide.datePublished)}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-primary" aria-hidden />
                    <dt className="sr-only">Last updated</dt>
                    <dd>Updated {formatGuideDate(guide.dateModified)}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <BookOpen className="size-6" aria-hidden />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div
            className={
              useMarkdown ? "max-w-3xl" : "grid gap-10 lg:grid-cols-[240px_1fr]"
            }
          >
            {!useMarkdown && enhanced ? (
              <aside className="hidden lg:block">
                <GuideToc sections={enhanced.sections} className="sticky top-24" />
              </aside>
            ) : null}

            <article className="min-w-0 space-y-10">
              <GuideEditorialByline dateModified={guide.dateModified} />

              <DataVerificationNotice variant="inline" />

              <GuideSummaryBox summary={guide.summaryBox} />

              <GuideKeyTakeaways takeaways={guide.keyTakeaways} />

              {!useMarkdown && enhanced ? (
                <div className="lg:hidden">
                  <GuideToc sections={enhanced.sections} />
                </div>
              ) : null}

              {useMarkdown ? (
                <MarkdownContent content={markdownBody} />
              ) : (
                enhanced?.sections.map((section) => (
                  <GuideSectionBlock key={section.id} section={section} />
                ))
              )}

              <section id="faq" className="scroll-mt-24">
                <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
                  Frequently asked questions
                </h2>
                <p className="mt-2 text-sm text-brand-muted">
                  Direct answers for relocation planning — confirm details with
                  official sources before applying.
                </p>
                <dl className="mt-6 space-y-6">
                  {guide.faqs.map((faq) => (
                    <div key={faq.question}>
                      <dt className="font-medium text-ink">{faq.question}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-brand-muted">
                        {faq.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </article>
          </div>
        </div>

        <section className="border-t border-border/60 bg-neutral-bg/40 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <RelatedGuides
              guides={relatedGuidesList}
              title="Related guides"
              description="More playbooks on similar countries, visa programs and relocation topics."
            />
          </div>
        </section>

        <section className="border-t border-border/60 bg-neutral-bg/40 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <GuideRelatedLinks guide={guide} />
          </div>
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
