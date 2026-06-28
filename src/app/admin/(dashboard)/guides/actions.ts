"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createGuideForAdmin,
  deleteGuideOverrideForAdmin,
  isSlugTakenForAdmin,
  updateGuideForAdmin,
} from "@/lib/cms/guides";
import { loadGuidesForAdmin } from "@/lib/cms/persist";
import {
  getGuideValidationWarnings,
  guideFormSchema,
  slugifyTitle,
} from "@/lib/cms/validation";
import {
  parseGuideFaqs,
  parseGuideSections,
  parseSlugList,
} from "@/lib/guides/resolve";
import { requireAdmin } from "@/lib/auth/session";
import type { DeploymentStatus } from "@/types/cms";

export type GuideActionState = {
  error?: string;
  warnings?: string[];
  id?: string;
  deployTriggered?: boolean;
  deployment?: DeploymentStatus | null;
  deploymentStatusWarning?: string;
  successMessage?: string;
};

async function buildGuidePayload(formData: FormData, existingId?: string) {
  const parsed = guideFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    summaryBox: formData.get("summaryBox"),
    keyTakeaways: formData.get("keyTakeaways"),
    category: formData.get("category"),
    targetAudience: formData.get("targetAudience"),
    relatedCountrySlugs: formData.get("relatedCountrySlugs"),
    relatedVisaSlugs: formData.get("relatedVisaSlugs"),
    relatedCompareSlugs: formData.get("relatedCompareSlugs"),
    markdownBody: formData.get("markdownBody"),
    sectionsJson: formData.get("sectionsJson"),
    faqsJson: formData.get("faqsJson"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    ogTitle: formData.get("ogTitle"),
    ogDescription: formData.get("ogDescription"),
    coverImage: formData.get("coverImage"),
    readingTime: formData.get("readingTime"),
    lastReviewed: formData.get("lastReviewed"),
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt"),
    datePublished: formData.get("datePublished"),
    dateModified: formData.get("dateModified"),
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

  const warnings = getGuideValidationWarnings(values);
  const warningMessages = [
    warnings.seoTitle,
    warnings.seoDescription,
  ].filter(Boolean) as string[];

  const now = new Date().toISOString();
  const publishedAt =
    values.status === "published"
      ? values.publishedAt || now
      : values.publishedAt || null;

  const keyTakeaways = values.keyTakeaways
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const readingTime = Number.parseInt(values.readingTime, 10) || 5;
  const markdownBody = values.markdownBody.trim() || null;

  return {
    values: {
      title: values.title.trim(),
      slug,
      excerpt: values.excerpt.trim(),
      summaryBox: values.summaryBox.trim(),
      keyTakeaways,
      category: values.category,
      targetAudience: values.targetAudience,
      relatedCountrySlugs: parseSlugList(values.relatedCountrySlugs),
      relatedVisaSlugs: parseSlugList(values.relatedVisaSlugs),
      relatedCompareSlugs: parseSlugList(values.relatedCompareSlugs),
      markdownBody,
      sections: parseGuideSections(values.sectionsJson),
      faqs: parseGuideFaqs(values.faqsJson),
      status: values.status,
      seoTitle: values.seoTitle.trim() || null,
      seoDescription: values.seoDescription.trim() || null,
      ogTitle: values.ogTitle.trim() || null,
      ogDescription: values.ogDescription.trim() || null,
      coverImage: values.coverImage.trim() || null,
      readingTime,
      lastReviewed: values.lastReviewed.trim() || null,
      datePublished: values.datePublished || publishedAt?.slice(0, 10) || now.slice(0, 10),
      dateModified: values.dateModified || now.slice(0, 10),
      lastUpdated: values.dateModified || now.slice(0, 10),
      verificationStatus: "in-progress" as const,
      publishedAt,
      updatedAt: now,
    },
    warnings: warningMessages,
  };
}

function buildSuccessMessage(deployTriggered: boolean) {
  return deployTriggered
    ? "Guide saved. Deployment triggered."
    : "Guide saved to GitHub.";
}

export async function saveGuideAction(
  _prevState: GuideActionState,
  formData: FormData
): Promise<GuideActionState> {
  await requireAdmin();

  const guideId = formData.get("id");
  const payload = await buildGuidePayload(
    formData,
    typeof guideId === "string" ? guideId : undefined
  );

  if ("error" in payload && payload.error) {
    return { error: payload.error };
  }

  if (!payload.values) {
    return { error: "Invalid form data" };
  }

  const now = new Date().toISOString();

  try {
    if (typeof guideId === "string" && guideId) {
      const result = await updateGuideForAdmin(guideId, payload.values);
      revalidatePath("/admin/guides");
      revalidatePath(`/admin/guides/${guideId}`);
      revalidatePath("/guides");
      revalidatePath(`/guides/${payload.values.slug}`);
      return {
        id: guideId,
        warnings: payload.warnings,
        deployTriggered: result.deployTriggered,
        deployment: result.deployment,
        deploymentStatusWarning: result.deploymentStatusWarning,
        successMessage: buildSuccessMessage(result.deployTriggered),
      };
    }

    const id = randomUUID();
    await createGuideForAdmin({
      id,
      ...payload.values,
      createdAt: now,
    });

    revalidatePath("/admin/guides");
    revalidatePath("/guides");
    redirect(`/admin/guides/${id}?deploy=1`);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to save guide to GitHub.",
    };
  }

  return { error: "Unexpected save failure" };
}

export async function deleteGuideAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Missing guide id");
  }

  try {
    await deleteGuideOverrideForAdmin(id);
    revalidatePath("/admin/guides");
    revalidatePath("/guides");
    redirect("/admin/guides");
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to remove guide override");
  }
}

export async function isGuideBaseOnly(id: string) {
  const stored = await loadGuidesForAdmin();
  return !stored.some((guide) => guide.id === id);
}
