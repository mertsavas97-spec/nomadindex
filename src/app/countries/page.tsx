import { Suspense } from "react";
import type { Metadata } from "next";

import { CountryDirectorySection } from "@/components/country-directory-section";
import { DataVerificationNotice } from "@/components/data-verification-notice";
import { DirectoryHero, PageContainer } from "@/components/layout/page-container";
import { HubCrossLinks } from "@/components/seo/hub-cross-links";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DirectoryLoading } from "@/components/ui/directory-loading";
import { getAllCountries, getVisasByCountry } from "@/data";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  COUNTRIES_DIRECTORY_DESCRIPTION,
  COUNTRIES_DIRECTORY_TITLE,
  createPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: COUNTRIES_DIRECTORY_TITLE,
  description: COUNTRIES_DIRECTORY_DESCRIPTION,
  path: "/countries",
});

export default function CountriesPage() {
  const items = getAllCountries().map((country) => ({
    country,
    visas: getVisasByCountry(country.slug),
  }));

  const itemList = items.map(({ country }) => ({
    name: country.name,
    url: absoluteUrl(`/countries/${country.slug}`),
  }));

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Countries", path: "/countries" },
          ]),
          buildItemListJsonLd("NomadIndex countries", itemList),
        ]}
      />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <DirectoryHero
          title="Country directory"
          description={
            <>
              Explore visa programs, residency pathways and mobility options
              across {items.length} countries for founders, freelancers and
              remote workers.
            </>
          }
        />

        <PageContainer className="section-padding">
          <DataVerificationNotice variant="inline" className="mb-8" />
          <Suspense fallback={<DirectoryLoading />}>
            <CountryDirectorySection items={items} />
          </Suspense>
          <HubCrossLinks excludeHref="/countries" className="mt-12" />
        </PageContainer>
      </main>

      <SiteFooter />
    </>
  );
}
