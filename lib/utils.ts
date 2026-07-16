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
