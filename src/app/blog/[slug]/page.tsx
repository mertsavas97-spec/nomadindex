import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { MarkdownContent } from "@/components/blog/markdown-content";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  getPublishedPostBySlug,
  getPublishedPosts,
} from "@/lib/cms/posts";
import { parsePostTags } from "@/lib/cms/post-utils";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  createNotFoundMetadata,
  createPageMetadata,
  withSiteTitle,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPostBySlug(slug);

  if (!post) {
    return createNotFoundMetadata("Blog post not found");
  }

  const title = post.seoTitle?.trim() || post.title;
  const description = post.seoDescription?.trim() || post.excerpt;

  return createPageMetadata({
    title: withSiteTitle(title),
    description,
    path: `/blog/${post.slug}`,
    openGraphType: "article",
    absoluteTitle: true,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedAt = post.publishedAt ?? post.createdAt;
  const modifiedAt = post.updatedAt;
  const tags = parsePostTags(post.tags);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          buildArticleJsonLd({
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            datePublished: publishedAt,
            dateModified: modifiedAt,
            pathPrefix: "/blog",
            imageUrl: post.coverImage ?? undefined,
          }),
        ]}
      />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-navy">{post.title}</h1>
          <p className="mt-3 text-lg text-brand-muted">{post.excerpt}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Published{" "}
            {new Date(publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {post.coverImage ? (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={post.coverImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}

          <div className="mt-10">
            <MarkdownContent content={post.contentMarkdown} />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
