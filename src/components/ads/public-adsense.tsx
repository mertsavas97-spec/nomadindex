import Script from "next/script";

import {
  getAdSenseClientId,
  getRequestPathname,
  shouldIncludeAdSense,
} from "@/lib/ads/adsense-config";

export async function PublicAdSense() {
  const pathname = await getRequestPathname();
  if (!shouldIncludeAdSense(pathname)) {
    return null;
  }

  const clientId = getAdSenseClientId()!;

  return (
    <Script
      id="google-adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
