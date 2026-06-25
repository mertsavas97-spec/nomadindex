import {
  comparisonDataToPreviewRows,
  getCountryComparisonData,
  getFeaturedComparisonPairs,
} from "@/data";
import { ComparisonPreview } from "@/components/comparison-preview";
import { FeaturedComparisonCard } from "@/components/home/featured-comparison-card";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { cn } from "@/lib/utils";

type FeaturedComparisonsProps = {
  comparePageCount: number;
  className?: string;
};

export function FeaturedComparisons({
  comparePageCount,
  className,
}: FeaturedComparisonsProps) {
  const pairs = getFeaturedComparisonPairs();
  const spotlight = getCountryComparisonData("portugal", "spain");
  const cards = pairs
    .filter((pair) => pair.slug !== spotlight?.slug)
    .slice(0, 3)
    .map((pair) => getCountryComparisonData(pair.countryASlug, pair.countryBSlug))
    .filter((data): data is NonNullable<typeof data> => data !== null);

  return (
    <section id="compare" className={cn(className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="Compare"
          title="Featured comparisons"
          description={`Side-by-side views of income thresholds, processing times and residency paths — ${comparePageCount} pairings available.`}
          href="/compare"
          linkLabel="All compare pages"
        />

        {spotlight && (
          <div className="mt-10">
            <ComparisonPreview
              leftCountry={spotlight.countryA.name}
              leftFlag={spotlight.countryA.flagEmoji}
              rightCountry={spotlight.countryB.name}
              rightFlag={spotlight.countryB.flagEmoji}
              rows={comparisonDataToPreviewRows(spotlight)}
              href={`/compare/${spotlight.slug}`}
            />
          </div>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((data) => (
            <FeaturedComparisonCard key={data.slug} data={data} />
          ))}
        </div>
      </div>
    </section>
  );
}
