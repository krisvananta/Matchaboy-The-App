"use client";

import { useState, useCallback, useTransition } from "react";
import { logSale } from "@/app/actions";
import MenuItemCard from "@/components/MenuItemCard";
import { formatRupiah } from "@/lib/utils";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface SaleFormProps {
  menuItems: MenuItem[];
}

type ToastType = "success" | "error";

export default function SaleForm({ menuItems }: SaleFormProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>(() =>
    Object.fromEntries(menuItems.map((m) => [m.id, 0]))
  );
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isPending, startTransition] = useTransition();

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleIncrement = useCallback((id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const handleDecrement = useCallback((id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) - 1) }));
  }, []);

  const totalItems   = Object.values(quantities).reduce((s, q) => s + q, 0);
  const totalRevenue = menuItems.reduce(
    (sum, m) => sum + m.price * (quantities[m.id] ?? 0),
    0
  );

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePaymentSelection = (method: "Cash" | "QRIS") => {
    const items = menuItems
      .filter((m) => (quantities[m.id] ?? 0) > 0)
      .map((m) => ({ menuItemId: m.id, quantity: quantities[m.id] }));

    if (items.length === 0) return;

    setShowPaymentModal(false);

    startTransition(async () => {
      const result = await logSale(items, method);
      if (result.success) {
        // Reset quantities
        setQuantities(Object.fromEntries(menuItems.map((m) => [m.id, 0])));
        showToast(`✅ Sale logged! ${formatRupiah(totalRevenue)}`, "success");
      } else {
        showToast("❌ Failed to log sale. Try again.", "error");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-full relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl transition-all duration-300
            max-w-xs w-full text-center
            ${toast.type === "success"
              ? "bg-matcha-500 text-white"
              : "bg-red-500 text-white"
            }`}
          style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
        >
          {toast.message}
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-36">
        {menuItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            quantity={quantities[item.id] ?? 0}
            onIncrement={() => handleIncrement(item.id)}
            onDecrement={() => handleDecrement(item.id)}
          />
        ))}
      </div>

      {/* Order Summary + Submit */}
      <div
        className="sticky left-0 right-0 z-40 px-4 pt-3 pb-3 bg-dark-base/95 backdrop-blur-xl border-t border-dark-border/80 shadow-2xl transition-all"
        style={{ bottom: "calc(68px + env(safe-area-inset-bottom, 0px))" }}
      >
        {totalItems > 0 && (
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-dark-muted text-sm">
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </span>
            <span className="text-matcha-400 font-bold text-lg">
              {formatRupiah(totalRevenue)}
            </span>
          </div>
        )}

        <button
          onClick={() => setShowPaymentModal(true)}
          disabled={totalItems === 0 || isPending}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98]
            ${
              totalItems === 0
                ? "bg-dark-card text-dark-muted cursor-not-allowed border border-dark-border"
                : isPending
                ? "bg-matcha-600 text-white/60 cursor-wait"
                : "bg-matcha-500 text-white shadow-lg shadow-matcha-500/30 hover:bg-matcha-400"
            }`}
        >
          {isPending ? "Logging…" : totalItems === 0 ? "Select items to log" : "Pilih Pembayaran"}
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          onPointerDown={() => setShowPaymentModal(false)}
          onClick={() => setShowPaymentModal(false)}
        >
          <div 
            className="bg-dark-card border border-dark-border w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 cursor-default"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Metode Pembayaran</h2>
              <p className="text-dark-muted text-sm">Pilih jenis pembayaran untuk {totalItems} item ({formatRupiah(totalRevenue)})</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handlePaymentSelection("Cash")}
                className="w-full py-4 rounded-2xl font-bold text-base bg-amber-500/10 text-amber-500 border border-amber-500/20 transition-all active:scale-95 hover:bg-amber-500/20"
              >
                💵 Tunai / Cash
              </button>
              <button
                onClick={() => handlePaymentSelection("QRIS")}
                className="w-full py-4 rounded-2xl font-bold text-base bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 transition-all active:scale-95 hover:bg-emerald-500/20"
              >
                📱 QRIS
              </button>
            </div>
            
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full mt-4 py-3 rounded-2xl font-bold text-sm text-dark-muted transition-all active:scale-95 hover:bg-dark-surface"
            >
              Batal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
