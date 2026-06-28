import { z } from "zod";

import type { GuideAudience, GuideCategory } from "@/types/guides";

const guideCategorySchema = z.enum([
  "overview",
  "startup",
  "comparison",
  "visa-playbook",
  "planning",
]);

const guideAudienceSchema = z.enum([
  "remote-workers",
  "freelancers",
  "founders",
  "all",
]);

export const guideFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  excerpt: z.string(),
  summaryBox: z.string(),
  keyTakeaways: z.string(),
  category: guideCategorySchema,
  targetAudience: guideAudienceSchema,
  relatedCountrySlugs: z.string(),
  relatedVisaSlugs: z.string(),
  relatedCompareSlugs: z.string(),
  markdownBody: z.string(),
  sectionsJson: z.string(),
  faqsJson: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  coverImage: z.string(),
  readingTime: z.string(),
  lastReviewed: z.string(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string(),
  datePublished: z.string(),
  dateModified: z.string(),
});

export type GuideFormValues = z.infer<typeof guideFormSchema>;

export type GuideValidationWarnings = {
  seoTitle?: string;
  seoDescription?: string;
};

const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 160;
const SEO_DESCRIPTION_MIN = 120;

export function getGuideValidationWarnings(
  values: Pick<GuideFormValues, "seoTitle" | "seoDescription" | "title" | "excerpt">
): GuideValidationWarnings {
  const warnings: GuideValidationWarnings = {};
  const seoTitle = values.seoTitle.trim() || values.title.trim();
  const seoDescription = values.seoDescription.trim() || values.excerpt.trim();

  if (seoTitle.length > SEO_TITLE_MAX) {
    warnings.seoTitle = `SEO title is ${seoTitle.length} characters (recommended ≤ ${SEO_TITLE_MAX}).`;
  }

  if (seoDescription.length > SEO_DESCRIPTION_MAX) {
    warnings.seoDescription = `Meta description is ${seoDescription.length} characters (recommended ≤ ${SEO_DESCRIPTION_MAX}).`;
  } else if (seoDescription.length > 0 && seoDescription.length < SEO_DESCRIPTION_MIN) {
    warnings.seoDescription = `Meta description is ${seoDescription.length} characters (recommended ${SEO_DESCRIPTION_MIN}–${SEO_DESCRIPTION_MAX}).`;
  }

  return warnings;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function estimateReadingTimeFromMarkdown(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function countWords(markdown: string): number {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  "overview",
  "startup",
  "comparison",
  "visa-playbook",
  "planning",
];

export const GUIDE_AUDIENCES: GuideAudience[] = [
  "remote-workers",
  "freelancers",
  "founders",
  "all",
];
