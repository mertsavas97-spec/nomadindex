import { getCountryBySlug } from "@/data/countries";
import { getAllVisaPrograms, getVisaBySlug } from "@/data/visa-programs";
import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Visa program | NomadIndex";

export function generateStaticParams() {
  return getAllVisaPrograms().map((program) => ({ slug: program.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  if (!slug) {
    return createOgImageResponse({
      variant: "visa",
      eyebrow: "Visa Program",
      title: "Visa Program",
    });
  }
  const program = getVisaBySlug(slug);
  const country = program ? getCountryBySlug(program.countrySlug) : undefined;

  if (!program || !country) {
    return createOgImageResponse({
      variant: "visa",
      eyebrow: "Visa Program",
      title: "Visa program not found",
    });
  }

  return createOgImageResponse({
    variant: "visa",
    eyebrow: `${country.name} · Visa Program`,
    title: program.name,
    subtitle: "Requirements, income, processing and residency details.",
    flags: [country.flagEmoji],
  });
}
