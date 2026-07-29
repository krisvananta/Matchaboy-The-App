const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "matchaboy.db");
const db = new Database(dbPath);

console.log("Checking for UTC 'Z' timestamps in `sales` table...");
const rows = db.prepare("SELECT id, sold_at FROM sales WHERE sold_at LIKE '%Z'").all();

if (rows.length === 0) {
  console.log("No UTC timestamps found. Everything is already formatted in local time!");
  process.exit(0);
}

console.log(`Found ${rows.length} sales with UTC timestamps. Converting to local time...`);
const updateStmt = db.prepare("UPDATE sales SET sold_at = ? WHERE id = ?");

const pad = (n, digits = 2) => String(n).padStart(digits, "0");

for (const row of rows) {
  const dt = new Date(row.sold_at);
  const y = dt.getFullYear();
  const m = pad(dt.getMonth() + 1);
  const d = pad(dt.getDate());
  const hh = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  const ss = pad(dt.getSeconds());
  const ms = pad(dt.getMilliseconds(), 3);

  const offsetMinutes = -dt.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMins = pad(absOffset % 60);

  const localISO = `${y}-${m}-${d}T${hh}:${mm}:${ss}.${ms}${sign}${offsetHours}:${offsetMins}`;

  updateStmt.run(localISO, row.id);
  console.log(`Updated Sale #${row.id}: ${row.sold_at}  ──►  ${localISO}`);
}

console.log("\n✅ Successfully updated all existing sale timestamps!");
