import { createAdminMetadata } from "@/lib/admin/metadata";
import { fetchGaSummary, isGaConfigured } from "@/lib/analytics/ga4";
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

export default async function AdminAnalyticsPage() {
  const configured = isGaConfigured();
  const [summary7d, summary30d] = configured
    ? await Promise.all([fetchGaSummary("7d"), fetchGaSummary("30d")])
    : [null, null];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-navy">Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          GA4 metrics when credentials are configured. Otherwise setup instructions are shown below.
        </p>
      </div>

      {!configured ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-navy">Google Analytics setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Add these environment variables to enable the GA4 Data API dashboard:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><code>GA_PROPERTY_ID</code></li>
              <li><code>GOOGLE_CLIENT_EMAIL</code></li>
              <li><code>GOOGLE_PRIVATE_KEY</code></li>
            </ul>
            <p>
              Create a Google Cloud service account with Analytics Data API access and grant it
              Viewer access on the GA4 property.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <h3 className="font-heading text-lg font-semibold text-navy">Last 7 days</h3>
            {summary7d ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <MetricCard label="Active users" value={summary7d.activeUsers} />
                <MetricCard label="Page views" value={summary7d.pageViews} />
                <MetricCard label="Sessions" value={summary7d.sessions} />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {summary7d ? (
              <>
                <AnalyticsTable
                  title="Top pages (7d)"
                  headers={["Page", "Views"]}
                  rows={summary7d.topPages.map((row) => ({
                    label: row.path,
                    value: row.views,
                  }))}
                />
                <AnalyticsTable
                  title="Top countries (7d)"
                  headers={["Country", "Users"]}
                  rows={summary7d.topCountries.map((row) => ({
                    label: row.country,
                    value: row.users,
                  }))}
                />
                <AnalyticsTable
                  title="Traffic sources (7d)"
                  headers={["Source", "Sessions"]}
                  rows={summary7d.trafficSources.map((row) => ({
                    label: row.source,
                    value: row.sessions,
                  }))}
                />
              </>
            ) : null}
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-navy">Last 30 days</h3>
            {summary30d ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <MetricCard label="Active users" value={summary30d.activeUsers} />
                <MetricCard label="Page views" value={summary30d.pageViews} />
                <MetricCard label="Sessions" value={summary30d.sessions} />
              </div>
            ) : null}
          </div>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Search Console (coming soon)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Search Console API integration can be added here for queries, impressions, and click
          data. For now, use the Search Console verification field in SEO settings and the web UI.
        </CardContent>
      </Card>
    </div>
  );
}
