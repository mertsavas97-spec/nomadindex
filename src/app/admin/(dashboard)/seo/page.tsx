import { createAdminMetadata } from "@/lib/admin/metadata";
import { SeoSettingsForm } from "@/components/admin/seo-settings-form";
import { getResolvedSiteSettings } from "@/lib/site-settings";

export const metadata = createAdminMetadata("SEO");
export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const settings = await getResolvedSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-navy">SEO</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Site-wide SEO and verification settings. Empty values fall back to current defaults.
        </p>
      </div>
      <SeoSettingsForm settings={settings} />
    </div>
  );
}
