import { Suspense } from "react";
import { getDashboardData } from "@/app/actions";
import SalesSummaryCard from "@/components/SalesSummaryCard";
import DateFilter from "@/components/DateFilter";
import { formatRupiah, todayLocal, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const date   = params.date ?? todayLocal();
  const data   = await getDashboardData(date);

  const hasSales = data.totalItemsSold > 0;

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <header className="px-4 pt-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            📊 Dashboard
          </h1>
          <p className="text-dark-muted text-sm mt-0.5">
            Rekap penjualan harian
          </p>
        </div>
      </header>

      {/* Date Filter (Client Component) */}
      <Suspense fallback={null}>
        <DateFilter />
      </Suspense>

      {/* Revenue Hero Card */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-matcha-600/30 via-matcha-700/20 to-dark-card border border-matcha-600/30 rounded-3xl p-5">
          <p className="text-matcha-300 text-xs font-semibold uppercase tracking-widest mb-1">
            Total Pendapatan
          </p>
          <p className="text-4xl font-extrabold text-white tracking-tight">
            {formatRupiah(data.totalRevenue)}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 bg-dark-base/40 rounded-full px-3 py-1">
              <span className="text-matcha-400 text-xs font-medium">
                {data.totalItemsSold} cup terjual
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-dark-base/40 rounded-full px-3 py-1">
              <span className="text-dark-muted text-xs">
                {formatDate(date)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Breakdown */}
      <div className="px-4">
        <p className="text-dark-muted text-xs font-semibold uppercase tracking-widest mb-3 px-1">
          Rincian Menu
        </p>

        {hasSales ? (
          <div className="flex flex-col gap-2">
            {data.items.map((item) => (
              <SalesSummaryCard
                key={item.id}
                name={item.name}
                quantity={item.quantity}
                subtotal={item.subtotal}
                price={item.price}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <span className="text-5xl mb-4">🍵</span>
            <p className="text-white font-semibold text-base mb-1">
              Belum ada penjualan
            </p>
            <p className="text-dark-muted text-sm max-w-xs">
              Tidak ada data penjualan untuk{" "}
              <span className="text-matcha-400">{formatDate(date)}</span>.
              Coba pilih tanggal lain atau mulai log penjualan!
            </p>
          </div>
        )}

        {/* Sold items ranked — only if there are sales */}
        {hasSales && (
          <div className="mt-4 bg-dark-card border border-dark-border rounded-2xl p-4">
            <p className="text-dark-muted text-xs font-semibold uppercase tracking-widest mb-3">
              Top Produk
            </p>
            {[...data.items]
              .filter((i) => i.quantity > 0)
              .sort((a, b) => b.quantity - a.quantity)
              .slice(0, 3)
              .map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 mb-2 last:mb-0">
                  <span className="text-matcha-500 font-bold text-sm w-5">
                    #{idx + 1}
                  </span>
                  <span className="text-white text-sm flex-1">{item.name}</span>
                  <span className="text-matcha-400 font-bold text-sm">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
