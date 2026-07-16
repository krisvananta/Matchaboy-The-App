import { SaleLogEntry } from "@/app/actions";
import { formatRupiah } from "@/lib/utils";

interface Props {
  logs: SaleLogEntry[];
}

/** Group rows that share the exact same soldAt ISO string → one transaction */
function groupByTransaction(logs: SaleLogEntry[]) {
  const map = new Map<string, SaleLogEntry[]>();
  for (const row of logs) {
    const existing = map.get(row.soldAt) ?? [];
    existing.push(row);
    map.set(row.soldAt, existing);
  }
  // Return newest-first (already sorted from the DB)
  return Array.from(map.entries()).map(([soldAt, items]) => ({
    soldAt,
    items,
    total: items.reduce((sum, i) => sum + i.totalPrice, 0),
  }));
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function LogsList({ logs }: Props) {
  const transactions = groupByTransaction(logs);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <span className="text-5xl mb-4">📋</span>
        <p className="text-white font-semibold text-base mb-1">
          Belum ada log
        </p>
        <p className="text-dark-muted text-sm max-w-xs">
          Tidak ada transaksi yang tercatat untuk tanggal ini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map(({ soldAt, items, total }, txIdx) => (
        <div
          key={soldAt}
          className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
        >
          {/* Transaction header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-dark-surface/60 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-matcha-400" />
              <span className="text-matcha-300 text-xs font-semibold tracking-wide">
                Transaksi #{transactions.length - txIdx}
              </span>
            </div>
            <span className="text-dark-muted text-xs font-mono">
              {formatTime(soldAt)}
            </span>
          </div>

          {/* Items */}
          <div className="px-4 py-1 divide-y divide-dark-border/50">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2.5">
                {/* Qty badge */}
                <div className="w-7 h-7 rounded-lg bg-matcha-500/15 border border-matcha-500/20 flex items-center justify-center shrink-0">
                  <span className="text-matcha-400 text-xs font-bold">
                    ×{item.quantity}
                  </span>
                </div>
                {/* Name */}
                <span className="text-white text-sm flex-1">
                  {item.menuItemName}
                </span>
                {/* Subtotal */}
                <span className="text-dark-muted text-xs font-medium">
                  {formatRupiah(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Transaction total */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-dark-surface/40 border-t border-dark-border">
            <span className="text-dark-muted text-xs">Total</span>
            <span className="text-matcha-400 text-sm font-bold">
              {formatRupiah(total)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
