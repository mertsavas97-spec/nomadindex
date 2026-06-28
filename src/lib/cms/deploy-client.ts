import type { DeploymentState, DeploymentStatus } from "@/types/cms";

const VERCEL_API = "https://api.vercel.com";

export function isDeployHookConfigured(): boolean {
  return Boolean(process.env.VERCEL_DEPLOY_HOOK_URL?.trim());
}

export function isVercelApiConfigured(): boolean {
  return Boolean(
    process.env.VERCEL_API_TOKEN?.trim() && process.env.VERCEL_PROJECT_ID?.trim()
  );
}

export async function triggerDeployHook(): Promise<{ triggered: boolean }> {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();
  if (!hookUrl) {
    return { triggered: false };
  }

  const response = await fetch(hookUrl, { method: "POST" });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Deploy hook failed (${response.status}): ${body}`);
  }

  return { triggered: true };
}

function vercelHeaders() {
  const token = process.env.VERCEL_API_TOKEN?.trim();
  if (!token) {
    throw new Error("VERCEL_API_TOKEN is not configured");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

type VercelDeployment = {
  uid?: string;
  url?: string;
  state?: string;
  created?: number;
  ready?: number;
  meta?: { githubCommitMessage?: string };
};

function mapDeploymentState(state: string | undefined): DeploymentState {
  switch (state) {
    case "QUEUED":
    case "BUILDING":
    case "READY":
    case "ERROR":
    case "CANCELED":
      return state;
    default:
      return "UNKNOWN";
  }
}

function mapVercelDeployment(deployment: VercelDeployment): DeploymentStatus {
  return {
    id: deployment.uid ?? "unknown",
    url: deployment.url ? `https://${deployment.url}` : null,
    state: mapDeploymentState(deployment.state),
    createdAt: deployment.created
      ? new Date(deployment.created).toISOString()
      : new Date().toISOString(),
    readyAt: deployment.ready ? new Date(deployment.ready).toISOString() : null,
    commitMessage: deployment.meta?.githubCommitMessage ?? null,
  };
}

export async function getLatestDeploymentStatus(): Promise<DeploymentStatus | null> {
  if (!isVercelApiConfigured()) {
    return null;
  }

  const projectId = process.env.VERCEL_PROJECT_ID!.trim();
  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const teamQuery = teamId ? `&teamId=${encodeURIComponent(teamId)}` : "";

  const response = await fetch(
    `${VERCEL_API}/v6/deployments?projectId=${encodeURIComponent(projectId)}&limit=1${teamQuery}`,
    {
      headers: vercelHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Vercel deployment lookup failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as { deployments?: VercelDeployment[] };
  const latest = payload.deployments?.[0];
  return latest ? mapVercelDeployment(latest) : null;
}

export async function getDeploymentStatusById(
  deploymentId: string
): Promise<DeploymentStatus | null> {
  if (!isVercelApiConfigured()) {
    return null;
  }

  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const teamQuery = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";

  const response = await fetch(`${VERCEL_API}/v13/deployments/${deploymentId}${teamQuery}`, {
    headers: vercelHeaders(),
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Vercel deployment lookup failed (${response.status}): ${body}`);
  }

  const deployment = (await response.json()) as VercelDeployment;
  return mapVercelDeployment(deployment);
}

export async function publishCmsChanges(message: string) {
  const deploy = await triggerDeployHook();
  const deployment = deploy.triggered ? await getLatestDeploymentStatus() : null;

  return {
    commitMessage: message,
    deployTriggered: deploy.triggered,
    deployment,
  };
}
