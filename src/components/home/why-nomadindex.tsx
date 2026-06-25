import { BarChart3, Layers, ShieldCheck } from "lucide-react";

import { HomeSectionHeader } from "@/components/home/home-section-header";
import { cn } from "@/lib/utils";

const REASONS = [
  {
    icon: Layers,
    title: "One dataset, every surface",
    description:
      "Countries, visa pages, compare views and tools all read from the same structured records — no conflicting blog figures.",
  },
  {
    icon: BarChart3,
    title: "Compare before you choose",
    description:
      "Side-by-side pages show income floors, processing ranges and citizenship timelines so you can shortlist destinations with evidence.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent verification",
    description:
      "Every program shows verification status and source confidence. We link official references and flag estimates clearly.",
  },
] as const;

type WhyNomadIndexProps = {
  className?: string;
};

export function WhyNomadIndex({ className }: WhyNomadIndexProps) {
  return (
    <section id="why-nomadindex" className={cn(className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="Why NomadIndex"
          title="Why NomadIndex"
          description="Remote relocation research is slow, inconsistent and hard to compare. NomadIndex is built to fix that."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-primary/15 bg-linear-to-br from-primary-soft/50 to-background p-6"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-white text-primary-dark shadow-sm">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-navy">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
