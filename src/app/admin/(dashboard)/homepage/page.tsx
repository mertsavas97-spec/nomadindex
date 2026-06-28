import { createAdminMetadata } from "@/lib/admin/metadata";
import { HomepageSettingsForm } from "@/components/admin/homepage-settings-form";
import { getResolvedSiteSettingsForAdmin } from "@/lib/site-settings";

export const metadata = createAdminMetadata("Homepage");
export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const settings = await getResolvedSiteSettingsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-navy">Homepage</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit hero copy, featured slugs, FAQs, and bottom CTA content.
        </p>
      </div>
      <HomepageSettingsForm settings={settings} />
    </div>
  );
}
