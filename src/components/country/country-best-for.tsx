import { AlertCircle, CheckCircle2 } from "lucide-react";

import type { CountryEditorial } from "@/lib/country-stats";
import { cn } from "@/lib/utils";

type CountryBestForProps = {
  editorial: CountryEditorial;
  countryName: string;
  className?: string;
};

export function CountryBestFor({
  editorial,
  countryName,
  className,
}: CountryBestForProps) {
  return (
    <section className={cn("grid gap-5 lg:grid-cols-2", className)} id="best-for">
      <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-available-text" aria-hidden />
          <h2 className="font-heading text-lg font-semibold text-navy">
            Well suited for
          </h2>
        </div>
        <p className="mt-2 text-sm text-brand-muted">
          Profiles that tend to align with {countryName}&apos;s tracked visa
          pathways.
        </p>
        <ul className="mt-4 space-y-2.5">
          {editorial.bestFor.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-relaxed text-brand-muted"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-available-text" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-warning-text" aria-hidden />
          <h2 className="font-heading text-lg font-semibold text-navy">
            Worth weighing carefully
          </h2>
        </div>
        <p className="mt-2 text-sm text-brand-muted">
          Practical constraints to factor in alongside income and processing
          timelines.
        </p>
        <ul className="mt-4 space-y-2.5">
          {editorial.considerations.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-relaxed text-brand-muted"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning-text/80" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
