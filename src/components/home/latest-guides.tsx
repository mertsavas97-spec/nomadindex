import type { Guide } from "@/types/guides";
import { getLatestGuides } from "@/data/guides";
import { GuideCard } from "@/components/guides/guide-card";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { cn } from "@/lib/utils";

type LatestGuidesProps = {
  className?: string;
  guides?: Guide[];
};

export function LatestGuides({ className, guides }: LatestGuidesProps) {
  const items = guides ?? getLatestGuides(4);

  return (
    <section id="guides" className={cn(className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader
          title="Guides"
          description="Dataset-backed playbooks for visa selection, country comparisons and relocation planning — updated with source-linked figures."
          href="/guides"
          linkLabel="All guides"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {items.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  );
}
