"use client";

import { formatRupiah } from "@/lib/utils";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

// Emoji per menu item for visual flair
const ITEM_EMOJIS: Record<string, string> = {
  "Matcha OG":         "🍵",
  "Strawberry Matcha": "🍓",
  "Chocolate Matcha":  "🍫",
  "Honey Matcha":      "🍯",
  "Caramel Matcha":    "🧁",
  "Coconut Matcha":    "🥥",
};

export default function MenuItemCard({
  item,
  quantity,
  onIncrement,
  onDecrement,
}: MenuItemCardProps) {
  const emoji = ITEM_EMOJIS[item.name] ?? "🍵";
  const isActive = quantity > 0;

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-4 transition-all duration-200 select-none
        ${
          isActive
            ? "bg-matcha-500/20 border border-matcha-500/50 shadow-lg shadow-matcha-500/10"
            : "bg-dark-card border border-dark-border"
        }`}
    >
      {/* Quantity Badge */}
      {isActive && (
        <span className="absolute top-2.5 right-2.5 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-matcha-500 text-white text-xs font-bold">
          {quantity}
        </span>
      )}

      {/* Emoji */}
      <span className="text-3xl mb-2 leading-none">{emoji}</span>

      {/* Name */}
      <p className="text-white font-semibold text-sm leading-tight mb-0.5">
        {item.name}
      </p>

      {/* Price */}
      <p className="text-matcha-400 text-xs font-medium mb-4">
        {formatRupiah(item.price)}
      </p>

      {/* Counter Controls */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={onDecrement}
          disabled={quantity === 0}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-150 active:scale-95
            ${
              quantity === 0
                ? "bg-dark-border/50 text-dark-muted cursor-not-allowed"
                : "bg-matcha-600 text-white shadow-sm active:bg-matcha-700"
            }`}
          aria-label={`Decrease ${item.name}`}
        >
          −
        </button>

        <span className="text-white font-bold text-lg w-6 text-center tabular-nums">
          {quantity}
        </span>

        <button
          onClick={onIncrement}
          className="w-10 h-10 rounded-xl bg-matcha-500 text-white flex items-center justify-center text-lg font-bold transition-all duration-150 active:scale-95 active:bg-matcha-600 shadow-sm"
          aria-label={`Increase ${item.name}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
