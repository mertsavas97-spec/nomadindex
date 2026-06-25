import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  buildBreadcrumbJsonLd,
  createPageMetadata,
  SITE_NAME,
  withSiteTitle,
} from "@/lib/seo";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  path: string;
  children: React.ReactNode;
};

export function createLegalPageMetadata(
  title: string,
  description: string,
  path: string
) {
  const resolvedTitle = title.includes(SITE_NAME) ? title : withSiteTitle(title);

  return createPageMetadata({
    title: resolvedTitle,
    description,
    path,
  });
}

export function LegalPageLayout({
  title,
  description,
  path,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: title, path },
        ])}
      />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="border-b border-border/60 bg-linear-to-b from-primary-soft/50 to-background">
          <PageContainer className="max-w-3xl py-10 sm:py-12">
            <Link href="/" className="back-link mb-6">
              <ArrowLeft className="size-4" aria-hidden />
              Home
            </Link>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
              {title}
            </h1>
            <p className="mt-3 text-brand-muted">{description}</p>
          </PageContainer>
        </section>

        <PageContainer className="max-w-3xl section-padding prose prose-neutral prose-sm prose-headings:font-heading prose-headings:text-navy prose-p:leading-relaxed prose-p:text-brand-muted prose-li:text-brand-muted prose-a:text-primary-dark prose-a:underline-offset-4 hover:prose-a:text-primary">
          {children}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
