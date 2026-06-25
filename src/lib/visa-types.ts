import type { VisaType } from "@/types/nomadindex";

export const VISA_TYPE_LABELS: Record<VisaType, string> = {
  "digital-nomad": "Digital Nomad",
  freelancer: "Freelancer",
  startup: "Startup",
  investor: "Investor",
  "passive-income": "Passive Income",
  work: "Work",
  residency: "Residency",
  other: "Other",
};

export const VISA_TYPE_OPTIONS: { value: VisaType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "digital-nomad", label: "Digital Nomad" },
  { value: "freelancer", label: "Freelancer" },
  { value: "startup", label: "Startup" },
  { value: "investor", label: "Investor" },
  { value: "passive-income", label: "Passive Income" },
  { value: "work", label: "Work" },
  { value: "residency", label: "Residency" },
];

export const REGION_OPTIONS = [
  "All regions",
  "Europe",
  "Middle East",
  "Asia",
  "North America",
  "Oceania",
] as const;

export type SortOption = "name" | "citizenship" | "programs";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name", label: "Country name" },
  { value: "citizenship", label: "Citizenship path" },
  { value: "programs", label: "Visa programs" },
];

export type VisaSortOption =
  | "name"
  | "min-income"
  | "processing-time"
  | "application-fee";

export const VISA_SORT_OPTIONS: { value: VisaSortOption; label: string }[] = [
  { value: "name", label: "Program name" },
  { value: "min-income", label: "Minimum income" },
  { value: "processing-time", label: "Processing time" },
  { value: "application-fee", label: "Application fee" },
];

export const VERIFICATION_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "verified", label: "Verified" },
  { value: "in-progress", label: "Source review" },
  { value: "placeholder", label: "Estimate" },
] as const;

export type VerificationFilter =
  (typeof VERIFICATION_FILTER_OPTIONS)[number]["value"];

export const REQUIREMENT_LEVEL_LABELS = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  "very-high": "Very high",
} as const;

export function parseProcessingDays(processingTime: string | null): number {
  if (!processingTime) {
    return Number.POSITIVE_INFINITY;
  }

  const match = processingTime.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
}
