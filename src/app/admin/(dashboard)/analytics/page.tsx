import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { createAdminMetadata } from "@/lib/admin/metadata";
import {
  getAdminAnalyticsLinks,
  getGaDataApiSetupStatus,
  getGaMeasurementId,
  isGaDataApiConfigured,
  isGaTrackingConfigured,
} from "@/lib/analytics/admin-config";
import { fetchGaSummary } from "@/lib/analytics/ga4";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = createAdminMetadata("Analytics");
export const dynamic = "force-dynamic";

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-navy">{value}</p>
      </CardContent>
    </Card>
  );
}

function AnalyticsTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: [string, string];
  rows: { label: string; value: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{headers[0]}</TableHead>
              <TableHead className="text-right">{headers[1]}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-muted-foreground">
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="text-right">{row.value}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ExternalAnalyticsLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-start justify-between gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/40"
    >
      <div>
        <p className="font-medium text-navy">{label}</p>
        {description ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <ExternalLink className="mt-0.5 size-4 shrink-0 text-primary-dark" aria-hidden />
    </a>
  );
}

export default async function AdminAnalyticsPage() {
  const trackingConfigured = isGaTrackingConfigured();
  const measurementId = getGaMeasurementId();
  const dataApiConfigured = isGaDataApiConfigured();
  const dataApiSetup = getGaDataApiSetupStatus();
  const links = getAdminAnalyticsLinks();

  let summary7d = null;
  let summary30d = null;
  let dataApiError: string | null = null;

  if (dataApiConfigured) {
    try {
      [summary7d, summary30d] = await Promise.all([
        fetchGaSummary("7d"),
        fetchGaSummary("30d"),
      ]);
    } catch (error) {
      dataApiError =
        error instanceof Error ? error.message : "Failed to fetch GA4 Data API metrics";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-navy">Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Public site tracking status, performance links, and optional GA4 Data API metrics.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base text-navy">GA tracking status</CardTitle>
          <Badge variant={trackingConfigured ? "default" : "secondary"}>
            {trackingConfigured ? "Active" : "Not configured"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex justify-between gap-4 rounded-lg border border-border px-4 py-3">
              <span className="text-muted-foreground">NEXT_PUBLIC_GA_ID</span>
              <Badge variant={measurementId ? "default" : "secondary"}>
                {measurementId ? "Set" : "Missing"}
              </Badge>
            </div>
            <div className="flex justify-between gap-4 rounded-lg border border-border px-4 py-3">
              <span className="text-muted-foreground">Measurement ID</span>
              <span className="font-mono text-navy">{measurementId ?? "—"}</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            The public GA4 tag loads on all non-admin routes when{" "}
            <code>NEXT_PUBLIC_GA_ID</code> is set. Admin pages are excluded from client-side
            tracking.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <ExternalAnalyticsLink
              href={links.gaRealtime}
              label="Google Analytics Realtime"
              description="Live users and events"
            />
            <ExternalAnalyticsLink
              href={links.vercelAnalytics}
              label="Vercel Analytics"
              description="Web analytics in Vercel dashboard"
            />
            <ExternalAnalyticsLink
              href={links.vercelSpeedInsights}
              label="Vercel Speed Insights"
              description="Core Web Vitals in Vercel dashboard"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-warning-text/20 bg-warning-bg/20">
        <CardHeader>
          <CardTitle className="text-base text-navy">Internal traffic note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="font-medium text-navy">Admin routes are not tracked</strong> by
            the public Google Analytics tag. Visits to <code>/admin/*</code> do not load{" "}
            <code>gtag.js</code>.
          </p>
          <p>
            Owner and team traffic on public pages may still appear in GA unless you filter it.
            Consider creating an{" "}
            <Link
              href="https://support.google.com/analytics/answer/10108813"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary-dark hover:underline"
            >
              Internal Traffic filter
            </Link>{" "}
            in GA4 when you are ready.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Performance quick links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <ExternalAnalyticsLink
            href={links.pageSpeed.home}
            label="PageSpeed — Homepage"
          />
          <ExternalAnalyticsLink
            href={links.pageSpeed.countries}
            label="PageSpeed — Countries"
          />
          <ExternalAnalyticsLink
            href={links.pageSpeed.compare}
            label="PageSpeed — Compare"
          />
          <ExternalAnalyticsLink
            href={links.pageSpeed.guide}
            label="PageSpeed — Guide page"
          />
        </CardContent>
      </Card>

      <Card className={dataApiConfigured ? undefined : "border-dashed opacity-95"}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base text-navy">GA4 Data API dashboard</CardTitle>
          <Badge variant={dataApiConfigured ? "default" : "secondary"}>
            {dataApiConfigured ? "Connected" : "Setup required"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {!dataApiConfigured ? (
            <>
              <p className="text-muted-foreground">
                Server-side GA4 metrics are optional. Add these environment variables to enable
                users, pageviews, and breakdown tables in admin:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-2">
                  <code>GA_PROPERTY_ID</code>
                  <Badge variant={dataApiSetup.gaPropertyId ? "default" : "outline"}>
                    {dataApiSetup.gaPropertyId ? "Set" : "Missing"}
                  </Badge>
                </li>
                <li className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-2">
                  <code>GOOGLE_CLIENT_EMAIL</code>
                  <Badge variant={dataApiSetup.googleClientEmail ? "default" : "outline"}>
                    {dataApiSetup.googleClientEmail ? "Set" : "Missing"}
                  </Badge>
                </li>
                <li className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-2">
                  <code>GOOGLE_PRIVATE_KEY</code>
                  <Badge variant={dataApiSetup.googlePrivateKey ? "default" : "outline"}>
                    {dataApiSetup.googlePrivateKey ? "Set" : "Missing"}
                  </Badge>
                </li>
              </ul>
              <p className="text-muted-foreground">
                Create a Google Cloud service account with the Analytics Data API enabled, grant
                it Viewer access on your GA4 property, then add the credentials above. Until then,
                use Google Analytics Realtime and the Vercel dashboards linked above.
              </p>
            </>
          ) : dataApiError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive">
              GA4 Data API error: {dataApiError}
            </p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Users (7 days)" value={summary7d?.activeUsers ?? "—"} />
                <MetricCard label="Users (30 days)" value={summary30d?.activeUsers ?? "—"} />
                <MetricCard label="Pageviews (7 days)" value={summary7d?.pageViews ?? "—"} />
                <MetricCard label="Sessions (7 days)" value={summary7d?.sessions ?? "—"} />
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                <AnalyticsTable
                  title="Top pages (7 days)"
                  headers={["Page", "Views"]}
                  rows={
                    summary7d?.topPages.map((row) => ({
                      label: row.path,
                      value: row.views,
                    })) ?? []
                  }
                />
                <AnalyticsTable
                  title="Top countries (7 days)"
                  headers={["Country", "Users"]}
                  rows={
                    summary7d?.topCountries.map((row) => ({
                      label: row.country,
                      value: row.users,
                    })) ?? []
                  }
                />
                <AnalyticsTable
                  title="Traffic sources (7 days)"
                  headers={["Source", "Sessions"]}
                  rows={
                    summary7d?.trafficSources.map((row) => ({
                      label: row.source,
                      value: row.sessions,
                    })) ?? []
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
