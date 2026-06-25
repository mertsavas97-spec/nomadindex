import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NomadIndex Visa Programs Directory";

export default function Image() {
  return createOgImageResponse({
    variant: "visa",
    eyebrow: "Visa Directory",
    title: "Visa Programs & Residency Routes",
    subtitle: "Digital nomad, freelancer, startup and investor pathways.",
  });
}
