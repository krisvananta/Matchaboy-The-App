import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "matchaboy.db");

const MENU_ITEMS = [
  { name: "Matcha OG",        price: 15000 },
  { name: "Strawberry Matcha", price: 23000 },
  { name: "Chocolate Matcha",  price: 23000 },
  { name: "Honey Matcha",      price: 18000 },
  { name: "Caramel Matcha",    price: 23000 },
  { name: "Coconut Matcha",    price: 23000 },
];

let initialized = false;

export function initializeDatabase() {
  // Idempotent — only runs once per process lifetime
  if (initialized) return;
  initialized = true;

  const sqlite = new Database(DB_PATH);

  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  // ── Create tables if they don't exist ──────────────────────────────────────
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT    NOT NULL,
      price INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
      quantity     INTEGER NOT NULL,
      total_price  INTEGER NOT NULL,
      sold_at      TEXT    NOT NULL
    );
  `);

  // ── Seed menu items only if the table is empty ─────────────────────────────
  const count = (sqlite.prepare("SELECT COUNT(*) as count FROM menu_items").get() as { count: number }).count;

  if (count === 0) {
    const insert = sqlite.prepare("INSERT INTO menu_items (name, price) VALUES (?, ?)");
    const seedAll = sqlite.transaction(() => {
      for (const item of MENU_ITEMS) {
        insert.run(item.name, item.price);
      }
    });
    seedAll();
    console.log("✅ Database seeded with menu items");
  }

  sqlite.close();
}
