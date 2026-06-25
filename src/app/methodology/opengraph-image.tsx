import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NomadIndex Data Methodology";

export default function Image() {
  return createOgImageResponse({
    variant: "default",
    eyebrow: "Methodology",
    title: "Data Sources & Verification",
    subtitle: "How NomadIndex collects, labels and reviews visa data.",
  });
}
