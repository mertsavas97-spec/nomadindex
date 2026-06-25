import Link from "next/link";
import { ArrowRight, BookOpen, GitCompare, Search, Sparkles } from "lucide-react";

import { HomeSectionHeader } from "@/components/home/home-section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Browse or search",
    description:
      "Explore countries, visa programs and 231 compare pages — or search by destination name.",
    href: "/countries",
    linkLabel: "Country directory",
  },
  {
    step: "02",
    icon: GitCompare,
    title: "Compare side by side",
    description:
      "Open any country pair to see income ranges, processing times, tax notes and residency paths from our dataset.",
    href: "/compare",
    linkLabel: "Compare countries",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Run planning tools",
    description:
      "Match programs against dataset criteria, test income minimums and estimate relocation costs.",
    href: "/tools/visa-eligibility-checker",
    linkLabel: "Pathway matcher",
  },
  {
    step: "04",
    icon: BookOpen,
    title: "Read guides & verify",
    description:
      "Use dataset-backed playbooks, then confirm every figure with official sources before applying.",
    href: "/guides",
    linkLabel: "Browse guides",
  },
] as const;

type HowNomadIndexWorksProps = {
  comparePageCount: number;
  className?: string;
};

export function HowNomadIndexWorks({
  comparePageCount,
  className,
}: HowNomadIndexWorksProps) {
  return (
    <section id="how-it-works" className={cn(className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="How it works"
          title="How NomadIndex works"
          description={`Four steps from scattered research to a structured shortlist — backed by ${comparePageCount} comparison pages and planning tools.`}
        />

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, icon: Icon, title, description, href, linkLabel }) => (
            <li
              key={step}
              className="flex flex-col rounded-2xl border border-border/60 bg-background p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm font-semibold text-primary-dark">
                  {step}
                </span>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-dark">
                  <Icon className="size-4" aria-hidden />
                </div>
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-navy">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                {description}
              </p>
              <Link
                href={href}
                className="link-action mt-4"
              >
                {linkLabel}
                <ArrowRight className="size-4" />
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="navy">
            <Link href="/tools/visa-eligibility-checker">
              Start with pathway matcher
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/methodology">How we verify data</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
