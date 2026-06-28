"use client";

import { useEffect, useState } from "react";

import type { DeploymentStatus } from "@/types/cms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DeploymentStatusPanelProps = {
  initialDeployment?: DeploymentStatus | null;
  poll?: boolean;
  statusWarning?: string;
};

function stateVariant(state: DeploymentStatus["state"]) {
  switch (state) {
    case "READY":
      return "default" as const;
    case "BUILDING":
    case "QUEUED":
      return "secondary" as const;
    case "ERROR":
    case "CANCELED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export function DeploymentStatusPanel({
  initialDeployment = null,
  poll = true,
  statusWarning,
}: DeploymentStatusPanelProps) {
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(
    initialDeployment
  );
  const [pollWarning, setPollWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!poll) return;

    let cancelled = false;

    async function fetchStatus() {
      try {
        const response = await fetch("/admin/api/deploy-status", {
          cache: "no-store",
        });
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Unable to load deployment status");
        }
        const payload = (await response.json()) as {
          deployment: DeploymentStatus | null;
          configured: boolean;
          warning?: string;
        };
        if (!cancelled) {
          setDeployment(payload.deployment);
          setPollWarning(payload.warning ?? null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setPollWarning(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load deployment status"
          );
        }
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [poll]);

  const warning = statusWarning ?? pollWarning;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base text-navy">Deployment status</CardTitle>
        {deployment ? (
          <Badge variant={stateVariant(deployment.state)}>{deployment.state}</Badge>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {warning ? (
          <p className="rounded-lg border border-warning-text/20 bg-warning-bg/40 px-3 py-2 text-warning-text">
            Deployment was triggered, but live status could not be loaded: {warning}
          </p>
        ) : null}
        {!deployment ? (
          <p className="text-muted-foreground">
            Configure `VERCEL_API_TOKEN` and `VERCEL_PROJECT_ID` to track deployment
            progress here.
          </p>
        ) : (
          <>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Deployment ID</span>
              <span className="font-mono text-xs text-navy">{deployment.id}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Started</span>
              <span className="text-navy">
                {new Date(deployment.createdAt).toLocaleString()}
              </span>
            </div>
            {deployment.readyAt ? (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Ready</span>
                <span className="text-navy">
                  {new Date(deployment.readyAt).toLocaleString()}
                </span>
              </div>
            ) : null}
            {deployment.commitMessage ? (
              <div>
                <p className="text-muted-foreground">Commit message</p>
                <p className="mt-1 text-navy">{deployment.commitMessage}</p>
              </div>
            ) : null}
            {deployment.url ? (
              <a
                href={deployment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex font-medium text-primary-dark hover:underline"
              >
                Open deployment preview
              </a>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
