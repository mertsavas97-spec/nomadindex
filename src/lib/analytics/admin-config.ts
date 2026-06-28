import { getSiteUrl } from "@/lib/site-url";

export function getGaMeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim();
  return id || null;
}

export function isGaTrackingConfigured(): boolean {
  return Boolean(getGaMeasurementId());
}

export function isGaDataApiConfigured(): boolean {
  return Boolean(
    process.env.GA_PROPERTY_ID?.trim() &&
      process.env.GOOGLE_CLIENT_EMAIL?.trim() &&
      process.env.GOOGLE_PRIVATE_KEY?.trim()
  );
}

export type AdminAnalyticsLinks = {
  gaRealtime: string;
  vercelAnalytics: string;
  vercelSpeedInsights: string;
  pageSpeed: {
    home: string;
    countries: string;
    compare: string;
    guide: string;
  };
};

function pageSpeedUrl(siteUrl: string, path: string): string {
  return `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(`${siteUrl}${path}`)}`;
}

export function getAdminAnalyticsLinks(): AdminAnalyticsLinks {
  const siteUrl = getSiteUrl();
  const repo = process.env.GITHUB_REPO?.trim();
  const [team, project] = repo?.split("/") ?? [];
  const vercelBase =
    team && project ? `https://vercel.com/${team}/${project}` : "https://vercel.com/dashboard";

  const propertyId = process.env.GA_PROPERTY_ID?.trim()?.replace(/^properties\//, "");
  const gaRealtime = propertyId
    ? `https://analytics.google.com/analytics/web/#/p${propertyId}/realtime/overview`
    : "https://analytics.google.com/analytics/web/#/realtime/overview";

  return {
    gaRealtime,
    vercelAnalytics: `${vercelBase}/analytics`,
    vercelSpeedInsights: `${vercelBase}/speed-insights`,
    pageSpeed: {
      home: pageSpeedUrl(siteUrl, "/"),
      countries: pageSpeedUrl(siteUrl, "/countries"),
      compare: pageSpeedUrl(siteUrl, "/compare/portugal-vs-spain"),
      guide: pageSpeedUrl(siteUrl, "/guides/best-digital-nomad-visas-europe"),
    },
  };
}

export function getGaDataApiSetupStatus() {
  return {
    gaPropertyId: Boolean(process.env.GA_PROPERTY_ID?.trim()),
    googleClientEmail: Boolean(process.env.GOOGLE_CLIENT_EMAIL?.trim()),
    googlePrivateKey: Boolean(process.env.GOOGLE_PRIVATE_KEY?.trim()),
  };
}
