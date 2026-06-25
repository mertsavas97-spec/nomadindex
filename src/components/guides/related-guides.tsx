import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GuideCard } from "@/components/guides/guide-card";
import type { Guide } from "@/types/guides";

type RelatedGuidesProps = {
  guides: Guide[];
  title?: string;
  description?: string;
};

export function RelatedGuides({
  guides,
  title = "Related guides",
  description = "Structured playbooks linked to this page.",
}: RelatedGuidesProps) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="section-heading">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-brand-muted">{description}</p>
          )}
        </div>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary"
        >
          All guides
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {guides.slice(0, 4).map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </section>
  );
}
