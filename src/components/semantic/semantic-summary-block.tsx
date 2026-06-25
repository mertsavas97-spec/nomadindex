import { cn } from "@/lib/utils";

export type SemanticSummaryLabel =
  | "Quick answer"
  | "At a glance"
  | "Summary"
  | "What you'll learn";

type SemanticSummaryBlockProps = {
  label?: SemanticSummaryLabel;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function SemanticSummaryBlock({
  label = "Quick answer",
  children,
  className,
  id = "quick-answer",
}: SemanticSummaryBlockProps) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl border border-primary/20 bg-linear-to-br from-primary-soft/80 to-background p-6",
        className
      )}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
        {label}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}
