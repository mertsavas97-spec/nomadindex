import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NomadIndex Country Directory";

export default function Image() {
  return createOgImageResponse({
    variant: "country",
    eyebrow: "Country Directory",
    title: "22 Countries for Remote Work & Residency",
    subtitle: "Visa pathways, income thresholds and citizenship timelines.",
  });
}
