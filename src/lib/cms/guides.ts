import type { CmsGuide } from "@/types/cms";
import {
  getPublicCmsGuides,
  loadGuidesForAdmin,
  saveGuidesDocument,
} from "@/lib/cms/persist";
import {
  getAdminGuideById,
  isGuideSlugTaken,
  mergeGuidesForAdmin,
} from "@/lib/guides/resolve";

export type Guide = CmsGuide;

function sortByUpdatedDesc(guides: CmsGuide[]) {
  return [...guides].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getAllCmsGuides(): CmsGuide[] {
  return getPublicCmsGuides();
}

export function countGuidesByStatus(status: "draft" | "published"): number {
  return mergeGuidesForAdmin(getPublicCmsGuides()).filter(
    (guide) => guide.status === status
  ).length;
}

export async function getAllGuidesForAdmin(): Promise<CmsGuide[]> {
  return mergeGuidesForAdmin(await loadGuidesForAdmin());
}

export async function getGuideByIdForAdmin(id: string): Promise<CmsGuide | undefined> {
  return getAdminGuideById(id, await loadGuidesForAdmin());
}

export async function searchGuidesForAdmin(
  query: string,
  status?: "draft" | "published"
): Promise<CmsGuide[]> {
  const pattern = query.trim().toLowerCase();
  const guides = await getAllGuidesForAdmin();

  return guides.filter((guide) => {
    if (status && guide.status !== status) {
      return false;
    }
    if (!pattern) {
      return true;
    }

    return (
      guide.title.toLowerCase().includes(pattern) ||
      guide.slug.toLowerCase().includes(pattern) ||
      guide.excerpt.toLowerCase().includes(pattern)
    );
  });
}

export async function getGuidesByStatusForAdmin(
  status: "draft" | "published"
): Promise<CmsGuide[]> {
  return sortByUpdatedDesc(
    (await getAllGuidesForAdmin()).filter((guide) => guide.status === status)
  );
}

export async function isSlugTakenForAdmin(slug: string, excludeId?: string) {
  return isGuideSlugTaken(slug, await loadGuidesForAdmin(), excludeId);
}

async function persistGuidesForAdmin(guides: CmsGuide[], message: string) {
  return saveGuidesDocument(guides, message);
}

export async function createGuideForAdmin(data: CmsGuide) {
  const guides = await loadGuidesForAdmin();
  guides.push(data);
  return persistGuidesForAdmin(guides, `cms: create guide ${data.slug}`);
}

export async function updateGuideForAdmin(id: string, data: Partial<CmsGuide>) {
  const stored = await loadGuidesForAdmin();
  const index = stored.findIndex((guide) => guide.id === id);

  if (index === -1) {
    const merged = await getGuideByIdForAdmin(id);
    if (!merged) {
      throw new Error("Guide not found");
    }
    stored.push({ ...merged, ...data, id });
    return persistGuidesForAdmin(stored, `cms: update guide ${data.slug ?? merged.slug}`);
  }

  stored[index] = { ...stored[index], ...data };
  return persistGuidesForAdmin(
    stored,
    `cms: update guide ${stored[index].slug}`
  );
}

export async function deleteGuideOverrideForAdmin(id: string) {
  const stored = await loadGuidesForAdmin();
  const guide = stored.find((entry) => entry.id === id);
  if (!guide) {
    throw new Error("Guide CMS override not found");
  }

  const nextGuides = stored.filter((entry) => entry.id !== id);
  return persistGuidesForAdmin(nextGuides, `cms: remove guide override ${guide.slug}`);
}

export async function getLastGuideUpdateForAdmin(): Promise<string | null> {
  const guides = await getAllGuidesForAdmin();
  if (guides.length === 0) {
    return null;
  }
  return guides.reduce((latest, guide) => {
    const guideTime = new Date(guide.updatedAt).getTime();
    return guideTime > latest ? guideTime : latest;
  }, 0) > 0
    ? new Date(
        guides.reduce((latest, guide) => {
          const guideTime = new Date(guide.updatedAt).getTime();
          return guideTime > latest ? guideTime : latest;
        }, 0)
      ).toISOString()
    : null;
}
