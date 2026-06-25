import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CountryPair } from "@/types/nomadindex";
import { getCountryBySlug } from "@/data/countries";

type RelatedComparisonsProps = {
  pairs: CountryPair[];
  title?: string;
  description?: string;
  className?: string;
};

export function RelatedComparisons({
  pairs,
  title = "Related comparisons",
  description = "Explore other country pairings you may want to review.",
  className,
}: RelatedComparisonsProps) {
  if (pairs.length === 0) {
    return null;
  }

  return (
    <section className={cn(className)}>
      <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 text-sm text-brand-muted">{description}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair) => {
          const countryA = getCountryBySlug(pair.countryASlug);
          const countryB = getCountryBySlug(pair.countryBSlug);

          if (!countryA || !countryB) {
            return null;
          }

          return (
            <Link
              key={pair.slug}
              href={`/compare/${pair.slug}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 transition-shadow hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-2 text-sm">
                <span role="img" aria-label={`${countryA.name} flag`}>
                  {countryA.flagEmoji}
                </span>
                <span className="font-medium text-navy">{countryA.name}</span>
                <span className="text-brand-muted">vs</span>
                <span role="img" aria-label={`${countryB.name} flag`}>
                  {countryB.flagEmoji}
                </span>
                <span className="truncate font-medium text-navy">
                  {countryB.name}
                </span>
              </div>
              <ArrowRight className="size-4 shrink-0 text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
