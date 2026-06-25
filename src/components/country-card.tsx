import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCountryProcessingRange } from "@/data/comparisons";
import {
  getAvailablePathwaysFromVisas,
  getCitizenshipLabel,
} from "@/lib/country-card-stats";
import { getLowestMinIncome } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Country, VisaProgram } from "@/types/nomadindex";

type CountryCardProps = {
  country: Country;
  visas: VisaProgram[];
  href?: string;
  className?: string;
};

export function CountryCard({
  country,
  visas,
  href,
  className,
}: CountryCardProps) {
  const minIncome = getLowestMinIncome(visas);
  const processingRange = getCountryProcessingRange(country.slug);
  const citizenship = getCitizenshipLabel(country.citizenshipYears);
  const pathways = getAvailablePathwaysFromVisas(visas);
  const countryHref = href ?? `/countries/${country.slug}`;

  return (
    <Card className={cn("group interactive-card flex h-full flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <span
            className="text-3xl"
            role="img"
            aria-label={`${country.name} flag`}
          >
            {country.flagEmoji}
          </span>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg text-navy">{country.name}</CardTitle>
            <p className="text-sm text-brand-muted">{country.region}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-2 text-sm text-brand-muted">{country.summary}</p>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-brand-muted">Programs</dt>
            <dd className="font-medium text-ink">{visas.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-brand-muted">Citizenship</dt>
            <dd className="font-medium text-ink">{citizenship}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-brand-muted">Lowest income</dt>
            <dd className="font-medium text-ink">
              {minIncome ?? "Varies"}
              {minIncome && <span className="text-xs font-normal text-brand-muted"> (est.)</span>}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-brand-muted">Processing</dt>
            <dd className="font-medium text-ink">{processingRange}</dd>
          </div>
        </dl>

        {pathways.length > 0 && (
          <div>
            <p className="text-xs text-brand-muted">Pathways</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {pathways.map((label) => (
                <Badge key={label} variant="secondary" className="font-normal">
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t-0 bg-transparent pt-0">
        <Link
          href={countryHref}
          className="link-action"
        >
          {country.name} visa programs
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
