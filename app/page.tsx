import { getMenuItems } from "@/app/actions";
import SaleForm from "@/components/SaleForm";

export const dynamic = "force-dynamic";

export default async function CounterPage() {
  const menuItems = await getMenuItems();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="px-4 pt-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            🍵 Matchaboy
          </h1>
          <p className="text-dark-muted text-sm mt-0.5">
            Tap items, then log the sale
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-matcha-500/20 border border-matcha-500/30 flex items-center justify-center">
          <span className="text-xl">🧾</span>
        </div>
      </header>

      {/* Divider */}
      <div className="h-px bg-dark-border mx-4 mb-4" />

      {/* Sale Form (Client Component) */}
      <SaleForm menuItems={menuItems} />
    </div>
  );
}
