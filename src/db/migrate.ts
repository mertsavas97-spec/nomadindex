import type Database from "better-sqlite3";

export function runMigrations(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL DEFAULT '',
      content_markdown TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general',
      tags TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      seo_title TEXT,
      seo_description TEXT,
      og_title TEXT,
      og_description TEXT,
      cover_image TEXT,
      published_at TEXT,
      updated_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL
    );
  `);
}
