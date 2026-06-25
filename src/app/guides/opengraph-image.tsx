import { createOgImageResponse } from "@/lib/og/image-response";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NomadIndex Guides & Playbooks";

export default function Image() {
  return createOgImageResponse({
    variant: "guide",
    eyebrow: "Guides & Playbooks",
    title: "Relocation Guides for Remote Workers",
    subtitle: "Visa routes, comparisons and planning from NomadIndex data.",
  });
}
