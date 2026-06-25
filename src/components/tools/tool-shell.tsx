import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SemanticFaqSection } from "@/components/semantic/semantic-faq-section";
import { SemanticKeyTakeaways } from "@/components/semantic/semantic-key-takeaways";
import { SemanticSummaryBlock } from "@/components/semantic/semantic-summary-block";
import { JsonLd } from "@/components/seo/json-ld";
import { InternalLinksSection } from "@/components/seo/internal-links-section";
import type { InternalLinkItem } from "@/components/seo/internal-links-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DataVerificationNotice } from "@/components/data-verification-notice";
import { DataTrustFooter } from "@/components/data-trust-footer";
import type { ToolSemanticContent } from "@/lib/tool-content";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  type BreadcrumbItem,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

type ToolShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
  semantic?: ToolSemanticContent;
  relatedLinks?: InternalLinkItem[];
};

export function ToolShell({
  title,
  description,
  children,
  className,
  breadcrumbs,
  semantic,
  relatedLinks,
}: ToolShellProps) {
  const breadcrumbItems: BreadcrumbItem[] = breadcrumbs ?? [
    { name: "Tools", path: "/tools" },
    { name: title, path: "/tools" },
  ];

  const faqs = semantic?.faqs ?? [];

  const jsonLd = [
    buildBreadcrumbJsonLd(breadcrumbItems),
    ...(faqs.length > 0 ? [buildFaqPageJsonLd(faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <SiteHeader />
      <main id="main-content" className={cn("flex-1", className)}>
        <section className="border-b border-border/60 bg-linear-to-b from-primary-soft/50 to-background">
          <PageContainer className="max-w-3xl py-10 sm:py-12">
            <Link href="/tools" className="back-link mb-6">
              <ArrowLeft className="size-4" aria-hidden />
              All tools
            </Link>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
              {title}
            </h1>
            <p className="mt-3 text-brand-muted">{description}</p>
          </PageContainer>
        </section>

        <PageContainer className="max-w-3xl section-padding space-y-8">
          {semantic && (
            <>
              <SemanticSummaryBlock label="Quick answer">
                <p>{semantic.quickAnswer}</p>
              </SemanticSummaryBlock>
              <SemanticKeyTakeaways takeaways={semantic.keyTakeaways} />
              <section id="how-it-works" className="scroll-mt-24">
                <h2 className="font-heading text-lg font-semibold text-navy">
                  How it works
                </h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
                  {semantic.howItWorks.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>
            </>
          )}

          <DataVerificationNotice variant="tool" />
          {children}

          {semantic && faqs.length > 0 && (
            <SemanticFaqSection faqs={faqs} className="border-t border-border/60 pt-12" />
          )}

          <DataTrustFooter className="mt-10" />
          {relatedLinks && relatedLinks.length > 0 && (
            <InternalLinksSection
              title="Related pages"
              links={relatedLinks}
              className="mt-12 border-t border-border/60 pt-12"
            />
          )}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
