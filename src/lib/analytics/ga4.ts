import { BetaAnalyticsDataClient } from "@google-analytics/data";

import { isGaDataApiConfigured } from "@/lib/analytics/admin-config";

export type AnalyticsRange = "7d" | "30d";

export type AnalyticsSummary = {
  activeUsers: number;
  pageViews: number;
  sessions: number;
  topPages: { path: string; views: number }[];
  topCountries: { country: string; users: number }[];
  trafficSources: { source: string; sessions: number }[];
  rangeLabel: string;
};

export function isGaConfigured(): boolean {
  return isGaDataApiConfigured();
}

function getDateRange(range: AnalyticsRange) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (range === "7d" ? 7 : 30));

  const format = (date: Date) => date.toISOString().slice(0, 10);
  return {
    startDate: format(start),
    endDate: format(end),
    rangeLabel: range === "7d" ? "Last 7 days" : "Last 30 days",
  };
}

function getAnalyticsClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL) {
    throw new Error("Missing GA credentials");
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });
}

export async function fetchGaSummary(
  range: AnalyticsRange
): Promise<AnalyticsSummary | null> {
  if (!isGaConfigured()) return null;

  const propertyId = process.env.GA_PROPERTY_ID!;
  const { startDate, endDate, rangeLabel } = getDateRange(range);
  const client = getAnalyticsClient();

  const [summaryReport, pagesReport, countriesReport, sourcesReport] =
    await Promise.all([
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "sessions" },
        ],
      }),
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
    ]);

  const summaryRow = summaryReport[0]?.rows?.[0]?.metricValues ?? [];
  const toNumber = (value: string | null | undefined) => Number(value ?? 0);

  return {
    activeUsers: toNumber(summaryRow[0]?.value),
    pageViews: toNumber(summaryRow[1]?.value),
    sessions: toNumber(summaryRow[2]?.value),
    topPages:
      pagesReport[0]?.rows?.map((row) => ({
        path: row.dimensionValues?.[0]?.value ?? "(unknown)",
        views: toNumber(row.metricValues?.[0]?.value),
      })) ?? [],
    topCountries:
      countriesReport[0]?.rows?.map((row) => ({
        country: row.dimensionValues?.[0]?.value ?? "(unknown)",
        users: toNumber(row.metricValues?.[0]?.value),
      })) ?? [],
    trafficSources:
      sourcesReport[0]?.rows?.map((row) => ({
        source: row.dimensionValues?.[0]?.value ?? "(unknown)",
        sessions: toNumber(row.metricValues?.[0]?.value),
      })) ?? [],
    rangeLabel,
  };
}
