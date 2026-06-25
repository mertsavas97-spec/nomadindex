import Link from "next/link";

import { cn } from "@/lib/utils";
import type { GuideSection } from "@/types/guides";

type TocItem = {
  id: string;
  heading: string;
};

type GuideTocProps = {
  sections: GuideSection[];
  includeSummary?: boolean;
  includeKeyTakeaways?: boolean;
  includeFaq?: boolean;
  includeRelatedResources?: boolean;
  className?: string;
};

function buildTocItems({
  sections,
  includeSummary = false,
  includeKeyTakeaways = false,
  includeFaq = false,
  includeRelatedResources = false,
}: GuideTocProps): TocItem[] {
  const items: TocItem[] = [];

  if (includeSummary) {
    items.push({ id: "summary", heading: "Summary" });
  }
  if (includeKeyTakeaways) {
    items.push({ id: "key-takeaways", heading: "Key takeaways" });
  }

  items.push(...sections.map((s) => ({ id: s.id, heading: s.heading })));

  if (includeFaq) {
    items.push({ id: "faq", heading: "FAQ" });
  }
  if (includeRelatedResources) {
    items.push({ id: "related-resources", heading: "Related Resources" });
  }

  return items;
}

export function GuideToc({
  sections,
  includeSummary = true,
  includeKeyTakeaways = true,
  includeFaq = true,
  includeRelatedResources = true,
  className,
}: GuideTocProps) {
  const items = buildTocItems({
    sections,
    includeSummary,
    includeKeyTakeaways,
    includeFaq,
    includeRelatedResources,
  });

  if (items.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "rounded-xl border border-border/60 bg-neutral-bg/40 p-5",
        className
      )}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-muted">
        On this page
      </h2>
      <ol className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className="text-sm text-navy hover:text-primary-dark"
            >
              {item.heading}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
