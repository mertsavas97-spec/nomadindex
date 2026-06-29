import { InternalLinksSection } from "@/components/seo/internal-links-section";
import { hubCrossLinks } from "@/lib/internal-links";

type HubCrossLinksProps = {
  title?: string;
  description?: string;
  excludeHref?: string;
  className?: string;
};

export function HubCrossLinks({
  title = "Explore NomadIndex",
  description = "Browse directories, guides, tools and methodology.",
  excludeHref,
  className,
}: HubCrossLinksProps) {
  return (
    <InternalLinksSection
      title={title}
      description={description}
      links={hubCrossLinks(excludeHref)}
      className={className}
    />
  );
}
