import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Country Comparison Tool | NomadIndex";

export default function Image() {
  return createOgImageResponse({
    variant: "tool",
    eyebrow: "Planning Tool",
    title: "Country Comparison Tool",
    subtitle: "Preview side-by-side visa and residency data.",
  });
}
