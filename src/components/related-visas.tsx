import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { VerificationBadge } from "@/components/verification-badge";
import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { Badge } from "@/components/ui/badge";
import { formatMinIncome } from "@/lib/format";
import { getSourceConfidence } from "@/lib/source-confidence";
import { VISA_TYPE_LABELS } from "@/lib/visa-types";
import { cn } from "@/lib/utils";
import type { Country, VisaProgram } from "@/types/nomadindex";

type RelatedVisasProps = {
  title: string;
  description: string;
  programs: VisaProgram[];
  countriesBySlug: Record<string, Country>;
  className?: string;
};

export function RelatedVisas({
  title,
  description,
  programs,
  countriesBySlug,
  className,
}: RelatedVisasProps) {
  if (programs.length === 0) {
    return null;
  }

  return (
    <section className={cn(className)}>
      <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 text-sm text-brand-muted">{description}</p>

      <div className="mt-6 grid gap-3">
        {programs.map((program) => {
          const country = countriesBySlug[program.countrySlug];
          const minIncome = formatMinIncome(program);

          return (
            <Link
              key={program.id}
              href={`/visas/${program.slug}`}
              className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-background p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                {country && (
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label={`${country.name} flag`}
                  >
                    {country.flagEmoji}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-navy group-hover:text-primary-dark">
                    {program.name}
                  </p>
                  <p className="text-sm text-brand-muted">
                    {country?.name ?? program.countrySlug}
                    {minIncome && (
                      <span>
                        {" "}
                        · From {minIncome}
                        {program.verificationStatus !== "verified" && " (est.)"}
                      </span>
                    )}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="font-normal">
                      {VISA_TYPE_LABELS[program.type]}
                    </Badge>
                    <VerificationBadge status={program.verificationStatus} />
                    <SourceConfidenceBadge confidence={getSourceConfidence(program)} />
                  </div>
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 self-end text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary sm:self-center" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
