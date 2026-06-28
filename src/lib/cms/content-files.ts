import postsDocument from "../../../content/cms/posts.json";
import settingsDocument from "../../../content/cms/settings.json";

import type { CmsPost, PostsDocument, SettingsDocument } from "@/types/cms";

export function getBundledPostsDocument(): PostsDocument {
  return postsDocument as PostsDocument;
}

export function getBundledSettingsDocument(): SettingsDocument {
  return settingsDocument as SettingsDocument;
}

export function getBundledPosts(): CmsPost[] {
  return getBundledPostsDocument().posts;
}

export function getBundledSettingsMap(): Record<string, string> {
  return getBundledSettingsDocument().settings ?? {};
}
