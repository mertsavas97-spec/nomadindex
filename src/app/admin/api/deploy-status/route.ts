import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/session";
import {
  getDeploymentStatusById,
  getLatestDeploymentStatus,
  isVercelApiConfigured,
} from "@/lib/cms/deploy-client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isVercelApiConfigured()) {
    return NextResponse.json({
      configured: false,
      deployment: null,
    });
  }

  const { searchParams } = new URL(request.url);
  const deploymentId = searchParams.get("id");

  try {
    const deployment = deploymentId
      ? await getDeploymentStatusById(deploymentId)
      : await getLatestDeploymentStatus();

    return NextResponse.json({
      configured: true,
      deployment,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch deployment status",
      },
      { status: 500 }
    );
  }
}
