import Link from "next/link";

import { createAdminMetadata } from "@/lib/admin/metadata";
import {
  isDeployHookConfigured,
  isVercelApiConfigured,
} from "@/lib/cms/deploy-client";
import { isGitHubCmsConfigured } from "@/lib/cms/persist";
import { getSiteUrl } from "@/lib/site-url";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = createAdminMetadata("Settings");
export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const siteUrl = getSiteUrl();
  const hasAdminPassword = Boolean(process.env.ADMIN_PASSWORD);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-navy">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Git-first CMS configuration and export tools.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">ADMIN_PASSWORD</span>
            <Badge variant={hasAdminPassword ? "default" : "destructive"}>
              {hasAdminPassword ? "Configured" : "Missing"}
            </Badge>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">NEXT_PUBLIC_SITE_URL</span>
            <span className="font-medium text-navy">{siteUrl}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">GitHub CMS</span>
            <Badge variant={isGitHubCmsConfigured() ? "default" : "secondary"}>
              {isGitHubCmsConfigured() ? "Configured" : "Missing"}
            </Badge>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Vercel Deploy Hook</span>
            <Badge variant={isDeployHookConfigured() ? "default" : "secondary"}>
              {isDeployHookConfigured() ? "Configured" : "Missing"}
            </Badge>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Vercel deployment API</span>
            <Badge variant={isVercelApiConfigured() ? "default" : "secondary"}>
              {isVercelApiConfigured() ? "Configured" : "Missing"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Content files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>`content/cms/guides.json`</p>
          <p>`content/cms/settings.json`</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Backup / export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Download a JSON export of CMS guides and settings from the current GitHub or bundled
            source.
          </p>
          <Button asChild variant="outline">
            <Link href="/admin/api/export">Download CMS export</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
