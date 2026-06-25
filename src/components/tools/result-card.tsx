import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { VerificationBadge } from "@/components/verification-badge";
import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { Badge } from "@/components/ui/badge";
import { getSourceConfidenceForUrl } from "@/lib/source-confidence";
import { cn } from "@/lib/utils";
import type { EligibilityStatus } from "@/lib/tools";
import type { VerificationStatus } from "@/types/nomadindex";

const ELIGIBILITY_STYLES: Record<
  EligibilityStatus,
  { label: string; className: string }
> = {
  eligible: {
    label: "Potential match",
    className: "bg-available-bg text-available-text border-0",
  },
  "likely-eligible": {
    label: "Possible match",
    className: "bg-primary-soft text-primary-dark border-0",
  },
  "not-enough-data": {
    label: "Insufficient dataset data",
    className: "bg-primary-soft text-primary-dark border-0",
  },
};

type ResultCardProps = {
  title: string;
  subtitle?: string;
  eligibilityStatus?: EligibilityStatus;
  verificationStatus?: VerificationStatus;
  sourceUrl?: string;
  reasons?: string[];
  children?: React.ReactNode;
  visaHref?: string;
  compareHref?: string;
  className?: string;
};

export function ResultCard({
  title,
  subtitle,
  eligibilityStatus,
  verificationStatus,
  sourceUrl,
  reasons,
  children,
  visaHref,
  compareHref,
  className,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-background p-5 shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-medium text-navy">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-sm text-brand-muted">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {eligibilityStatus && (
            <Badge className={cn("font-normal", ELIGIBILITY_STYLES[eligibilityStatus].className)}>
              {ELIGIBILITY_STYLES[eligibilityStatus].label}
            </Badge>
          )}
          {verificationStatus && (
            <VerificationBadge status={verificationStatus} />
          )}
          {sourceUrl && (
            <SourceConfidenceBadge
              confidence={getSourceConfidenceForUrl(sourceUrl, verificationStatus)}
            />
          )}
        </div>
      </div>

      {children && <div className="mt-4">{children}</div>}

      {reasons && reasons.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm text-brand-muted">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className="text-primary">·</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}

      {(visaHref || compareHref) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {visaHref && (
            <Link
              href={visaHref}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary"
            >
              View visa program
              <ArrowRight className="size-4" />
            </Link>
          )}
          {compareHref && (
            <Link
              href={compareHref}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary"
            >
              Compare countries
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
