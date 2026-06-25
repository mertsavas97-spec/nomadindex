import type { VerificationStatus } from "@/types/nomadindex";

export type GuideCategory =
  | "overview"
  | "startup"
  | "comparison"
  | "visa-playbook"
  | "planning";

export type GuideAudience =
  | "remote-workers"
  | "freelancers"
  | "founders"
  | "all";

export type GuideSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type Guide = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  summaryBox: string;
  keyTakeaways: string[];
  category: GuideCategory;
  targetAudience: GuideAudience;
  relatedCountrySlugs: string[];
  relatedVisaSlugs: string[];
  readingTime: number;
  datePublished: string;
  dateModified: string;
  lastUpdated: string;
  verificationStatus: VerificationStatus;
  sections: GuideSection[];
  faqs: GuideFaq[];
};
