import { Suspense } from "react";
import { getSaleLogs } from "@/app/actions";
import DateFilter from "@/components/DateFilter";
import LogsList from "@/components/LogsList";
import { todayLocal, formatDate, formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function LogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const date   = params.date ?? todayLocal();
  const logs   = await getSaleLogs(date);

  const totalRevenue    = logs.reduce((sum, l) => sum + l.totalPrice, 0);
  const totalTransactions = new Set(logs.map((l) => l.soldAt)).size;

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <header className="px-4 pt-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            📋 Log Penjualan
          </h1>
          <p className="text-dark-muted text-sm mt-0.5">
            Riwayat setiap transaksi
          </p>
        </div>
      </header>

      {/* Date Filter */}
      <Suspense fallback={null}>
        <DateFilter />
      </Suspense>

      {/* Summary strip */}
      {logs.length > 0 && (
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-br from-matcha-600/20 via-matcha-700/10 to-dark-card border border-matcha-600/20 rounded-2xl px-4 py-3 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-dark-muted text-[10px] font-semibold uppercase tracking-widest mb-0.5">
                Pendapatan
              </p>
              <p className="text-white font-extrabold text-lg leading-tight">
                {formatRupiah(totalRevenue)}
              </p>
            </div>
            <div className="w-px h-8 bg-dark-border" />
            <div className="flex-1">
              <p className="text-dark-muted text-[10px] font-semibold uppercase tracking-widest mb-0.5">
                Transaksi
              </p>
              <p className="text-white font-extrabold text-lg leading-tight">
                {totalTransactions}×
              </p>
            </div>
            <div className="w-px h-8 bg-dark-border" />
            <div className="flex-1">
              <p className="text-dark-muted text-[10px] font-semibold uppercase tracking-widest mb-0.5">
                Tanggal
              </p>
              <p className="text-matcha-300 font-semibold text-xs leading-tight">
                {formatDate(date)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logs list */}
      <div className="px-4">
        <p className="text-dark-muted text-xs font-semibold uppercase tracking-widest mb-3 px-1">
          Detail Transaksi
        </p>
        <LogsList logs={logs} />
      </div>
    </div>
  );
}
