/**
 * Format a number as Indonesian Rupiah.
 * e.g. 23000 → "Rp 23.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get today's date as YYYY-MM-DD in local time (Jakarta / WIB UTC+7).
 */
export function todayLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Get current timestamp as an ISO string preserving local timezone offset.
 * e.g. "2026-07-17T00:01:23.456+07:00"
 * This ensures SQLite LIKE 'YYYY-MM-DD%' matches exact local calendar dates.
 */
export function nowLocalISO(): string {
  const now = new Date();
  const pad = (n: number, digits = 2) => String(n).padStart(digits, "0");
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const ms = pad(now.getMilliseconds(), 3);

  const offsetMinutes = -now.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMins = pad(absOffset % 60);

  return `${y}-${m}-${d}T${hh}:${mm}:${ss}.${ms}${sign}${offsetHours}:${offsetMins}`;
}

/**
 * Format YYYY-MM-DD as a human-readable date.
 * e.g. "2024-01-15" → "Senin, 15 Jan 2024"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
