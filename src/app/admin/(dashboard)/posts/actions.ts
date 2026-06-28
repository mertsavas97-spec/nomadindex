"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createPostForAdmin,
  deletePostForAdmin,
  isSlugTakenForAdmin,
  updatePostForAdmin,
} from "@/lib/cms/posts";
import { parsePostTags, serializePostTags } from "@/lib/cms/post-utils";
import {
  getPostValidationWarnings,
  postFormSchema,
  slugifyTitle,
} from "@/lib/cms/validation";
import { requireAdmin } from "@/lib/auth/session";
import type { DeploymentStatus } from "@/types/cms";

export type PostActionState = {
  error?: string;
  warnings?: string[];
  id?: string;
  deployTriggered?: boolean;
  deployment?: DeploymentStatus | null;
};

function parseTagsInput(raw: string): string[] {
  if (!raw.trim()) return [];
  if (raw.trim().startsWith("[")) {
    return parsePostTags(raw);
  }
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function buildPostPayload(formData: FormData, existingId?: string) {
  const parsed = postFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    contentMarkdown: formData.get("contentMarkdown"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    ogTitle: formData.get("ogTitle"),
    ogDescription: formData.get("ogDescription"),
    coverImage: formData.get("coverImage"),
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  const values = parsed.data;
  if (formData.get("intent") === "draft") {
    values.status = "draft";
  } else if (formData.get("intent") === "publish") {
    values.status = "published";
  }

  const slug = values.slug.trim() || slugifyTitle(values.title);

  if (await isSlugTakenForAdmin(slug, existingId)) {
    return { error: "Slug is already in use." };
  }

  const warnings = getPostValidationWarnings(values);
  const warningMessages = [
    warnings.seoTitle,
    warnings.seoDescription,
  ].filter(Boolean) as string[];

  const now = new Date().toISOString();
  const publishedAt =
    values.status === "published"
      ? values.publishedAt || now
      : values.publishedAt || null;

  return {
    values: {
      title: values.title.trim(),
      slug,
      excerpt: values.excerpt.trim(),
      contentMarkdown: values.contentMarkdown,
      category: values.category.trim(),
      tags: serializePostTags(parseTagsInput(values.tags)),
      status: values.status,
      seoTitle: values.seoTitle.trim() || null,
      seoDescription: values.seoDescription.trim() || null,
      ogTitle: values.ogTitle.trim() || null,
      ogDescription: values.ogDescription.trim() || null,
      coverImage: values.coverImage.trim() || null,
      publishedAt,
      updatedAt: now,
    },
    warnings: warningMessages,
  };
}

export async function savePostAction(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  await requireAdmin();

  const postId = formData.get("id");
  const payload = await buildPostPayload(
    formData,
    typeof postId === "string" ? postId : undefined
  );

  if ("error" in payload && payload.error) {
    return { error: payload.error };
  }

  if (!payload.values) {
    return { error: "Invalid form data" };
  }

  const now = new Date().toISOString();

  try {
    if (typeof postId === "string" && postId) {
      const result = await updatePostForAdmin(postId, payload.values);
      revalidatePath("/admin/posts");
      revalidatePath(`/admin/posts/${postId}`);
      revalidatePath("/blog");
      revalidatePath(`/blog/${payload.values.slug}`);
      return {
        id: postId,
        warnings: payload.warnings,
        deployTriggered: result.deployTriggered,
        deployment: result.deployment,
      };
    }

    const id = randomUUID();
    await createPostForAdmin({
      id,
      ...payload.values,
      createdAt: now,
    });

    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    redirect(`/admin/posts/${id}?deploy=1`);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to save post to GitHub.",
    };
  }

  return { error: "Unexpected save failure" };
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Missing post id");
  }

  try {
    await deletePostForAdmin(id);
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    redirect("/admin/posts");
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to delete post");
  }
}
