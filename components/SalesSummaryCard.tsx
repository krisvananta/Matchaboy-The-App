import { formatRupiah } from "@/lib/utils";

interface SalesSummaryCardProps {
  name:     string;
  quantity: number;
  subtotal: number;
  price:    number;
}

const ITEM_EMOJIS: Record<string, string> = {
  "Matcha OG":         "🍵",
  "Strawberry Matcha": "🍓",
  "Chocolate Matcha":  "🍫",
  "Honey Matcha":      "🍯",
  "Caramel Matcha":    "🧁",
  "Coconut Matcha":    "🥥",
};

export default function SalesSummaryCard({
  name,
  quantity,
  subtotal,
  price,
}: SalesSummaryCardProps) {
  const emoji    = ITEM_EMOJIS[name] ?? "🍵";
  const hasSales = quantity > 0;

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-150
        ${hasSales
          ? "bg-dark-card border border-dark-border"
          : "bg-dark-surface/50 border border-transparent opacity-60"
        }`}
    >
      {/* Emoji */}
      <span className="text-2xl flex-shrink-0 w-9 text-center">{emoji}</span>

      {/* Name + Price */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${hasSales ? "text-white" : "text-dark-muted"}`}>
          {name}
        </p>
        <p className="text-dark-muted text-xs">{formatRupiah(price)} / cup</p>
      </div>

      {/* Quantity + Subtotal */}
      <div className="text-right flex-shrink-0">
        <p className={`font-bold text-base tabular-nums ${hasSales ? "text-matcha-400" : "text-dark-muted"}`}>
          {hasSales ? `×${quantity}` : "−"}
        </p>
        {hasSales && (
          <p className="text-dark-muted text-xs tabular-nums">
            {formatRupiah(subtotal)}
          </p>
        )}
      </div>
    </div>
  );
}
