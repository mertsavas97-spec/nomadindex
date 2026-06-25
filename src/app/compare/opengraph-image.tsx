import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NomadIndex Country Comparisons";

export default function Image() {
  return createOgImageResponse({
    variant: "compare",
    eyebrow: "Compare Countries",
    title: "Side-by-Side Visa & Residency Comparisons",
    subtitle: "231 country pairs — income, processing and pathways.",
  });
}
