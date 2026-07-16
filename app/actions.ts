"use server";

import { db } from "@/db";
import { menuItems, sales } from "@/db/schema";
import { eq, sql, and, like } from "drizzle-orm";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface SaleItem {
  menuItemId: number;
  quantity: number;
}

export interface DashboardItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface DashboardData {
  items: DashboardItem[];
  totalRevenue: number;
  totalItemsSold: number;
  date: string;
}

// ─── Log a Sale ────────────────────────────────────────────────────────────────
export async function logSale(items: SaleItem[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: "No items to log" };
    }

    // Fetch menu items to calculate prices
    const menuData = await db.select().from(menuItems);
    const menuMap = new Map(menuData.map((m) => [m.id, m.price]));

    const now = new Date().toISOString();

    // Insert one sale row per item type
    for (const item of items) {
      if (item.quantity <= 0) continue;

      const price = menuMap.get(item.menuItemId);
      if (!price) continue;

      await db.insert(sales).values({
        menuItemId: item.menuItemId,
        quantity:   item.quantity,
        totalPrice: item.quantity * price,
        soldAt:     now,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("logSale error:", err);
    return { success: false, error: "Failed to log sale" };
  }
}

// ─── Get Dashboard Data ────────────────────────────────────────────────────────
export async function getDashboardData(date: string): Promise<DashboardData> {
  // date format: "YYYY-MM-DD"
  const datePrefix = date; // SQLite LIKE "2024-01-15%"

  const rows = await db
    .select({
      id:       menuItems.id,
      name:     menuItems.name,
      price:    menuItems.price,
      quantity: sql<number>`COALESCE(SUM(${sales.quantity}), 0)`,
      subtotal: sql<number>`COALESCE(SUM(${sales.totalPrice}), 0)`,
    })
    .from(menuItems)
    .leftJoin(
      sales,
      and(
        eq(sales.menuItemId, menuItems.id),
        like(sales.soldAt, `${datePrefix}%`)
      )
    )
    .groupBy(menuItems.id, menuItems.name, menuItems.price);

  const items: DashboardItem[] = rows.map((r) => ({
    id:       r.id,
    name:     r.name,
    price:    r.price,
    quantity: Number(r.quantity),
    subtotal: Number(r.subtotal),
  }));

  const totalRevenue    = items.reduce((sum, i) => sum + i.subtotal, 0);
  const totalItemsSold  = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, totalRevenue, totalItemsSold, date };
}

// ─── Get Menu Items ────────────────────────────────────────────────────────────
export async function getMenuItems() {
  return db.select().from(menuItems).orderBy(menuItems.id);
}
