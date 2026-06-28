import {
  getBundledCmsGuides,
  getBundledGuidesDocument,
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
import type { CmsGuide, GuidesDocument, SettingsDocument } from "@/types/cms";
import { CMS_CONTENT_PATHS } from "@/types/cms";

async function readGuidesDocument(): Promise<GuidesDocument> {
  if (isGitHubCmsConfigured()) {
    try {
      const file = await readGitHubFile(CMS_CONTENT_PATHS.guides);
      if (file) {
        return JSON.parse(file.content) as GuidesDocument;
      }
    } catch {
      // fall through to bundled content
    }
  }

  return getBundledGuidesDocument();
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

export async function loadGuidesForAdmin(): Promise<CmsGuide[]> {
  const document = await readGuidesDocument();
  return document.guides;
}

export async function saveGuidesDocument(guides: CmsGuide[], message: string) {
  assertGitHubCmsConfigured();

  const content = `${JSON.stringify({ guides }, null, 2)}\n`;
  await commitCmsFiles([{ path: CMS_CONTENT_PATHS.guides, content }], message);
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

export function getPublicCmsGuides(): CmsGuide[] {
  return getBundledCmsGuides();
}

export function getPublicSettingsMap(): Record<string, string> {
  return getBundledSettingsMap();
}

export { isGitHubCmsConfigured, getGitHubCmsSetupMessage };
