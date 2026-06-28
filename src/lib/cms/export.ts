import { getAllSettingsMap } from "@/lib/cms/settings";
import { getAllPosts } from "@/lib/cms/posts";

export async function exportCmsData() {
  const posts = getAllPosts();
  const settings = await getAllSettingsMap();

  return {
    exportedAt: new Date().toISOString(),
    posts,
    settings,
  };
}
