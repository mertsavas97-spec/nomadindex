/** AdSense publisher client ID — also used in ads.txt (pub-4628962707131944). */
export const ADSENSE_PUBLISHER_LINE =
  "google.com, pub-4628962707131944, DIRECT, f08c47fec0942fa0";

export function getAdSenseClientId(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  return fromEnv || null;
}

export function isAdminPathname(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export async function getRequestPathname(): Promise<string> {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  return headersList.get("x-pathname") ?? "";
}

/** Public routes only — never on /admin*. */
export function shouldIncludeAdSense(pathname: string): boolean {
  const clientId = getAdSenseClientId();
  if (!clientId) {
    return false;
  }
  if (isAdminPathname(pathname)) {
    return false;
  }
  return true;
}

export function getAdSenseMetadata(clientId: string) {
  return { other: { "google-adsense-account": clientId } } as const;
}
