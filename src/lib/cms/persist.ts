import {
  getBundledPosts,
  getBundledPostsDocument,
  getBundledSettingsDocument,
  getBundledSettingsMap,
} from "@/lib/cms/content-files";
import {
  assertGitHubCmsConfigured,
  getGitHubCmsSetupMessage,
  isGitHubCmsConfigured,
} from "@/lib/cms/cms-config";
import { commitCmsFiles, readGitHubFile } from "@/lib/cms/github-client";
import { publishCmsChanges } from "@/lib/cms/deploy-client";
import type { CmsPost, PostsDocument, SettingsDocument } from "@/types/cms";
import { CMS_CONTENT_PATHS } from "@/types/cms";

async function readPostsDocument(): Promise<PostsDocument> {
  if (isGitHubCmsConfigured()) {
    try {
      const file = await readGitHubFile(CMS_CONTENT_PATHS.posts);
      if (file) {
        return JSON.parse(file.content) as PostsDocument;
      }
    } catch {
      // fall through to bundled content
    }
  }

  return getBundledPostsDocument();
}

async function readSettingsDocument(): Promise<SettingsDocument> {
  if (isGitHubCmsConfigured()) {
    try {
      const file = await readGitHubFile(CMS_CONTENT_PATHS.settings);
      if (file) {
        return JSON.parse(file.content) as SettingsDocument;
      }
    } catch {
      // fall through to bundled content
    }
  }

  return getBundledSettingsDocument();
}

export async function loadPostsForAdmin(): Promise<CmsPost[]> {
  const document = await readPostsDocument();
  return document.posts;
}

export async function savePostsDocument(posts: CmsPost[], message: string) {
  assertGitHubCmsConfigured();

  const content = `${JSON.stringify({ posts }, null, 2)}\n`;
  await commitCmsFiles([{ path: CMS_CONTENT_PATHS.posts, content }], message);
  return publishCmsChanges(message);
}

export async function loadSettingsForAdmin(): Promise<Record<string, string>> {
  const document = await readSettingsDocument();
  return document.settings ?? {};
}

export async function saveSettingsDocument(
  settings: Record<string, string>,
  message: string
) {
  assertGitHubCmsConfigured();

  const content = `${JSON.stringify(
    {
      settings,
      updatedAt: new Date().toISOString(),
    },
    null,
    2
  )}\n`;

  await commitCmsFiles([{ path: CMS_CONTENT_PATHS.settings, content }], message);
  return publishCmsChanges(message);
}

export function getPublicPosts(): CmsPost[] {
  return getBundledPosts();
}

export function getPublicSettingsMap(): Record<string, string> {
  return getBundledSettingsMap();
}

export { isGitHubCmsConfigured, getGitHubCmsSetupMessage };
