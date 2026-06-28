import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getPublishedPosts } from "@/lib/cms/posts";
import { parsePostTags } from "@/lib/cms/post-utils";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Editorial updates, mobility insights, and NomadIndex announcements for founders, freelancers, and remote workers.",
  path: "/blog",
});

export const dynamic = "force-dynamic";

export default function BlogIndexPage() {
  const posts = getPublishedPosts();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
              NomadIndex Blog
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-navy">
              Mobility insights & updates
            </h1>
            <p className="mt-3 text-brand-muted">
              CMS blog posts live separately from structured visa guides at{" "}
              <Link href="/guides" className="text-primary-dark hover:underline">
                /guides
              </Link>
              .
            </p>
          </div>

          <div className="mt-10 grid gap-6">
            {posts.length === 0 ? (
              <p className="text-brand-muted">No published blog posts yet.</p>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-border bg-background p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    {parsePostTags(post.tags).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="mt-3 font-heading text-2xl font-semibold text-navy">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary-dark">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-brand-muted">{post.excerpt}</p>
                  {post.publishedAt ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
