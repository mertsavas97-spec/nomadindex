import guidesDocument from "../../../content/cms/guides.json";
import settingsDocument from "../../../content/cms/settings.json";

import type { CmsGuide, GuidesDocument, SettingsDocument } from "@/types/cms";

export function getBundledGuidesDocument(): GuidesDocument {
  return guidesDocument as GuidesDocument;
}

export function getBundledSettingsDocument(): SettingsDocument {
  return settingsDocument as SettingsDocument;
}

export function getBundledCmsGuides(): CmsGuide[] {
  return getBundledGuidesDocument().guides;
}

export function getBundledSettingsMap(): Record<string, string> {
  return getBundledSettingsDocument().settings ?? {};
}
