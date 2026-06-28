import { getAllSettingsMap } from "@/lib/cms/settings";
import { getAllPosts, getAllPostsForAdmin } from "@/lib/cms/posts";
import { isGitHubCmsConfigured } from "@/lib/cms/persist";

export async function exportCmsData() {
  const posts = isGitHubCmsConfigured()
    ? await getAllPostsForAdmin()
    : getAllPosts();
  const settings = await getAllSettingsMap();

  return {
    exportedAt: new Date().toISOString(),
    source: isGitHubCmsConfigured() ? "github" : "bundled-json",
    posts,
    settings,
  };
}
