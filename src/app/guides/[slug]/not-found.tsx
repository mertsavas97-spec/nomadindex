import type { Metadata } from "next";

import { NotFoundLayout } from "@/components/layout/not-found-layout";
import { createNotFoundMetadata } from "@/lib/seo";

export const metadata: Metadata = createNotFoundMetadata("Guide not found");

export default function GuideNotFound() {
  return (
    <NotFoundLayout
      title="Guide not found"
      description="We couldn't find that guide in our library. Browse all playbooks or explore countries and visa programs directly."
      primaryLink={{ href: "/guides", label: "Relocation guides" }}
      secondaryLinks={[
        { href: "/countries", label: "Country directory" },
        { href: "/visas", label: "Visa program directory" },
      ]}
    />
  );
}
