import { notFound } from "next/navigation";

import { PostEditor } from "@/components/admin/post-editor";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getPostByIdForAdmin } from "@/lib/cms/posts";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  return createAdminMetadata(post ? `Edit: ${post.title}` : "Edit post");
}

export default async function AdminEditPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);

  if (!post) {
    notFound();
  }

  return <PostEditor post={post} />;
}
