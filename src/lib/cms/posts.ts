import type { CmsPost, NewCmsPost } from "@/types/cms";
import {
  getPublicPosts,
  loadPostsForAdmin,
  savePostsDocument,
} from "@/lib/cms/persist";

export type Post = CmsPost;
export type NewPost = NewCmsPost;

function sortByUpdatedDesc(posts: CmsPost[]) {
  return [...posts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function sortByPublishedDesc(posts: CmsPost[]) {
  return [...posts].sort((a, b) => {
    const aDate = a.publishedAt ?? a.createdAt;
    const bDate = b.publishedAt ?? b.createdAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
}

export function getAllPosts(): CmsPost[] {
  return sortByUpdatedDesc(getPublicPosts());
}

export function getPublishedPosts(): CmsPost[] {
  return sortByPublishedDesc(
    getPublicPosts().filter((post) => post.status === "published")
  );
}

export function getPostBySlug(slug: string): CmsPost | undefined {
  return getPublicPosts().find((post) => post.slug === slug);
}

export function getPublishedPostBySlug(slug: string): CmsPost | undefined {
  const post = getPostBySlug(slug);
  if (!post || post.status !== "published") return undefined;
  return post;
}

export function countPostsByStatus(status: "draft" | "published"): number {
  return getPublicPosts().filter((post) => post.status === status).length;
}

export async function getAllPostsForAdmin(): Promise<CmsPost[]> {
  return sortByUpdatedDesc(await loadPostsForAdmin());
}

export async function getPostByIdForAdmin(id: string): Promise<CmsPost | undefined> {
  return (await loadPostsForAdmin()).find((post) => post.id === id);
}

export async function searchPostsForAdmin(
  query: string,
  status?: "draft" | "published"
): Promise<CmsPost[]> {
  const pattern = query.trim().toLowerCase();
  const posts = await getAllPostsForAdmin();

  return posts.filter((post) => {
    if (status && post.status !== status) return false;
    if (!pattern) return true;

    return (
      post.title.toLowerCase().includes(pattern) ||
      post.slug.toLowerCase().includes(pattern) ||
      post.excerpt.toLowerCase().includes(pattern)
    );
  });
}

export async function getPostsByStatusForAdmin(
  status: "draft" | "published"
): Promise<CmsPost[]> {
  return sortByUpdatedDesc(
    (await loadPostsForAdmin()).filter((post) => post.status === status)
  );
}

export async function isSlugTakenForAdmin(slug: string, excludeId?: string) {
  const existing = (await loadPostsForAdmin()).find((post) => post.slug === slug);
  if (!existing) return false;
  if (excludeId && existing.id === excludeId) return false;
  return true;
}

export async function persistPostsForAdmin(
  posts: CmsPost[],
  message: string
) {
  return savePostsDocument(posts, message);
}

export async function createPostForAdmin(data: CmsPost) {
  const posts = await loadPostsForAdmin();
  posts.push(data);
  return persistPostsForAdmin(posts, `cms: create post ${data.slug}`);
}

export async function updatePostForAdmin(id: string, data: Partial<CmsPost>) {
  const posts = await loadPostsForAdmin();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) {
    throw new Error("Post not found");
  }

  posts[index] = { ...posts[index], ...data };
  return persistPostsForAdmin(posts, `cms: update post ${posts[index].slug}`);
}

export async function deletePostForAdmin(id: string) {
  const posts = await loadPostsForAdmin();
  const post = posts.find((entry) => entry.id === id);
  if (!post) {
    throw new Error("Post not found");
  }

  const nextPosts = posts.filter((entry) => entry.id !== id);
  return persistPostsForAdmin(nextPosts, `cms: delete post ${post.slug}`);
}
