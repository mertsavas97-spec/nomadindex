import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCountryBySlug } from "@/data/countries";
import { cn } from "@/lib/utils";
import type { Country, CountryPair } from "@/types/nomadindex";

type CountryFeaturedComparisonsProps = {
  country: Country;
  pairs: CountryPair[];
  className?: string;
};

export function CountryFeaturedComparisons({
  country,
  pairs,
  className,
}: CountryFeaturedComparisonsProps) {
  if (pairs.length === 0) {
    return null;
  }

  return (
    <section id="featured-comparisons" className={cn("scroll-mt-24", className)}>
      <h2 className="section-heading">
        Compare {country.name} with
      </h2>
      <p className="mt-1 text-sm text-brand-muted">
        See how {country.name} stacks up on income, processing time and pathway
        options — then explore visa routes in detail below.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {pairs.map((pair) => {
          const countryA = getCountryBySlug(pair.countryASlug);
          const countryB = getCountryBySlug(pair.countryBSlug);

          if (!countryA || !countryB) {
            return null;
          }

          const other =
            pair.countryASlug === country.slug ? countryB : countryA;

          return (
            <Link
              key={pair.slug}
              href={`/compare/${pair.slug}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-4 py-3.5 transition-shadow hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                  {country.flagEmoji} {country.name}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm font-medium text-navy">
                  <span>vs</span>
                  <span role="img" aria-hidden>
                    {other.flagEmoji}
                  </span>
                  <span>{other.name}</span>
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-brand-muted">
        <Link
          href={`/compare?a=${country.slug}`}
          className="font-medium text-primary-dark hover:text-primary hover:underline"
        >
          Compare destinations
        </Link>
        {" "}side by side, or scroll down to explore visa pathways.
      </p>
    </section>
  );
}
