import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/session";
import { exportCmsData } from "@/lib/cms/export";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await exportCmsData();
  const filename = `nomadindex-cms-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
