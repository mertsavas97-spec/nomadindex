import Link from "next/link";

import { createAdminMetadata } from "@/lib/admin/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = createAdminMetadata("Settings");
export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const siteUrl = getSiteUrl();
  const hasAdminPassword = Boolean(process.env.ADMIN_PASSWORD);
  const dbPath = process.env.CMS_DATABASE_PATH ?? "./data/cms.db";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-navy">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Environment, backup, and CMS configuration overview.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">ADMIN_PASSWORD</span>
            <span className="font-medium text-navy">
              {hasAdminPassword ? "Configured" : "Missing"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">NEXT_PUBLIC_SITE_URL</span>
            <span className="font-medium text-navy">{siteUrl}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">CMS database</span>
            <span className="font-medium text-navy">{dbPath}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Backup / export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Download a JSON export of CMS posts and settings. Admin authentication is required.
          </p>
          <Button asChild variant="outline">
            <Link href="/admin/api/export">Download CMS export</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
