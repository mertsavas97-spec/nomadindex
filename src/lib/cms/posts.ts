import "server-only";

import { count, desc, eq, like, or } from "drizzle-orm";

import { getDb } from "@/db";
import { posts, type NewPost, type Post } from "@/db/schema";

export function getAllPosts(): Post[] {
  return getDb().select().from(posts).orderBy(desc(posts.updatedAt)).all();
}

export function getPublishedPosts(): Post[] {
  return getDb()
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .all();
}

export function getPostById(id: string): Post | undefined {
  return getDb().select().from(posts).where(eq(posts.id, id)).get();
}

export function getPostBySlug(slug: string): Post | undefined {
  return getDb().select().from(posts).where(eq(posts.slug, slug)).get();
}

export function getPublishedPostBySlug(slug: string): Post | undefined {
  const post = getDb().select().from(posts).where(eq(posts.slug, slug)).get();
  if (!post || post.status !== "published") return undefined;
  return post;
}

export function searchPosts(query: string, status?: "draft" | "published"): Post[] {
  const pattern = `%${query.trim()}%`;
  const conditions = [
    like(posts.title, pattern),
    like(posts.slug, pattern),
    like(posts.excerpt, pattern),
  ];

  if (status) {
    return getDb()
      .select()
      .from(posts)
      .where(or(...conditions))
      .orderBy(desc(posts.updatedAt))
      .all()
      .filter((post) => post.status === status);
  }

  return getDb()
    .select()
    .from(posts)
    .where(or(...conditions))
    .orderBy(desc(posts.updatedAt))
    .all();
}

export function getPostsByStatus(status: "draft" | "published"): Post[] {
  return getDb()
    .select()
    .from(posts)
    .where(eq(posts.status, status))
    .orderBy(desc(posts.updatedAt))
    .all();
}

export function countPostsByStatus(status: "draft" | "published"): number {
  const row = getDb()
    .select({ value: count() })
    .from(posts)
    .where(eq(posts.status, status))
    .get();
  return row?.value ?? 0;
}

export function isSlugTaken(slug: string, excludeId?: string): boolean {
  const existing = getPostBySlug(slug);
  if (!existing) return false;
  if (excludeId && existing.id === excludeId) return false;
  return true;
}

export function createPost(data: NewPost): Post {
  getDb().insert(posts).values(data).run();
  const created = getPostById(data.id);
  if (!created) {
    throw new Error("Failed to create post");
  }
  return created;
}

export function updatePost(id: string, data: Partial<NewPost>): Post {
  getDb().update(posts).set(data).where(eq(posts.id, id)).run();
  const updated = getPostById(id);
  if (!updated) {
    throw new Error("Post not found");
  }
  return updated;
}

export function deletePost(id: string) {
  getDb().delete(posts).where(eq(posts.id, id)).run();
}

import { parsePostTags, serializePostTags } from "@/lib/cms/post-utils";
