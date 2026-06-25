import { getAllCountryPairs, getCountryComparisonData, parseComparisonPairSlug } from "@/data/comparisons";
import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Country comparison | NomadIndex";

export function generateStaticParams() {
  return getAllCountryPairs().map((pair) => ({ pair: pair.slug }));
}

type Props = {
  params: Promise<{ pair: string }>;
};

export default async function Image({ params }: Props) {
  const { pair } = await params;
  if (!pair) {
    return createOgImageResponse({
      variant: "compare",
      eyebrow: "Compare",
      title: "Country Comparison",
    });
  }
  const parsed = parseComparisonPairSlug(pair);
  const data = parsed
    ? getCountryComparisonData(parsed.countryASlug, parsed.countryBSlug)
    : undefined;

  if (!data) {
    return createOgImageResponse({
      variant: "compare",
      eyebrow: "Compare",
      title: "Comparison not found",
    });
  }

  return createOgImageResponse({
    variant: "compare",
    eyebrow: "Country Comparison",
    title: `${data.countryA.name} vs ${data.countryB.name}`,
    subtitle: "Visas, residency, income and processing compared.",
    flags: [data.countryA.flagEmoji, data.countryB.flagEmoji],
  });
}
