import { getGitHubCmsSetupMessage, isGitHubCmsConfigured } from "@/lib/cms/cms-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CmsSetupNotice() {
  if (isGitHubCmsConfigured()) {
    return null;
  }

  return (
    <Card className="border-warning-text/30 bg-warning-bg/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base text-navy">CMS setup required</CardTitle>
        <Badge variant="secondary">Read-only mode</Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Admin is running in read-only mode. Content is loaded from bundled JSON in the
          repository. Saves are disabled until GitHub CMS credentials are configured.
        </p>
        <p className="font-medium text-navy">{getGitHubCmsSetupMessage()}</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>GITHUB_TOKEN</code> — fine-grained PAT with repository Contents read/write
          </li>
          <li>
            <code>GITHUB_REPO</code> — e.g. <code>owner/nomadindex-app</code>
          </li>
          <li>
            <code>GITHUB_BRANCH</code> — optional, defaults to <code>main</code>
          </li>
          <li>
            <code>VERCEL_DEPLOY_HOOK_URL</code> — optional, triggers rebuild after saves
          </li>
        </ul>
        <p>
          Content files: <code>content/cms/guides.json</code>,{" "}
          <code>content/cms/settings.json</code>
        </p>
      </CardContent>
    </Card>
  );
}
