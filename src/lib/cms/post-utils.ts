export function parsePostTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((tag): tag is string => typeof tag === "string");
    }
  } catch {
    // fall through
  }
  return [];
}

export function serializePostTags(tags: string[]): string {
  return JSON.stringify(tags.filter(Boolean));
}
