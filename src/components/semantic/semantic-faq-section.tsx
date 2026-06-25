import type { FaqItem } from "@/lib/seo";
import { cn } from "@/lib/utils";

type SemanticFaqSectionProps = {
  faqs: FaqItem[];
  title?: string;
  description?: string;
  className?: string;
  id?: string;
};

export function SemanticFaqSection({
  faqs,
  title = "Frequently asked questions",
  description = "Direct answers based on NomadIndex dataset fields — not personalised immigration advice.",
  className,
  id = "faq",
}: SemanticFaqSectionProps) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="section-heading">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-brand-muted">{description}</p>
      )}
      <dl className="mt-8 space-y-8">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-xl border border-border/60 bg-background p-5 sm:p-6"
          >
            <dt className="font-medium text-ink">{faq.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-brand-muted">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
