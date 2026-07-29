const Database = require("better-sqlite3");
const db = new Database("matchaboy.db");

try {
  db.prepare("ALTER TABLE sales ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'Cash'").run();
  console.log("Successfully added payment_method column to sales table.");
} catch (e) {
  console.error("Error modifying table:", e.message);
}
db.close();
