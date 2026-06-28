"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export function GoogleAdSense() {
  const pathname = usePathname();

  if (!ADSENSE_CLIENT || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Script
      id="google-adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
