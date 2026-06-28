import { baseGuides } from "@/data/guide-records";
import { getBundledCmsGuides } from "@/lib/cms/content-files";
import type { CmsGuide } from "@/types/cms";
import type { Guide, GuideFaq, GuideSection } from "@/types/guides";

export type PublicGuide = Guide & {
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  coverImage?: string | null;
  relatedCompareSlugs?: string[];
  markdownBody?: string | null;
  lastReviewed?: string | null;
};

function cmsGuideToPublicGuide(cms: CmsGuide, base?: Guide): PublicGuide {
  return {
    id: cms.id,
    slug: cms.slug,
    title: cms.title,
    excerpt: cms.excerpt,
    summaryBox: cms.summaryBox || base?.summaryBox || "",
    keyTakeaways:
      cms.keyTakeaways.length > 0 ? cms.keyTakeaways : (base?.keyTakeaways ?? []),
    category: cms.category,
    targetAudience: cms.targetAudience,
    relatedCountrySlugs: cms.relatedCountrySlugs,
    relatedVisaSlugs: cms.relatedVisaSlugs,
    readingTime: cms.readingTime || base?.readingTime || 5,
    datePublished: cms.datePublished || base?.datePublished || cms.publishedAt || "",
    dateModified: cms.dateModified || cms.lastUpdated || base?.dateModified || "",
    lastUpdated: cms.lastUpdated || cms.dateModified || base?.lastUpdated || "",
    verificationStatus: cms.verificationStatus || base?.verificationStatus || "in-progress",
    sections: cms.sections.length > 0 ? cms.sections : (base?.sections ?? []),
    faqs: cms.faqs.length > 0 ? cms.faqs : (base?.faqs ?? []),
    seoTitle: cms.seoTitle,
    seoDescription: cms.seoDescription,
    ogTitle: cms.ogTitle,
    ogDescription: cms.ogDescription,
    coverImage: cms.coverImage,
    relatedCompareSlugs: cms.relatedCompareSlugs,
    markdownBody: cms.markdownBody,
    lastReviewed: cms.lastReviewed,
  };
}

export function cmsGuideFromBase(base: Guide): CmsGuide {
  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    excerpt: base.excerpt,
    summaryBox: base.summaryBox,
    keyTakeaways: base.keyTakeaways,
    category: base.category,
    targetAudience: base.targetAudience,
    status: "published",
    readingTime: base.readingTime,
    seoTitle: null,
    seoDescription: null,
    ogTitle: null,
    ogDescription: null,
    coverImage: null,
    relatedCountrySlugs: base.relatedCountrySlugs,
    relatedVisaSlugs: base.relatedVisaSlugs,
    relatedCompareSlugs: [],
    markdownBody: null,
    sections: base.sections,
    faqs: base.faqs,
    datePublished: base.datePublished,
    dateModified: base.dateModified,
    lastUpdated: base.lastUpdated,
    lastReviewed: null,
    verificationStatus: base.verificationStatus,
    publishedAt: base.datePublished,
    updatedAt: base.lastUpdated,
    createdAt: base.datePublished,
  };
}

function findCmsForBase(
  base: Guide,
  cmsById: Map<string, CmsGuide>,
  cmsBySlug: Map<string, CmsGuide>
): CmsGuide | undefined {
  return cmsById.get(base.id) ?? cmsBySlug.get(base.slug);
}

export function getPublishedMergedGuides(): PublicGuide[] {
  const cmsGuides = getBundledCmsGuides();
  const cmsBySlug = new Map(cmsGuides.map((guide) => [guide.slug, guide]));
  const cmsById = new Map(cmsGuides.map((guide) => [guide.id, guide]));
  const result: PublicGuide[] = [];
  const seenSlugs = new Set<string>();

  for (const base of baseGuides) {
    const cms = findCmsForBase(base, cmsById, cmsBySlug);
    if (cms) {
      if (cms.status !== "published") {
        continue;
      }
      result.push(cmsGuideToPublicGuide(cms, base));
    } else {
      result.push(base);
    }
    seenSlugs.add(base.slug);
  }

  for (const cms of cmsGuides) {
    if (!seenSlugs.has(cms.slug) && cms.status === "published") {
      result.push(cmsGuideToPublicGuide(cms));
    }
  }

  return result;
}

export function getPublishedGuideBySlug(slug: string): PublicGuide | undefined {
  return getPublishedMergedGuides().find((guide) => guide.slug === slug);
}

export function mergeGuidesForAdmin(cmsGuides: CmsGuide[]): CmsGuide[] {
  const cmsBySlug = new Map(cmsGuides.map((guide) => [guide.slug, guide]));
  const cmsById = new Map(cmsGuides.map((guide) => [guide.id, guide]));
  const result: CmsGuide[] = [];
  const seen = new Set<string>();

  for (const base of baseGuides) {
    const cms = findCmsForBase(base, cmsById, cmsBySlug);
    result.push(cms ?? cmsGuideFromBase(base));
    seen.add(base.slug);
    seen.add(base.id);
  }

  for (const cms of cmsGuides) {
    if (!seen.has(cms.slug) && !seen.has(cms.id)) {
      result.push(cms);
    }
  }

  return result.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getAdminGuideById(
  id: string,
  cmsGuides: CmsGuide[]
): CmsGuide | undefined {
  const cms = cmsGuides.find((guide) => guide.id === id);
  if (cms) {
    return cms;
  }

  const base = baseGuides.find((guide) => guide.id === id);
  return base ? cmsGuideFromBase(base) : undefined;
}

export function isGuideSlugTaken(
  slug: string,
  cmsGuides: CmsGuide[],
  excludeId?: string
): boolean {
  const merged = mergeGuidesForAdmin(cmsGuides);
  const existing = merged.find((guide) => guide.slug === slug);
  if (!existing) {
    return false;
  }
  if (excludeId && existing.id === excludeId) {
    return false;
  }
  return true;
}

export function countMergedGuidesByStatus(
  cmsGuides: CmsGuide[],
  status: "draft" | "published"
): number {
  return mergeGuidesForAdmin(cmsGuides).filter((guide) => guide.status === status)
    .length;
}

export function getLastGuideUpdate(cmsGuides: CmsGuide[]): string | null {
  const merged = mergeGuidesForAdmin(cmsGuides);
  if (merged.length === 0) {
    return null;
  }
  return merged.reduce((latest, guide) => {
    const guideTime = new Date(guide.updatedAt).getTime();
    return guideTime > latest ? guideTime : latest;
  }, 0) > 0
    ? new Date(
        merged.reduce((latest, guide) => {
          const guideTime = new Date(guide.updatedAt).getTime();
          return guideTime > latest ? guideTime : latest;
        }, 0)
      ).toISOString()
    : null;
}

export function parseGuideSections(raw: string): GuideSection[] {
  if (!raw.trim()) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed as GuideSection[];
    }
  } catch {
    // fall through
  }
  return [];
}

export function parseGuideFaqs(raw: string): GuideFaq[] {
  if (!raw.trim()) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed as GuideFaq[];
    }
  } catch {
    // fall through
  }
  return [];
}

export function parseSlugList(raw: string): string[] {
  return raw
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
}
