import type { Metadata } from "next";

import { NotFoundLayout } from "@/components/layout/not-found-layout";
import { createNotFoundMetadata } from "@/lib/seo";

export const metadata: Metadata = createNotFoundMetadata("Visa program not found");

export default function VisaNotFound() {
  return (
    <NotFoundLayout
      title="Visa program not found"
      description="We couldn't find that visa program in our directory. Browse all programs or explore by country."
      primaryLink={{ href: "/visas", label: "Visa program directory" }}
      secondaryLinks={[
        { href: "/countries", label: "Country directory" },
        { href: "/tools/visa-eligibility-checker", label: "Visa Pathway Matcher" },
      ]}
    />
  );
}
