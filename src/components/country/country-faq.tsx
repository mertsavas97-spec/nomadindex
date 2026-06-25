import type { FaqItem } from "@/lib/seo";
import { cn } from "@/lib/utils";

type CountryFaqSectionProps = {
  faqs: FaqItem[];
  countryName: string;
  className?: string;
};

export function CountryFaqSection({
  faqs,
  countryName,
  className,
}: CountryFaqSectionProps) {
  return (
    <section className={cn(className)}>
      <h2 className="section-heading">
        Frequently asked questions about moving to {countryName}
      </h2>
      <p className="mt-1 text-sm text-brand-muted">
        Straight answers from our dataset — not personalised immigration advice.
      </p>

      <dl className="mt-8 space-y-8">
        {faqs.map((faq) => (
          <div key={faq.question}>
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
