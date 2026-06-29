import { ADSENSE_PUBLISHER_LINE } from "@/lib/ads/adsense-config";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return new Response(`${ADSENSE_PUBLISHER_LINE}\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
