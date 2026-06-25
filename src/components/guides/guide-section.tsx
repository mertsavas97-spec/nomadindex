import type { GuideSection } from "@/types/guides";

type GuideSectionProps = {
  section: GuideSection;
};

export function GuideSectionBlock({ section }: GuideSectionProps) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
        {section.heading}
      </h2>
      <div className="mt-4 space-y-4">
        {section.paragraphs?.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-brand-muted">
            {paragraph}
          </p>
        ))}
        {section.bullets && section.bullets.length > 0 && (
          <ul className="list-disc space-y-2 pl-5 text-brand-muted">
            {section.bullets.map((bullet) => (
              <li key={bullet} className="leading-relaxed">
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
