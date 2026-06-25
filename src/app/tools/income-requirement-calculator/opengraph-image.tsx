import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Income Requirement Calculator | NomadIndex";

export default function Image() {
  return createOgImageResponse({
    variant: "tool",
    eyebrow: "Planning Tool",
    title: "Income Requirement Calculator",
    subtitle: "Convert visa income thresholds to your currency.",
  });
}
