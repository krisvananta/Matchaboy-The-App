import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import * as schema from "./schema";

// ─── Singleton pattern — reuse across hot reloads in dev ──────────────────────
const DB_PATH = path.join(process.cwd(), "matchaboy.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof drizzle> | undefined;
}

function createDb() {
  const sqlite = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  return drizzle(sqlite, { schema });
}

export const db = global.__db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  global.__db = db;
}
