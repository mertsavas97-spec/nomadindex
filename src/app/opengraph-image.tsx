import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NomadIndex — Compare Visas, Residency & Startup Paths";

export default function Image() {
  return createOgImageResponse({
    variant: "default",
    eyebrow: "Global Mobility Database",
    title: "Compare Visas, Residency & Startup Paths",
    subtitle: "For founders, freelancers and remote workers across 22 countries.",
  });
}
