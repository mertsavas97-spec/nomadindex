import {
  getPublicSettingsMap,
  loadSettingsForAdmin,
  saveSettingsDocument,
} from "@/lib/cms/persist";

export async function getAllSettingsMap(): Promise<Record<string, string>> {
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    try {
      return await loadSettingsForAdmin();
    } catch {
      // fall through
    }
  }

  return getPublicSettingsMap();
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const settings = await getAllSettingsMap();
  return settings[key] ?? fallback;
}

export async function setSettings(entries: Record<string, string>) {
  const current =
    process.env.GITHUB_TOKEN && process.env.GITHUB_REPO
      ? await loadSettingsForAdmin()
      : getPublicSettingsMap();
  const next = { ...current, ...entries };
  return saveSettingsDocument(next, "cms: update settings");
}

export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    // fall through
  }
  return [];
}

export function parseJsonFaqs(
  value: string
): { question: string; answer: string }[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { question: string; answer: string } =>
        typeof item === "object" &&
        item !== null &&
        "question" in item &&
        "answer" in item &&
        typeof item.question === "string" &&
        typeof item.answer === "string"
    );
  } catch {
    return [];
  }
}

export function getPublicSettings(): Record<string, string> {
  return getPublicSettingsMap();
}
