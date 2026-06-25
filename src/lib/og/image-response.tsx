import { ImageResponse } from "next/og";

import { OG_SIZE } from "@/lib/og/constants";
import { OgImage, type OgImageProps } from "@/lib/og/template";

export function createOgImageResponse(props: OgImageProps) {
  return new ImageResponse(<OgImage {...props} />, {
    width: OG_SIZE.width,
    height: OG_SIZE.height,
  });
}
