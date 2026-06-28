import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  contentMarkdown: text("content_markdown").notNull().default(""),
  category: text("category").notNull().default("general"),
  tags: text("tags").notNull().default("[]"),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  coverImage: text("cover_image"),
  publishedAt: text("published_at"),
  updatedAt: text("updated_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: text("updated_at").notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Setting = typeof settings.$inferSelect;
