import { getAllGuides, getGuideBySlug } from "@/data/guides";
import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Relocation guide | NomadIndex";

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  if (!slug) {
    return createOgImageResponse({
      variant: "guide",
      eyebrow: "Guide",
      title: "Relocation Guide",
    });
  }
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return createOgImageResponse({
      variant: "guide",
      eyebrow: "Guide",
      title: "Guide not found",
    });
  }

  return createOgImageResponse({
    variant: "guide",
    eyebrow: "Relocation Guide",
    title: guide.title,
    subtitle: "Visa pathways, requirements and planning for remote workers.",
  });
}
