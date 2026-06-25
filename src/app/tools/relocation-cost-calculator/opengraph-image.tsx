import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Relocation Cost Calculator | NomadIndex";

export default function Image() {
  return createOgImageResponse({
    variant: "tool",
    eyebrow: "Planning Tool",
    title: "Relocation Cost Calculator",
    subtitle: "Estimate visa fees, income buffers and setup costs.",
  });
}
