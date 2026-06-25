import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { DataVerificationNotice } from "@/components/data-verification-notice";
import { GuidesDirectoryClient } from "@/components/guides/guides-directory-client";
import { DirectoryHero, PageContainer } from "@/components/layout/page-container";
import { JsonLd } from "@/components/seo/json-ld";
import { InternalLinksSection } from "@/components/seo/internal-links-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllGuides } from "@/data";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  createPageMetadata,
  withSiteTitle,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: withSiteTitle("Guides & Playbooks"),
  description:
    "Structured relocation playbooks for remote workers, freelancers and founders — visa routes, comparisons and planning summaries from NomadIndex data.",
  path: "/guides",
});

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([{ name: "Guides", path: "/guides" }]),
          buildItemListJsonLd(
            "NomadIndex relocation guides",
            guides.map((guide) => ({
              name: guide.title,
              url: absoluteUrl(`/guides/${guide.slug}`),
            }))
          ),
        ]}
      />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <DirectoryHero
          title="Guides & playbooks"
          description={
            <>
              Structured planning guides built from NomadIndex visa and country
              data — not generic blog posts. Each guide links to official
              program pages for verification.
            </>
          }
          icon={
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="size-6" aria-hidden />
            </div>
          }
        />

        <PageContainer className="section-padding">
          <DataVerificationNotice variant="inline" className="mb-8" />
          <GuidesDirectoryClient guides={guides} />
        </PageContainer>

        <section className="border-t border-border/60 section-padding">
          <PageContainer>
            <InternalLinksSection
              title="Explore NomadIndex"
              links={[
                { href: "/countries", label: "Country directory" },
                { href: "/visas", label: "Visa programs" },
                { href: "/compare", label: "Compare countries" },
                { href: "/tools", label: "Planning tools" },
              ]}
            />
          </PageContainer>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
