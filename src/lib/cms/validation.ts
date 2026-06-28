import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  excerpt: z.string(),
  category: z.string().min(1, "Category is required"),
  tags: z.string(),
  contentMarkdown: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  coverImage: z.string(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export type PostValidationWarnings = {
  seoTitle?: string;
  seoDescription?: string;
};

const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 160;
const SEO_DESCRIPTION_MIN = 120;

export function getPostValidationWarnings(
  values: Pick<PostFormValues, "seoTitle" | "seoDescription" | "title" | "excerpt">
): PostValidationWarnings {
  const warnings: PostValidationWarnings = {};
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
