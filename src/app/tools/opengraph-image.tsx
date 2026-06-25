import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NomadIndex Planning Tools";

export default function Image() {
  return createOgImageResponse({
    variant: "tool",
    eyebrow: "Planning Tools",
    title: "Visa & Relocation Calculators",
    subtitle: "Eligibility, income, costs and country comparisons.",
  });
}
