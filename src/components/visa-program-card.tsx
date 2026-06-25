import Link from "next/link";
import { ArrowRight, Clock, Coins, Users } from "lucide-react";

import { VerificationBadge } from "@/components/verification-badge";
import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrencyAmount, formatMinIncome } from "@/lib/format";
import { getSourceConfidence } from "@/lib/source-confidence";
import { VISA_TYPE_LABELS } from "@/lib/visa-types";
import { cn } from "@/lib/utils";
import type { Country, VisaProgram } from "@/types/nomadindex";

type VisaProgramCardProps = {
  program: VisaProgram;
  country?: Country;
  showCountry?: boolean;
  variant?: "grid" | "list";
  className?: string;
};

function formatFee(program: VisaProgram): string {
  if (program.applicationFee == null) {
    return "Varies";
  }

  const formatted = formatCurrencyAmount(
    program.applicationFee,
    program.currency
  );

  return program.verificationStatus === "verified"
    ? formatted
    : `${formatted} (est.)`;
}

function formatIncome(program: VisaProgram): string {
  const income = formatMinIncome(program);
  if (!income) {
    return "Varies";
  }

  return program.verificationStatus === "verified"
    ? income
    : `${income} (est.)`;
}

export function VisaProgramCard({
  program,
  country,
  showCountry = false,
  variant = "grid",
  className,
}: VisaProgramCardProps) {
  const detailHref = `/visas/${program.slug}`;
  const isList = variant === "list";

  return (
    <Card
      className={cn(
        "interactive-card flex h-full flex-col",
        isList && "sm:flex-row sm:items-stretch",
        className
      )}
    >
      <div className={cn("flex flex-1 flex-col", isList && "min-w-0")}>
        <CardHeader className={cn(isList && "sm:flex-1")}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              {showCountry && country && (
                <Link
                  href={`/countries/${country.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-primary-dark"
                >
                  <span role="img" aria-label={`${country.name} flag`}>
                    {country.flagEmoji}
                  </span>
                  {country.name}
                </Link>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  {VISA_TYPE_LABELS[program.type]}
                </Badge>
              </div>
              <CardTitle className="text-lg text-navy">
                <Link href={detailHref} className="hover:text-primary-dark">
                  {program.name}
                </Link>
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status={program.verificationStatus} />
              <SourceConfidenceBadge confidence={getSourceConfidence(program)} />
            </div>
          </div>
        </CardHeader>

        <CardContent
          className={cn(
            "flex flex-1 flex-col gap-4",
            isList && "sm:py-4"
          )}
        >
          <p
            className={cn(
              "text-sm leading-relaxed text-brand-muted",
              isList && "line-clamp-2"
            )}
          >
            {program.summary}
          </p>

          <dl
            className={cn(
              "grid gap-3",
              isList ? "sm:grid-cols-4" : "sm:grid-cols-2"
            )}
          >
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                Min. income
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">
                {formatIncome(program)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                Application fee
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">
                {formatFee(program)}
              </dd>
            </div>
            <div className="flex gap-2">
              <Clock
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                  Processing
                </dt>
                <dd className="mt-0.5 text-sm text-ink">
                  {program.processingTime ?? "Not specified"}
                </dd>
              </div>
            </div>
            <div className="flex gap-2">
              <Coins
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                  Stay duration
                </dt>
                <dd className="mt-0.5 text-sm text-ink">
                  {program.stayDuration}
                </dd>
              </div>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn(
                "font-normal",
                program.familyAllowed
                  ? "border-available-text/30 text-available-text"
                  : "text-brand-muted"
              )}
            >
              <Users className="size-3" />
              {program.familyAllowed ? "Family allowed" : "No family inclusion"}
            </Badge>
            {program.renewable && (
              <Badge variant="outline" className="font-normal">
                Renewable
              </Badge>
            )}
            {program.citizenshipPath && (
              <Badge variant="outline" className="font-normal">
                Citizenship path
              </Badge>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter
        className={cn(
          "mt-auto flex-col items-start gap-2 border-t-0 bg-transparent",
          isList &&
            "justify-center border-t border-border/60 sm:w-44 sm:border-t-0 sm:border-l sm:px-4"
        )}
      >
        {!isList && program.taxNotes && (
          <p className="line-clamp-2 text-xs leading-relaxed text-brand-muted">
            {program.taxNotes}
          </p>
        )}
        <Link
          href={detailHref}
          className="link-action"
        >
          Open {program.name}
          <ArrowRight className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
