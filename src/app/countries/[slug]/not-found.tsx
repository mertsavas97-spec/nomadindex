import type { Metadata } from "next";

import { NotFoundLayout } from "@/components/layout/not-found-layout";
import { createNotFoundMetadata } from "@/lib/seo";

export const metadata: Metadata = createNotFoundMetadata("Country not found");

export default function CountryNotFound() {
  return (
    <NotFoundLayout
      title="Country not found"
      description="We couldn't find that country in our directory. Browse all 22 countries to explore visa and residency programs."
      primaryLink={{ href: "/countries", label: "View all countries" }}
      secondaryLinks={[
        { href: "/visas", label: "Visa program directory" },
        { href: "/compare", label: "Compare countries" },
      ]}
    />
  );
}
