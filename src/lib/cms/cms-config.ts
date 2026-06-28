export function isGitHubCmsConfigured(): boolean {
  return Boolean(
    process.env.GITHUB_TOKEN?.trim() && process.env.GITHUB_REPO?.trim()
  );
}

export function getGitHubCmsSetupMessage(): string {
  return "Set GITHUB_TOKEN and GITHUB_REPO in Vercel environment variables to enable CMS saves.";
}

export function assertGitHubCmsConfigured(): void {
  if (!isGitHubCmsConfigured()) {
    throw new Error(getGitHubCmsSetupMessage());
  }
}
