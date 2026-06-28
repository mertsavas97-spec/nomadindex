import { isGitHubCmsConfigured } from "@/lib/cms/cms-config";

const GITHUB_API = "https://api.github.com";

export type GitHubFile = {
  content: string;
  sha: string;
};

export { isGitHubCmsConfigured as isGitHubConfigured };

function getRepoParts() {
  const repo = process.env.GITHUB_REPO?.trim();
  if (!repo || !repo.includes("/")) {
    throw new Error("GITHUB_REPO must be set to owner/repo");
  }
  const [owner, name] = repo.split("/");
  return { owner, repo: name, branch: process.env.GITHUB_BRANCH?.trim() || "main" };
}

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function readGitHubFile(path: string): Promise<GitHubFile | null> {
  const { owner, repo, branch } = getRepoParts();
  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    {
      headers: githubHeaders(),
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub read failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as { content?: string; sha?: string };
  if (!payload.content || !payload.sha) {
    throw new Error(`GitHub file ${path} is missing content or sha`);
  }

  return {
    content: Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8"),
    sha: payload.sha,
  };
}

export async function writeGitHubFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ commitSha: string }> {
  const { owner, repo, branch } = getRepoParts();
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub write failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as {
    commit?: { sha?: string };
  };

  return {
    commitSha: payload.commit?.sha ?? "unknown",
  };
}

export async function commitCmsFiles(
  files: { path: string; content: string }[],
  message: string
) {
  if (!isGitHubCmsConfigured()) {
    throw new Error("GitHub CMS integration is not configured");
  }

  let lastCommitSha = "unknown";

  for (const file of files) {
    const existing = await readGitHubFile(file.path);
    const result = await writeGitHubFile(
      file.path,
      file.content,
      files.length === 1 ? message : `${message} (${file.path})`,
      existing?.sha
    );
    lastCommitSha = result.commitSha;
  }

  return { commitSha: lastCommitSha };
}
