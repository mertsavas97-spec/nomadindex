import "server-only";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

import { runMigrations } from "@/db/migrate";
import * as schema from "@/db/schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDatabasePath() {
  return process.env.CMS_DATABASE_PATH ?? join(process.cwd(), "data", "cms.db");
}

export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = getDatabasePath();
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(dbPath);
  runMigrations(sqlite);
  dbInstance = drizzle(sqlite, { schema });
  return dbInstance;
}
