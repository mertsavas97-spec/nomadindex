import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Country } from "@/types/nomadindex";

type RelatedCountriesProps = {
  countries: Country[];
  programCounts: Record<string, number>;
  className?: string;
};

export function RelatedCountries({
  countries,
  programCounts,
  className,
}: RelatedCountriesProps) {
  if (countries.length === 0) {
    return null;
  }

  return (
    <section className={cn(className)}>
      <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
        Explore nearby destinations
      </h2>
      <p className="mt-1 text-sm text-brand-muted">
        Other countries in the region worth comparing before you commit to a
        visa route.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <Link
            key={country.id}
            href={`/countries/${country.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-border/60 bg-background p-4 transition-shadow hover:shadow-md"
          >
            <span className="text-3xl" role="img" aria-label={`${country.name} flag`}>
              {country.flagEmoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-navy group-hover:text-primary-dark">
                {country.name}
              </p>
              <p className="text-sm text-brand-muted">{country.region}</p>
            </div>
            <Badge variant="secondary" className="shrink-0 font-normal">
              {programCounts[country.slug] ?? 0} programs
            </Badge>
            <ArrowRight className="size-4 shrink-0 text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </section>
  );
}
