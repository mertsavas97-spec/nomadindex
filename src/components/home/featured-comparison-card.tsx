import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CountryComparisonData } from "@/types/nomadindex";
import { cn } from "@/lib/utils";

type FeaturedComparisonCardProps = {
  data: CountryComparisonData;
  className?: string;
};

function pickHighlightRow(data: CountryComparisonData) {
  return (
    data.rows.find((row) => row.highlight) ??
    data.rows.find((row) => row.label.toLowerCase().includes("income")) ??
    data.rows[0]
  );
}

export function FeaturedComparisonCard({
  data,
  className,
}: FeaturedComparisonCardProps) {
  const row = pickHighlightRow(data);

  return (
    <Link
      href={`/compare/${data.slug}`}
      className={cn(
        "card-link group flex h-full flex-col rounded-2xl border border-border/60 bg-background p-6 shadow-sm hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-2 text-lg font-medium text-navy">
        <span role="img" aria-label={`${data.countryA.name} flag`}>
          {data.countryA.flagEmoji}
        </span>
        <span>{data.countryA.name}</span>
        <span className="text-sm font-normal text-brand-muted">vs</span>
        <span role="img" aria-label={`${data.countryB.name} flag`}>
          {data.countryB.flagEmoji}
        </span>
        <span>{data.countryB.name}</span>
      </div>

      {row && (
        <dl className="mt-5 flex-1 space-y-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
            {row.label}
          </dt>
          <dd className="grid grid-cols-2 gap-3 text-sm">
            <span
              className={cn(
                "rounded-lg px-3 py-2",
                row.highlight === "a"
                  ? "bg-available-bg/60 font-medium text-available-text"
                  : "bg-neutral-bg/60 text-ink"
              )}
            >
              {row.valueA}
            </span>
            <span
              className={cn(
                "rounded-lg px-3 py-2",
                row.highlight === "b"
                  ? "bg-available-bg/60 font-medium text-available-text"
                  : "bg-neutral-bg/60 text-ink"
              )}
            >
              {row.valueB}
            </span>
          </dd>
        </dl>
      )}

      <span className="link-action mt-5">
        Compare {data.countryA.name} vs {data.countryB.name}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
