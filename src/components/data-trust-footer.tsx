import Link from "next/link";

import { TrustFooterLinks } from "@/components/trust-footer-links";
import { formatDatasetReviewDate, getDatasetReviewDate } from "@/lib/dataset-freshness";
import { cn } from "@/lib/utils";
import { DATA_DISCLAIMER, LEGAL_NOTICE } from "@/types/nomadindex";

type DataTrustFooterProps = {
  className?: string;
  showMethodologyLink?: boolean;
  showTrustLinks?: boolean;
};

export function DataTrustFooter({
  className,
  showMethodologyLink = true,
  showTrustLinks = true,
}: DataTrustFooterProps) {
  const datasetReviewDate = getDatasetReviewDate();

  return (
    <div className={cn("space-y-3", className)}>
      {showTrustLinks && <TrustFooterLinks />}
      {datasetReviewDate && (
        <p className="text-xs text-brand-muted">
          Dataset last reviewed: {formatDatasetReviewDate(datasetReviewDate)}
        </p>
      )}
      <p className="text-xs leading-relaxed text-brand-muted">{DATA_DISCLAIMER}</p>
      <p className="text-xs leading-relaxed text-brand-muted">
        {LEGAL_NOTICE}
        {showMethodologyLink && (
          <>
            {" "}
            <Link
              href="/methodology"
              className="font-medium text-primary-dark underline-offset-2 hover:text-primary hover:underline"
            >
              See how we verify data
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
