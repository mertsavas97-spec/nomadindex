import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CompareTable } from "@/components/compare-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComparisonTableRow, VerificationStatus } from "@/types/nomadindex";

export type ComparisonRow = {
  label: string;
  left: string;
  right: string;
  highlight?: "left" | "right";
  verificationStatus?: VerificationStatus;
};

type ComparisonPreviewProps = {
  leftCountry: string;
  leftFlag: string;
  rightCountry: string;
  rightFlag: string;
  rows: ComparisonRow[];
  href?: string;
  disclaimer?: string;
  className?: string;
};

function labelToCategory(label: string): ComparisonTableRow["category"] {
  const map: Record<string, ComparisonTableRow["category"]> = {
    "Digital nomad visa": "remote-work",
    "Freelancer visa": "freelancer",
    "Startup visa": "startup",
    "Family inclusion": "family",
    "Residency pathways": "residency",
    "Citizenship path": "citizenship",
    "Minimum income range": "cost",
    "Application fee range": "cost",
    "Processing time range": "cost",
    "Tax notes": "tax",
    "Lifestyle & location context": "lifestyle",
    "Data status": "meta",
  };
  return map[label] ?? "meta";
}

function toCompareRows(rows: ComparisonRow[]): ComparisonTableRow[] {
  return rows.map((row) => ({
    label: row.label,
    valueA: row.left,
    valueB: row.right,
    highlight:
      row.highlight === "left" ? "a" : row.highlight === "right" ? "b" : null,
    verificationStatus: row.verificationStatus ?? "in-progress",
    category: labelToCategory(row.label),
  }));
}

export function ComparisonPreview({
  leftCountry,
  leftFlag,
  rightCountry,
  rightFlag,
  rows,
  href = "/compare",
  disclaimer,
  className,
}: ComparisonPreviewProps) {
  return (
    <div
      className={cn(
        "space-y-0 rounded-2xl transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex flex-col gap-4 rounded-t-2xl border border-b-0 border-border/60 bg-neutral-bg/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span role="img" aria-label={`${leftCountry} flag`}>
              {leftFlag}
            </span>
            <span className="font-medium text-navy">{leftCountry}</span>
          </div>
          <span className="text-sm text-brand-muted">vs</span>
          <div className="flex items-center gap-2">
            <span role="img" aria-label={`${rightCountry} flag`}>
              {rightFlag}
            </span>
            <span className="font-medium text-navy">{rightCountry}</span>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          Side-by-side
        </Badge>
      </div>

      <CompareTable
        countryA={{ name: leftCountry, flagEmoji: leftFlag }}
        countryB={{ name: rightCountry, flagEmoji: rightFlag }}
        rows={toCompareRows(rows)}
        className="rounded-none border-t-0 shadow-none"
      />

      <div className="space-y-4 rounded-b-2xl border border-t-0 border-border/60 bg-background px-5 py-4">
        {disclaimer && (
          <p className="text-xs leading-relaxed text-brand-muted">{disclaimer}</p>
        )}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-primary/20 text-primary-dark hover:bg-primary-soft"
        >
          <Link href={href}>
            Compare {leftCountry} vs {rightCountry}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
