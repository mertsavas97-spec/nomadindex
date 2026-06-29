import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getCountryBySlug } from "@/data/countries";
import type { CountryPair } from "@/types/nomadindex";

type ComparePairNavigationProps = {
  previous: CountryPair | null;
  next: CountryPair | null;
};

function pairLabel(pair: CountryPair): string {
  const countryA = getCountryBySlug(pair.countryASlug);
  const countryB = getCountryBySlug(pair.countryBSlug);
  return `${countryA?.name ?? pair.countryASlug} vs ${countryB?.name ?? pair.countryBSlug}`;
}

export function ComparePairNavigation({
  previous,
  next,
}: ComparePairNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Comparison page navigation"
      className="grid gap-3 border-t border-border/60 pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/compare/${previous.slug}`}
          className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background p-4 transition-shadow hover:shadow-md"
        >
          <ChevronLeft className="size-4 shrink-0 text-brand-muted group-hover:text-primary" />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
              Previous comparison
            </p>
            <p className="truncate font-medium text-navy group-hover:text-primary-dark">
              {pairLabel(previous)}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/compare/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-xl border border-border/60 bg-background p-4 text-right transition-shadow hover:shadow-md sm:col-start-2"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
              Next comparison
            </p>
            <p className="truncate font-medium text-navy group-hover:text-primary-dark">
              {pairLabel(next)}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-brand-muted group-hover:text-primary" />
        </Link>
      ) : null}
    </nav>
  );
}
