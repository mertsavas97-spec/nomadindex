import Link from "next/link";
import { ExternalLink, FileText, Globe2, MapPin, Plane } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DeploymentStatusPanel } from "@/components/admin/deployment-status";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getLatestDeploymentStatus } from "@/lib/cms/deploy-client";
import {
  countGuidesByStatus,
  getLastGuideUpdateForAdmin,
} from "@/lib/cms/guides";
import { isGitHubCmsConfigured } from "@/lib/cms/persist";
import { getAllCountries, getAllVisaPrograms } from "@/data";
import { absoluteUrl } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = createAdminMetadata("Dashboard");
export const dynamic = "force-dynamic";

function StatCard({
  title,
  value,
  href,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  href?: string;
  icon: LucideIcon;
}) {
  const content = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-primary-dark" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-navy">{value}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

export default async function AdminDashboardPage() {
  const publishedGuides = countGuidesByStatus("published");
  const draftGuides = countGuidesByStatus("draft");
  const totalGuides = publishedGuides + draftGuides;
  const lastGuideUpdate = await getLastGuideUpdateForAdmin();
  const countryCount = getAllCountries().length;
  const visaCount = getAllVisaPrograms().length;
  const siteUrl = getSiteUrl();
  const deployment = await getLatestDeploymentStatus().catch(() => null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-navy">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Git-first CMS overview. Guide saves commit JSON to GitHub and trigger Vercel rebuilds.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base text-navy">CMS persistence</CardTitle>
          <Badge variant={isGitHubCmsConfigured() ? "default" : "secondary"}>
            {isGitHubCmsConfigured() ? "GitHub connected" : "GitHub not configured"}
          </Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Content lives in `content/cms/*.json` in the repository. Admin saves create GitHub
          commits and optionally trigger a Vercel Deploy Hook.
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Published guides"
          value={publishedGuides}
          href="/admin/guides?status=published"
          icon={FileText}
        />
        <StatCard
          title="Draft guides"
          value={draftGuides}
          href="/admin/guides?status=draft"
          icon={FileText}
        />
        <StatCard title="Total guide articles" value={totalGuides} icon={Globe2} />
        <StatCard
          title="Last guide update"
          value={
            lastGuideUpdate
              ? new Date(lastGuideUpdate).toLocaleDateString()
              : "—"
          }
          href="/admin/guides"
          icon={Globe2}
        />
        <StatCard title="Total countries" value={countryCount} icon={MapPin} />
        <StatCard title="Total visa programs" value={visaCount} icon={Plane} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DeploymentStatusPanel initialDeployment={deployment} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-navy">Site links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Site URL</span>
              <a
                href={siteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary-dark hover:underline"
              >
                {siteUrl}
                <ExternalLink className="size-3.5" />
              </a>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Sitemap URL</span>
              <a
                href={absoluteUrl("/sitemap.xml")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary-dark hover:underline"
              >
                /sitemap.xml
                <ExternalLink className="size-3.5" />
              </a>
            </div>
            {deployment?.readyAt ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Last deployment</span>
                <span className="font-medium text-navy">
                  {new Date(deployment.readyAt).toLocaleString()}
                </span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Quick links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Link href="/admin/guides/new" className="block text-primary-dark hover:underline">
            Create new guide
          </Link>
          <Link href="/admin/seo" className="block text-primary-dark hover:underline">
            Edit SEO settings
          </Link>
          <Link href="/admin/homepage" className="block text-primary-dark hover:underline">
            Edit homepage content
          </Link>
          <Link href="/admin/analytics" className="block text-primary-dark hover:underline">
            View analytics
          </Link>
          <Link href="/guides" className="block text-primary-dark hover:underline">
            View public guides
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
