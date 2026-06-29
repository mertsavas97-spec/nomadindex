import type { Metadata } from "next";

import { DataVerificationNotice } from "@/components/data-verification-notice";
import { DirectoryHero, PageContainer } from "@/components/layout/page-container";
import { HubCrossLinks } from "@/components/seo/hub-cross-links";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisaDirectoryClient } from "@/components/visa-directory-client";
import { getAllCountries, getAllVisaPrograms } from "@/data";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  createPageMetadata,
  VISAS_DIRECTORY_DESCRIPTION,
  VISAS_DIRECTORY_TITLE,
} from "@/lib/seo";
import { DataTrustFooter } from "@/components/data-trust-footer";

export const metadata: Metadata = createPageMetadata({
  title: VISAS_DIRECTORY_TITLE,
  description: VISAS_DIRECTORY_DESCRIPTION,
  path: "/visas",
});

export default function VisasPage() {
  const countriesBySlug = Object.fromEntries(
    getAllCountries().map((c) => [c.slug, c])
  );

  const items = getAllVisaPrograms()
    .map((program) => {
      const country = countriesBySlug[program.countrySlug];
      if (!country) {
        return null;
      }
      return { program, country };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const itemList = items.map(({ program }) => ({
    name: program.name,
    url: absoluteUrl(`/visas/${program.slug}`),
  }));

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([{ name: "Visas", path: "/visas" }]),
          buildItemListJsonLd("NomadIndex visa programs", itemList),
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <DirectoryHero
          title="Visa program directory"
          description={
            <>
              Explore {items.length} visa and residency programs across{" "}
              {getAllCountries().length} countries. Filter by type, country,
              region and verification status.
            </>
          }
        />

        <PageContainer className="section-padding">
          <DataVerificationNotice variant="inline" className="mb-8" />
          <VisaDirectoryClient items={items} />
          <HubCrossLinks excludeHref="/visas" className="mt-12" />
        </PageContainer>

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
