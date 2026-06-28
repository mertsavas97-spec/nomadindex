import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { GoogleAdSense } from "@/components/ads/google-adsense";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import {
  DEFAULT_SITE_DESCRIPTION,
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_TITLE,
  SITE_NAME,
} from "@/lib/seo";
import { getResolvedSiteSettings } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#378add" },
    { media: "(prefers-color-scheme: dark)", color: "#042c53" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getResolvedSiteSettings();
  const siteUrl = settings.canonicalDomain || getSiteUrl();
  const homepageTitle = settings.homepageTitle || HOMEPAGE_TITLE;
  const homepageDescription =
    settings.homepageDescription || HOMEPAGE_DESCRIPTION;
  const defaultDescription = settings.defaultOgDescription || DEFAULT_SITE_DESCRIPTION;
  const siteName = settings.siteTitle || SITE_NAME;
  const ogTitle = settings.defaultOgTitle || homepageTitle;
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    title: {
      default: homepageTitle,
      template: `%s | ${siteName}`,
    },
    description: defaultDescription,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: ["/favicon.ico"],
    },
    appleWebApp: {
      capable: true,
      title: siteName,
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
    },
    ...(adsenseClient
      ? { other: { "google-adsense-account": adsenseClient } }
      : {}),
    verification: {
      google: settings.googleSearchConsole || undefined,
      other: settings.bingVerification
        ? { "msvalidate.01": settings.bingVerification }
        : undefined,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName,
      title: ogTitle,
      description: homepageDescription,
      url: siteUrl,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: homepageDescription,
      images: ["/opengraph-image"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-navy focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Skip to main content
        </a>
        {children}
        <GoogleAnalytics />
        <GoogleAdSense />
        <SiteAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
