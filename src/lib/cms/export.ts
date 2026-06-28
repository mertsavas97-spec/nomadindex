import { getAllSettingsMap } from "@/lib/cms/settings";
import { getAllGuidesForAdmin } from "@/lib/cms/guides";
import { isGitHubCmsConfigured } from "@/lib/cms/persist";
import { getAllGuides } from "@/data/guides";

export async function exportCmsData() {
  const guides = isGitHubCmsConfigured()
    ? await getAllGuidesForAdmin()
    : getAllGuides();
  const settings = await getAllSettingsMap();

  return {
    exportedAt: new Date().toISOString(),
    source: isGitHubCmsConfigured() ? "github" : "bundled-json",
    guides,
    settings,
  };
}
