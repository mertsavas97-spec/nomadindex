import { baseGuides } from "@/data/guide-records";
import {
  getPublishedGuideBySlug,
  getPublishedMergedGuides,
} from "@/lib/guides/resolve";
import type { Guide, GuideCategory } from "@/types/guides";

export { baseGuides };
export const guides = baseGuides;

export function getAllGuides(): Guide[] {
  return getPublishedMergedGuides();
}

export function getLatestGuides(limit = 4): Guide[] {
  return [...getPublishedMergedGuides()]
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified))
    .slice(0, limit);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getPublishedGuideBySlug(slug);
}

export function getGuidesForCountry(countrySlug: string): Guide[] {
  return getPublishedMergedGuides().filter((guide) =>
    guide.relatedCountrySlugs.includes(countrySlug)
  );
}

export function getGuidesForVisa(visaSlug: string): Guide[] {
  return getPublishedMergedGuides().filter((guide) =>
    guide.relatedVisaSlugs.includes(visaSlug)
  );
}

export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return getPublishedMergedGuides().filter((guide) => guide.category === category);
}

export function getRelatedGuides(currentSlug: string, limit = 4): Guide[] {
  const current = getGuideBySlug(currentSlug);
  if (!current) {
    return [];
  }

  const allGuides = getPublishedMergedGuides();

  return allGuides
    .filter((guide) => guide.slug !== currentSlug)
    .map((guide) => {
      let score = 0;
      if (guide.category === current.category) {
        score += 2;
      }
      if (guide.targetAudience === current.targetAudience) {
        score += 1;
      }
      for (const countrySlug of current.relatedCountrySlugs) {
        if (guide.relatedCountrySlugs.includes(countrySlug)) {
          score += 3;
        }
      }
      for (const visaSlug of current.relatedVisaSlugs) {
        if (guide.relatedVisaSlugs.includes(visaSlug)) {
          score += 2;
        }
      }
      return { guide, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score || a.guide.title.localeCompare(b.guide.title)
    )
    .slice(0, limit)
    .map(({ guide }) => guide);
}
