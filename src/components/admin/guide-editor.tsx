"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";

import {
  deleteGuideAction,
  saveGuideAction,
  type GuideActionState,
} from "@/app/admin/(dashboard)/guides/actions";
import type { CmsGuide } from "@/types/cms";
import {
  countWords,
  estimateReadingTimeFromMarkdown,
  GUIDE_AUDIENCES,
  GUIDE_CATEGORIES,
  slugifyTitle,
} from "@/lib/cms/validation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeploymentStatusPanel } from "@/components/admin/deployment-status";
import { MarkdownContent } from "@/components/markdown-content";

type GuideEditorProps = {
  guide?: CmsGuide;
  isBaseOnly?: boolean;
};

const initialState: GuideActionState = {};

export function GuideEditor({ guide, isBaseOnly = false }: GuideEditorProps) {
  const [state, formAction, pending] = useActionState(saveGuideAction, initialState);
  const [title, setTitle] = useState(guide?.title ?? "");
  const [slug, setSlug] = useState(guide?.slug ?? "");
  const [markdownBody, setMarkdownBody] = useState(guide?.markdownBody ?? "");
  const [seoTitle, setSeoTitle] = useState(guide?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(guide?.seoDescription ?? "");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  const wordCount = useMemo(() => countWords(markdownBody), [markdownBody]);
  const readingTime = useMemo(
    () => estimateReadingTimeFromMarkdown(markdownBody),
    [markdownBody]
  );

  const serpTitle = seoTitle.trim() || title.trim() || "Guide title";
  const serpDescription =
    seoDescription.trim() ||
    guide?.excerpt.trim() ||
    "Guide description preview for search results.";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-navy">
            {guide ? "Edit guide" : "New guide"}
          </h2>
          {guide ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Last updated {new Date(guide.updatedAt).toLocaleString()}
              {isBaseOnly ? " · Loaded from base dataset (not yet in CMS JSON)" : null}
            </p>
          ) : null}
        </div>
        {guide?.status ? (
          <Badge variant={guide.status === "published" ? "default" : "secondary"}>
            {guide.status}
          </Badge>
        ) : null}
      </div>

      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      {state.successMessage ? (
        <p className="rounded-lg border border-primary/20 bg-primary-soft/40 px-4 py-3 text-sm text-navy">
          {state.successMessage}
        </p>
      ) : null}

      {state.deployTriggered ? (
        <div className="space-y-4">
          <DeploymentStatusPanel
            initialDeployment={state.deployment ?? null}
            statusWarning={state.deploymentStatusWarning}
          />
        </div>
      ) : null}

      {state.warnings?.length ? (
        <div className="rounded-lg border border-warning-text/20 bg-warning-bg/40 px-4 py-3 text-sm text-warning-text">
          {state.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}

      <form
        action={formAction}
        className="space-y-6"
        onChange={() => setDirty(true)}
        onSubmit={() => setDirty(false)}
      >
        {guide ? <input type="hidden" name="id" value={guide.id} /> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!guide && !slug) {
                  setSlug(slugifyTitle(event.target.value));
                }
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="my-guide-slug"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={guide?.category ?? "overview"}
              className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {GUIDE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Audience</Label>
            <select
              id="targetAudience"
              name="targetAudience"
              defaultValue={guide?.targetAudience ?? "all"}
              className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {GUIDE_AUDIENCES.map((audience) => (
                <option key={audience} value={audience}>
                  {audience}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" defaultValue={guide?.excerpt ?? ""} rows={3} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summaryBox">Summary box</Label>
          <Textarea
            id="summaryBox"
            name="summaryBox"
            defaultValue={guide?.summaryBox ?? ""}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keyTakeaways">Key takeaways (one per line)</Label>
          <Textarea
            id="keyTakeaways"
            name="keyTakeaways"
            defaultValue={guide?.keyTakeaways.join("\n") ?? ""}
            rows={4}
          />
        </div>

        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Markdown body</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="markdownBody">Guide body (optional — leave empty to use structured sections)</Label>
              <p className="text-xs text-muted-foreground">
                {wordCount} words · ~{readingTime} min read
              </p>
            </div>
            <Textarea
              id="markdownBody"
              name="markdownBody"
              value={markdownBody}
              onChange={(event) => setMarkdownBody(event.target.value)}
              rows={18}
              className="font-mono text-sm"
            />
            <input type="hidden" name="readingTime" value={String(readingTime)} />
          </TabsContent>
          <TabsContent value="preview">
            <div className="min-h-[320px] rounded-xl border border-border bg-background p-6">
              <MarkdownContent content={markdownBody} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="sectionsJson">Structured sections (JSON, optional fallback)</Label>
          <Textarea
            id="sectionsJson"
            name="sectionsJson"
            defaultValue={
              guide?.sections?.length ? JSON.stringify(guide.sections, null, 2) : ""
            }
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faqsJson">FAQ (JSON array)</Label>
          <Textarea
            id="faqsJson"
            name="faqsJson"
            defaultValue={guide?.faqs?.length ? JSON.stringify(guide.faqs, null, 2) : "[]"}
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="relatedCountrySlugs">Related countries (comma-separated slugs)</Label>
            <Input
              id="relatedCountrySlugs"
              name="relatedCountrySlugs"
              defaultValue={guide?.relatedCountrySlugs.join(", ") ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relatedVisaSlugs">Related visas (comma-separated slugs)</Label>
            <Input
              id="relatedVisaSlugs"
              name="relatedVisaSlugs"
              defaultValue={guide?.relatedVisaSlugs.join(", ") ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relatedCompareSlugs">Related comparisons (comma-separated slugs)</Label>
            <Input
              id="relatedCompareSlugs"
              name="relatedCompareSlugs"
              defaultValue={guide?.relatedCompareSlugs.join(", ") ?? ""}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO description</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              rows={3}
            />
          </div>
        </div>

        <CardSerpPreview title={serpTitle} description={serpDescription} url={`/guides/${slug || "guide-slug"}`} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ogTitle">OG title</Label>
            <Input id="ogTitle" name="ogTitle" defaultValue={guide?.ogTitle ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogDescription">OG description</Label>
            <Textarea
              id="ogDescription"
              name="ogDescription"
              defaultValue={guide?.ogDescription ?? ""}
              rows={3}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              defaultValue={guide?.coverImage ?? ""}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastReviewed">Last reviewed (YYYY-MM-DD)</Label>
            <Input
              id="lastReviewed"
              name="lastReviewed"
              type="date"
              defaultValue={guide?.lastReviewed?.slice(0, 10) ?? ""}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Published date</Label>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="datetime-local"
              defaultValue={
                guide?.publishedAt
                  ? new Date(guide.publishedAt).toISOString().slice(0, 16)
                  : ""
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="datePublished">Date published (display)</Label>
            <Input
              id="datePublished"
              name="datePublished"
              type="date"
              defaultValue={guide?.datePublished?.slice(0, 10) ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateModified">Date modified (display)</Label>
            <Input
              id="dateModified"
              name="dateModified"
              type="date"
              defaultValue={guide?.dateModified?.slice(0, 10) ?? ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={guide?.status ?? "draft"}
            className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" name="intent" value="draft" variant="outline" disabled={pending}>
            Save draft
          </Button>
          <Button type="submit" name="intent" value="publish" disabled={pending}>
            {pending ? "Saving..." : guide ? "Publish / save" : "Create & publish"}
          </Button>
        </div>
      </form>

      {guide ? (
        <div className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button asChild variant="outline">
            <Link href={`/guides/${guide.slug}`} target="_blank">
              View public
            </Link>
          </Button>
          {!isBaseOnly ? (
            <form action={deleteGuideAction}>
              <input type="hidden" name="id" value={guide.id} />
              <Button type="submit" variant="destructive">
                Remove CMS override
              </Button>
            </form>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CardSerpPreview({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        SERP preview
      </p>
      <p className="mt-3 truncate text-lg text-[#1a0dab]">{title}</p>
      <p className="truncate text-sm text-[#006621]">nomadindex.app{url}</p>
      <p className="mt-1 line-clamp-2 text-sm text-brand-muted">{description}</p>
    </div>
  );
}
