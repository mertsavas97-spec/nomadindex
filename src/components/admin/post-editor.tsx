"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import {
  deletePostAction,
  savePostAction,
  type PostActionState,
} from "@/app/admin/(dashboard)/posts/actions";
import type { CmsPost } from "@/types/cms";
import { slugifyTitle } from "@/lib/cms/validation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeploymentStatusPanel } from "@/components/admin/deployment-status";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { parsePostTags } from "@/lib/cms/post-utils";

type PostEditorProps = {
  post?: CmsPost;
};

const initialState: PostActionState = {};

export function PostEditor({ post }: PostEditorProps) {
  const [state, formAction, pending] = useActionState(savePostAction, initialState);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [contentMarkdown, setContentMarkdown] = useState(post?.contentMarkdown ?? "");
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

  const tagsValue = post?.tags ? parsePostTags(post.tags).join(", ") : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-navy">
            {post ? "Edit post" : "New post"}
          </h2>
          {post ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Last updated {new Date(post.updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        {post?.status ? (
          <Badge variant={post.status === "published" ? "default" : "secondary"}>
            {post.status}
          </Badge>
        ) : null}
      </div>

      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      {state.deployTriggered ? (
        <div className="space-y-4">
          <p className="rounded-lg border border-primary/20 bg-primary-soft/40 px-4 py-3 text-sm text-navy">
            Changes committed to GitHub. A Vercel deployment has been triggered.
          </p>
          <DeploymentStatusPanel initialDeployment={state.deployment ?? null} />
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
        {post ? <input type="hidden" name="id" value={post.id} /> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!post && !slug) {
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
              placeholder="my-post-slug"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              defaultValue={post?.category ?? "general"}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" defaultValue={tagsValue} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} rows={3} />
        </div>

        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Markdown</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-2">
            <Label htmlFor="contentMarkdown">Content</Label>
            <Textarea
              id="contentMarkdown"
              name="contentMarkdown"
              value={contentMarkdown}
              onChange={(event) => setContentMarkdown(event.target.value)}
              rows={18}
              className="font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="preview">
            <div className="min-h-[320px] rounded-xl border border-border bg-background p-6">
              <MarkdownContent content={contentMarkdown} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO description</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              defaultValue={post?.seoDescription ?? ""}
              rows={3}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ogTitle">OG title</Label>
            <Input id="ogTitle" name="ogTitle" defaultValue={post?.ogTitle ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogDescription">OG description</Label>
            <Textarea
              id="ogDescription"
              name="ogDescription"
              defaultValue={post?.ogDescription ?? ""}
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
              defaultValue={post?.coverImage ?? ""}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Published date</Label>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="datetime-local"
              defaultValue={
                post?.publishedAt
                  ? new Date(post.publishedAt).toISOString().slice(0, 16)
                  : ""
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
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
            {pending ? "Saving..." : post ? "Publish / save" : "Create & publish"}
          </Button>
        </div>
      </form>

      {post ? (
        <div className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button asChild variant="outline">
            <Link href={`/blog/${post.slug}`} target="_blank">
              View public
            </Link>
          </Button>
          <form action={deletePostAction}>
            <input type="hidden" name="id" value={post.id} />
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
