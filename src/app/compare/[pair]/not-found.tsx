import type { Metadata } from "next";

import { NotFoundLayout } from "@/components/layout/not-found-layout";
import { createNotFoundMetadata } from "@/lib/seo";

export const metadata: Metadata = createNotFoundMetadata("Comparison not found");

export default function CompareNotFound() {
  return (
    <NotFoundLayout
      title="Comparison not found"
      description="That country pairing doesn't exist in our directory. Build a new comparison or browse available pairs."
      primaryLink={{ href: "/compare", label: "Country comparison hub" }}
      secondaryLinks={[
        { href: "/countries", label: "Country directory" },
        { href: "/compare/portugal-vs-spain", label: "Compare Portugal vs Spain" },
      ]}
    />
  );
}
