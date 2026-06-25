import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Country } from "@/types/nomadindex";

type CompareCountryCardProps = {
  country: Country;
  programCount: number;
  side: "a" | "b";
  className?: string;
};

export function CompareCountryCard({
  country,
  programCount,
  side,
  className,
}: CompareCountryCardProps) {
  return (
    <div className={cn("surface-card flex flex-col p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label={`${country.name} flag`}>
            {country.flagEmoji}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
              Country {side.toUpperCase()}
            </p>
            <h2 className="font-heading text-xl font-semibold text-navy">
              {country.name}
            </h2>
            <p className="text-sm text-brand-muted">{country.region}</p>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0 font-normal">
          <Layers className="size-3" />
          {programCount} programs
        </Badge>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-brand-muted">
        {country.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {country.hasDigitalNomadVisa && (
          <Badge variant="outline" className="font-normal">
            Digital nomad
          </Badge>
        )}
        {country.hasFreelancerVisa && (
          <Badge variant="outline" className="font-normal">
            Freelancer
          </Badge>
        )}
        {country.hasStartupVisa && (
          <Badge variant="outline" className="font-normal">
            Startup
          </Badge>
        )}
      </div>

      <Link href={`/countries/${country.slug}`} className="link-action mt-4">
        View {country.name}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
