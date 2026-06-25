import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Visa Pathway Matcher | NomadIndex";

export default function Image() {
  return createOgImageResponse({
    variant: "tool",
    eyebrow: "Planning Tool",
    title: "Visa Pathway Matcher",
    subtitle: "Match visa pathways to your profile across 22 countries.",
  });
}
