"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { todayLocal, formatDate } from "@/lib/utils";

export default function DateFilter() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const today        = todayLocal();
  const selected     = searchParams.get("date") ?? today;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    router.push(`/dashboard?date=${date}`);
  };

  const goToday = () => {
    router.push(`/dashboard?date=${today}`);
  };

  return (
    <div className="px-4 py-3">
      <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="date-filter" className="text-dark-muted text-xs font-medium uppercase tracking-wider">
            Filter Tanggal
          </label>
          {selected !== today && (
            <button
              onClick={goToday}
              className="text-xs text-matcha-400 font-semibold hover:text-matcha-300 transition-colors"
            >
              Hari ini
            </button>
          )}
        </div>

        <input
          id="date-filter"
          type="date"
          value={selected}
          max={today}
          onChange={handleChange}
          className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white text-base
            focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500/50
            transition-all duration-200 cursor-pointer"
          style={{ fontSize: "16px" }} /* prevent iOS zoom */
        />

        <p className="mt-2 text-dark-muted text-sm">
          {formatDate(selected)}
        </p>
      </div>
    </div>
  );
}
