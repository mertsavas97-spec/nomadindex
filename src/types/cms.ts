export type PostStatus = "draft" | "published";

export type CmsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  category: string;
  tags: string;
  status: PostStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
};

export type NewCmsPost = Omit<CmsPost, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PostsDocument = {
  posts: CmsPost[];
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

export const CMS_CONTENT_PATHS = {
  posts: "content/cms/posts.json",
  settings: "content/cms/settings.json",
} as const;
