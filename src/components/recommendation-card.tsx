import { Scale, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ComparisonRecommendation, Country } from "@/types/nomadindex";

type RecommendationCardProps = {
  recommendation: ComparisonRecommendation;
  countryA: Country;
  countryB: Country;
  className?: string;
};

function formatDatasetSummary(summary: string): string {
  const trimmed = summary.trim();
  if (/^based on the current dataset/i.test(trimmed)) {
    return trimmed;
  }
  const normalized =
    trimmed.charAt(0).toLowerCase() + trimmed.slice(1).replace(/\.$/, "");
  return `Based on the current dataset, ${normalized}.`;
}

export function RecommendationCard({
  recommendation,
  countryA,
  countryB,
  className,
}: RecommendationCardProps) {
  const winner =
    recommendation.winnerSlug === countryA.slug
      ? countryA
      : recommendation.winnerSlug === countryB.slug
        ? countryB
        : null;

  return (
    <div
      className={cn(
        "surface-card p-5",
        winner && "border-primary/20 bg-primary-soft/30 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            winner ? "bg-primary text-primary-foreground" : "bg-neutral-bg text-brand-muted"
          )}
        >
          {winner ? (
            <Trophy className="size-4" aria-hidden />
          ) : (
            <Scale className="size-4" aria-hidden />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-navy">{recommendation.label}</p>
          {winner ? (
            <p className="mt-1 font-heading text-lg font-semibold text-primary-dark">
              {winner.flagEmoji} {winner.name}
            </p>
          ) : (
            <p className="mt-1 font-medium text-brand-muted">No clear lean in dataset</p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            {formatDatasetSummary(recommendation.summary)}
          </p>
        </div>
      </div>
    </div>
  );
}
