import type { GuideAudience, GuideCategory } from "@/types/guides";

export type GuideCategoryFilter = GuideCategory | "any";
export type GuideAudienceFilter = GuideAudience | "any";

export const GUIDE_CATEGORY_OPTIONS: {
  value: GuideCategoryFilter;
  label: string;
}[] = [
  { value: "any", label: "All categories" },
  { value: "overview", label: "Regional overviews" },
  { value: "startup", label: "Startup & founders" },
  { value: "comparison", label: "Country comparisons" },
  { value: "visa-playbook", label: "Visa playbooks" },
  { value: "planning", label: "Planning guides" },
];

export const GUIDE_AUDIENCE_OPTIONS: {
  value: GuideAudienceFilter;
  label: string;
}[] = [
  { value: "any", label: "All audiences" },
  { value: "remote-workers", label: "Remote workers" },
  { value: "freelancers", label: "Freelancers" },
  { value: "founders", label: "Founders" },
  { value: "all", label: "General audience" },
];

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  overview: "Regional overview",
  startup: "Startup & founders",
  comparison: "Country comparison",
  "visa-playbook": "Visa playbook",
  planning: "Planning guide",
};

export const GUIDE_AUDIENCE_LABELS: Record<GuideAudience, string> = {
  "remote-workers": "Remote workers",
  freelancers: "Freelancers",
  founders: "Founders",
  all: "General",
};

export function matchesGuideAudience(
  targetAudience: GuideAudience,
  filter: GuideAudienceFilter
): boolean {
  if (filter === "any") {
    return true;
  }

  if (filter === "all") {
    return targetAudience === "all";
  }

  return targetAudience === filter || targetAudience === "all";
}
