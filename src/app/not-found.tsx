import type { Metadata } from "next";

import { NotFoundLayout } from "@/components/layout/not-found-layout";
import { createNotFoundMetadata } from "@/lib/seo";

export const metadata: Metadata = createNotFoundMetadata("Page not found");

export default function RootNotFound() {
  return (
    <NotFoundLayout
      title="Page not found"
      description="That page doesn't exist in NomadIndex. Browse the directory or use the links below to get back on track."
      primaryLink={{ href: "/", label: "Back to homepage" }}
      secondaryLinks={[
        { href: "/countries", label: "Browse countries" },
        { href: "/guides", label: "Relocation guides" },
      ]}
    />
  );
}
