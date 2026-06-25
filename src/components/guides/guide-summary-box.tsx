import { cn } from "@/lib/utils";

type GuideSummaryBoxProps = {
  summary: string;
  className?: string;
  label?: "Summary" | "Quick answer" | "At a glance";
};

export function GuideSummaryBox({
  summary,
  className,
  label = "Quick answer",
}: GuideSummaryBoxProps) {
  return (
    <div
      id="summary"
      className={cn(
        "rounded-xl border border-primary/20 bg-linear-to-br from-primary-soft/80 to-background p-6",
        className
      )}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
        {label}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink">{summary}</p>
    </div>
  );
}
