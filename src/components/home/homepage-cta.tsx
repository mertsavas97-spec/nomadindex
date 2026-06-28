import Link from "next/link";
import { ArrowRight, GitCompare, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HomepageCtaProps = {
  className?: string;
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function HomepageCta({
  className,
  title = "Turn research into a shortlist",
  description = "Run the pathway matcher, compare your top two countries, then open program pages to verify requirements with official sources.",
  primaryCta = {
    label: "Visa Pathway Matcher",
    href: "/tools/visa-eligibility-checker",
  },
  secondaryCta = {
    label: "Compare Portugal vs Spain",
    href: "/compare/portugal-vs-spain",
  },
}: HomepageCtaProps) {
  return (
    <section id="start-planning" className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary-soft via-background to-background p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
              Start planning
            </p>
            <h2 className="section-heading mt-3 text-navy">{title}</h2>
            <p className="mt-3 text-brand-muted">{description}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="navy" className="h-10 px-5 text-sm">
              <Link href={primaryCta.href}>
                <Sparkles className="size-4" />
                {primaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryCta.href}>
                <GitCompare className="size-4" />
                {secondaryCta.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
