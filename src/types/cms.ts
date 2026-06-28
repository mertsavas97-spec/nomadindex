import type {
  GuideAudience,
  GuideCategory,
  GuideFaq,
  GuideSection,
} from "@/types/guides";
import type { VerificationStatus } from "@/types/nomadindex";

export type GuideStatus = "draft" | "published";

export type CmsGuide = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  summaryBox: string;
  keyTakeaways: string[];
  category: GuideCategory;
  targetAudience: GuideAudience;
  status: GuideStatus;
  readingTime: number;
  seoTitle: string | null;
  seoDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  coverImage: string | null;
  relatedCountrySlugs: string[];
  relatedVisaSlugs: string[];
  relatedCompareSlugs: string[];
  markdownBody: string | null;
  sections: GuideSection[];
  faqs: GuideFaq[];
  datePublished: string;
  dateModified: string;
  lastUpdated: string;
  lastReviewed: string | null;
  verificationStatus: VerificationStatus;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
};

export type NewCmsGuide = Omit<CmsGuide, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GuidesDocument = {
  guides: CmsGuide[];
};

export type SettingsDocument = {
  settings: Record<string, string>;
  updatedAt: string | null;
};

export type DeploymentState =
  | "QUEUED"
  | "BUILDING"
  | "READY"
  | "ERROR"
  | "CANCELED"
  | "UNKNOWN";

export type DeploymentStatus = {
  id: string;
  url: string | null;
  state: DeploymentState;
  createdAt: string;
  readyAt: string | null;
  commitMessage: string | null;
};

export type PublishCmsResult = {
  commitMessage: string;
  deployTriggered: boolean;
  deployment: DeploymentStatus | null;
  deploymentStatusWarning?: string;
};

export const CMS_CONTENT_PATHS = {
  guides: "content/cms/guides.json",
  settings: "content/cms/settings.json",
} as const;
