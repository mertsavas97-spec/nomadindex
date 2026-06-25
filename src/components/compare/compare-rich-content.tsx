import { GuideSectionBlock } from "@/components/guides/guide-section";
import type { CompareContentSection, ComparePageContent } from "@/lib/compare-content";

function sectionToGuideSection(section: CompareContentSection) {
  return {
    id: section.id,
    heading: section.heading,
    paragraphs: section.paragraphs,
    bullets: section.bullets,
  };
}

function getNarrativeSections(content: ComparePageContent) {
  return [
    content.costComparison,
    content.remoteWorkerSuitability,
    content.freelancerSuitability,
    content.founderSuitability,
    content.familyRelocation,
    content.residencyCitizenship,
    content.taxComparison,
    content.lifestyleComparison,
  ];
}

type CompareRichContentProps = {
  content: ComparePageContent;
  includeFaq?: boolean;
};

export function CompareChooseCountrySection({
  section,
}: {
  section: CompareContentSection;
}) {
  return (
    <article
      id={section.id}
      className="scroll-mt-24 rounded-xl border border-border/60 bg-background p-6 shadow-sm sm:p-8"
    >
      <GuideSectionBlock section={sectionToGuideSection(section)} />
    </article>
  );
}

export function CompareNarrativeContent({ content }: { content: ComparePageContent }) {
  const sections = getNarrativeSections(content);

  return (
    <div className="space-y-16">
      {sections.map((section) => (
        <GuideSectionBlock
          key={section.id}
          section={sectionToGuideSection(section)}
        />
      ))}
    </div>
  );
}

export function CompareFaqSection({ faqs }: { faqs: import("@/lib/seo").FaqItem[] }) {
  return (
    <section id="compare-faq" className="scroll-mt-24">
      <h2 className="section-heading">
        {faqs.length > 0 && faqs[0].question.includes(" vs ")
          ? "Frequently asked questions about this pairing"
          : "Frequently asked questions"}
      </h2>
      <p className="mt-2 text-sm text-brand-muted">
        Pair-specific answers from NomadIndex tracked fields — not personalised
        immigration advice.
      </p>
      <dl className="mt-8 space-y-8">
        {faqs.map((faq) => (
          <CompareFaqItem key={faq.question} faq={faq} />
        ))}
      </dl>
    </section>
  );
}

export function CompareRichContent({
  content,
  includeFaq = true,
}: CompareRichContentProps) {
  return (
    <div className="space-y-16">
      <CompareNarrativeContent content={content} />
      {includeFaq && <CompareFaqSection faqs={content.faqs} />}
    </div>
  );
}

function CompareFaqItem({ faq }: { faq: import("@/lib/seo").FaqItem }) {
  return (
    <div>
      <dt className="font-medium text-ink">{faq.question}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-brand-muted">
        {faq.answer}
      </dd>
    </div>
  );
}
