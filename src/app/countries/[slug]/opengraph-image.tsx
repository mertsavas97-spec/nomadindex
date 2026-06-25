import { getCountryBySlug, getAllCountries } from "@/data/countries";
import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Country guide | NomadIndex";

export function generateStaticParams() {
  return getAllCountries().map((country) => ({ slug: country.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  if (!slug) {
    return createOgImageResponse({
      variant: "country",
      eyebrow: "Country Guide",
      title: "Country Guide",
    });
  }
  const country = getCountryBySlug(slug);

  if (!country) {
    return createOgImageResponse({
      variant: "country",
      eyebrow: "Country Guide",
      title: "Country not found",
    });
  }

  return createOgImageResponse({
    variant: "country",
    eyebrow: "Country Guide",
    title: `${country.name} Visas & Residency`,
    subtitle: "Remote work pathways, income requirements and official sources.",
    flags: [country.flagEmoji],
  });
}
