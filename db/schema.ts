import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ─── Menu Items ────────────────────────────────────────────────────────────────
export const menuItems = sqliteTable("menu_items", {
  id:    integer("id").primaryKey({ autoIncrement: true }),
  name:  text("name").notNull(),
  price: integer("price").notNull(), // in IDR
});

// ─── Sales ─────────────────────────────────────────────────────────────────────
export const sales = sqliteTable("sales", {
  id:         integer("id").primaryKey({ autoIncrement: true }),
  menuItemId: integer("menu_item_id").notNull().references(() => menuItems.id),
  quantity:   integer("quantity").notNull(),
  totalPrice: integer("total_price").notNull(),
  soldAt:     text("sold_at").notNull(), // ISO 8601 string
});

// ─── Relations ─────────────────────────────────────────────────────────────────
export const menuItemsRelations = relations(menuItems, ({ many }) => ({
  sales: many(sales),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [sales.menuItemId],
    references: [menuItems.id],
  }),
}));

// ─── Types ─────────────────────────────────────────────────────────────────────
export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
export type Sale = typeof sales.$inferSelect;
export type NewSale = typeof sales.$inferInsert;
