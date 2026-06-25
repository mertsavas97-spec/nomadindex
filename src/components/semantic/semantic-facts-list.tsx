import { cn } from "@/lib/utils";

export type SemanticFact = {
  term: string;
  description: string;
};

type SemanticFactsListProps = {
  facts: SemanticFact[];
  title?: string;
  className?: string;
  id?: string;
};

export function SemanticFactsList({
  facts,
  title = "Structured facts",
  className,
  id = "structured-facts",
}: SemanticFactsListProps) {
  if (facts.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={cn(
        "rounded-xl border border-border/60 bg-background p-6",
        className
      )}
    >
      <h2 className="font-heading text-lg font-semibold text-navy">{title}</h2>
      <dl className="mt-4 divide-y divide-border/60">
        {facts.map((fact) => (
          <div key={fact.term} className="grid gap-1 py-3 sm:grid-cols-[minmax(8rem,11rem)_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-ink">{fact.term}</dt>
            <dd className="text-sm leading-relaxed text-brand-muted">
              {fact.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
