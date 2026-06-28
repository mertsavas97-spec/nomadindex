import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { settings } from "@/db/schema";

export async function getAllSettingsMap(): Promise<Record<string, string>> {
  try {
    const rows = getDb().select().from(settings).all();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch {
    return {};
  }
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  try {
    const row = getDb()
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .get();
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: string) {
  const now = new Date().toISOString();
  getDb()
    .insert(settings)
    .values({ key, value, updatedAt: now })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: now },
    })
    .run();
}

export async function setSettings(entries: Record<string, string>) {
  for (const [key, value] of Object.entries(entries)) {
    await setSetting(key, value);
  }
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
