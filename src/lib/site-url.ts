/**
 * Resolves the public site URL for metadata, canonicals, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production/preview for correct absolute URLs.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "")}`;
  }

  return "https://nomadindex.app";
}
