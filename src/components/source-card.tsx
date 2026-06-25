import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { VerificationBadge } from "@/components/verification-badge";
import { getSourceConfidence, getSourceConfidenceForUrl } from "@/lib/source-confidence";
import { cn } from "@/lib/utils";
import type { SourceConfidence, VerificationStatus, VisaProgram } from "@/types/nomadindex";

type SourceCardProps = {
  url: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
  program?: VisaProgram;
  sourceConfidence?: SourceConfidence;
  className?: string;
};

function formatVerifiedDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function SourceCard({
  url,
  lastVerified,
  verificationStatus,
  program,
  sourceConfidence,
  className,
}: SourceCardProps) {
  const confidence =
    sourceConfidence ??
    (program
      ? getSourceConfidence(program)
      : getSourceConfidenceForUrl(url, verificationStatus));

  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {
    // keep raw url
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-background p-6",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-navy">
            Reference source
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Confirm all requirements directly with the issuing authority.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SourceConfidenceBadge confidence={confidence} />
          <VerificationBadge status={verificationStatus} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink">{hostname}</p>
          <p className="mt-1 text-xs text-brand-muted">
            Last checked: {formatVerifiedDate(lastVerified)}
          </p>
        </div>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-dark hover:text-primary"
        >
          Visit reference site
          <ExternalLink className="size-4" />
        </Link>
      </div>

      {verificationStatus !== "verified" && (
        <p className="mt-4 rounded-lg bg-warning-bg/60 px-3 py-2 text-xs text-warning-text">
          This link is provided for reference. NomadIndex has not independently
          verified that all figures match the current official requirements.
        </p>
      )}
    </div>
  );
}
