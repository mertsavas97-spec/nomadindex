import Link from "next/link";
import { ArrowRight, GitCompare, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HomepageCtaProps = {
  className?: string;
};

export function HomepageCta({ className }: HomepageCtaProps) {
  return (
    <section id="start-planning" className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary-soft via-background to-background p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
              Start planning
            </p>
            <h2 className="section-heading mt-3 text-navy">
              Turn research into a shortlist
            </h2>
            <p className="mt-3 text-brand-muted">
              Run the pathway matcher, compare your top two countries, then
              open program pages to verify requirements with official sources.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="navy" className="h-10 px-5 text-sm">
              <Link href="/tools/visa-eligibility-checker">
                <Sparkles className="size-4" />
                Visa Pathway Matcher
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/compare/portugal-vs-spain">
                <GitCompare className="size-4" />
                Compare Portugal vs Spain
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
