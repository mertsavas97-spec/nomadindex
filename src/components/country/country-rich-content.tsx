import Link from "next/link";

import type { CountryContentLink, CountryPageContent } from "@/lib/country-content";
import { cn } from "@/lib/utils";

type CountryRichContentProps = {
  content: CountryPageContent;
  countryName: string;
  className?: string;
};

function ContentLinks({ links }: { links: CountryContentLink[] }) {
  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="mt-4 space-y-2 border-t border-border/40 pt-4">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-sm font-medium text-primary-dark hover:text-primary hover:underline"
          >
            {link.label}
          </Link>
          {link.description && (
            <span className="text-sm text-brand-muted"> — {link.description}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function ContentSection({
  id,
  heading,
  paragraphs,
  bullets,
  links,
}: {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  links?: CountryContentLink[];
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
        {heading}
      </h2>
      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-brand-muted">
            {paragraph}
          </p>
        ))}
        {bullets && bullets.length > 0 && (
          <ul className="list-disc space-y-2 pl-5 text-brand-muted">
            {bullets.map((bullet) => (
              <li key={bullet} className="leading-relaxed">
                {bullet}
              </li>
            ))}
          </ul>
        )}
        {links && links.length > 0 && <ContentLinks links={links} />}
      </div>
    </section>
  );
}

export function CountryRichContent({
  content,
  countryName,
  className,
}: CountryRichContentProps) {
  const sections = [
    content.overview,
    content.whyChoose,
    content.visaPathways,
    content.residency,
    content.citizenship,
    content.taxOverview,
    content.costOverview,
  ];

  return (
    <div className={cn("space-y-12", className)}>
      <p className="text-brand-muted leading-relaxed">
        A practical overview of why {countryName} appears on relocation
        shortlists — and what to weigh before choosing a visa route.
      </p>
      {sections.map((section) => (
        <ContentSection key={section.id} {...section} />
      ))}
    </div>
  );
}
