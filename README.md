# Matchaboy Sales Tracker 🍵

> A lightweight, mobile-first daily sales tracker for **Matchaboy** — a premium matcha beverage business.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v3**, and a local **SQLite** database via **Drizzle ORM**. Optimized strictly for iPhone X/11 usage, exposed to the world via a **Cloudflare Tunnel**.

---

## 🚀 Key Features

- **Counter Page (`/`)** — A tap-friendly 2×3 grid of all 6 menu items with `−` / `+` quantity controls. Logs multiple items in a single tap with instant toast feedback.
- **Dashboard Page (`/dashboard`)** — Daily revenue summary, per-item sales breakdown, and a Top Products ranking. Fully filterable by date.
- **Zero External Database** — SQLite runs as a single local file (`matchaboy.db`). No Docker, no Postgres, no cloud setup.
- **Cloudflare Tunnel** — Accessible from any device in the world without port forwarding or a static IP.
- **iPhone X/11 Optimized** — Safe-area insets, 44px touch targets, `viewport-fit=cover`, no iOS text zoom.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com) |
| **Database** | SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) |
| **Process Manager** | [PM2](https://pm2.keymetrics.io) |
| **Tunnel** | [Cloudflare Tunnel (`cloudflared`)](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) |

---

## 🍵 Menu Items

| # | Item | Price |
|---|---|---|
| 1 | Matcha OG | Rp 15.000 |
| 2 | Strawberry Matcha | Rp 23.000 |
| 3 | Chocolate Matcha | Rp 23.000 |
| 4 | Honey Matcha | Rp 18.000 |
| 5 | Caramel Matcha | Rp 23.000 |
| 6 | Coconut Matcha | Rp 23.000 |

> Menu items are automatically seeded into the database on first startup.

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** `>= 20.x`
- **npm**
- **PM2** installed globally: `npm install -g pm2`

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone (connected to the same Wi-Fi) or browser.

---

## 🌐 Production — Global Access via Cloudflare Tunnel

To serve the app from this Windows machine and make it accessible **from any device in the world** (no router port-forwarding, no static IP):

### 1. Build the Production Bundle *(once, or after code changes)*

```bash
npm run build
```

### 2. Start Server + Tunnel

**Double-click `start.bat`** in the project folder, or run from terminal:

```bat
start.bat
```

This script:
1. Starts the Next.js production server on `http://0.0.0.0:3001` in a minimized window
2. Starts the Cloudflare Tunnel in the foreground — the **public URL appears here**

### 3. Get Your Public URL

The URL appears in the `start.bat` window within ~15 seconds. Look for a line like:

```
Your quick Tunnel has been created! Visit it at:
https://random-words-here.trycloudflare.com
```

Open that URL on **any device, anywhere** — it just works. 🌍

### 4. Stop Everything

**Double-click `stop.bat`** or run:

```bat
stop.bat
```

---

> [!NOTE]
> The `trycloudflare.com` URL is **ephemeral** — it changes every time you restart the tunnel.
> If you need a permanent URL, set up a [Named Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps) with a free Cloudflare account.



## 📐 Project Structure

```
matchaboy-app/
├── app/
│   ├── layout.tsx          # Root layout — safe-area, viewport, mobile container
│   ├── page.tsx            # Counter page (/)
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard page (/dashboard)
│   ├── globals.css         # Tailwind base + safe-area CSS vars + animations
│   └── actions.ts          # Server Actions: logSale, getDashboardData, getMenuItems
├── db/
│   ├── index.ts            # Drizzle client + better-sqlite3 (WAL mode, singleton)
│   ├── schema.ts           # menu_items + sales Drizzle schema
│   └── seed.ts             # Table creation + seed on first run
├── components/
│   ├── MenuItemCard.tsx    # Tap-friendly item card with emoji, +/- counter
│   ├── SaleForm.tsx        # Cart state, revenue total, submit + toast
│   ├── DateFilter.tsx      # Native date input with "Today" shortcut
│   ├── SalesSummaryCard.tsx  # Dashboard row: name, qty, subtotal
│   └── BottomNav.tsx       # Sticky 2-tab bottom navigation
├── lib/
│   └── utils.ts            # formatRupiah(), todayLocal(), formatDate()
├── instrumentation.ts      # Next.js startup hook — runs DB init once
├── ecosystem.config.js     # PM2 config (Next.js server + Cloudflare Tunnel)
├── drizzle.config.ts       # Drizzle Kit config
├── next.config.ts          # serverExternalPackages: better-sqlite3
└── matchaboy.db            # SQLite database (auto-created, gitignored)
```

---

## 🗄️ Database Schema

### `menu_items`
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | auto-increment |
| `name` | TEXT | e.g. "Matcha OG" |
| `price` | INTEGER | in IDR |

### `sales`
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | auto-increment |
| `menu_item_id` | INTEGER FK | → `menu_items.id` |
| `quantity` | INTEGER | units sold |
| `total_price` | INTEGER | quantity × price at sale time |
| `sold_at` | TEXT | ISO 8601 timestamp |

---

## 📱 Mobile Optimization Details

| Feature | Implementation |
|---|---|
| Safe-area top | `env(safe-area-inset-top)` spacer in root layout |
| Safe-area bottom | `env(safe-area-inset-bottom)` on BottomNav |
| iOS zoom prevention | `font-size: 16px` on all `<input>` |
| Touch targets | Minimum `44×44px` on all buttons |
| Viewport | `viewport-fit=cover`, `user-scalable=no` |
| Mobile container | `max-w-md mx-auto` (clamps to 448px) |
| iOS scroll bounce | `overscroll-behavior: none` |
| iOS text resize | `-webkit-text-size-adjust: 100%` |

---

## ⚙️ Key Architecture Notes

**Why `instrumentation.ts` for DB init?**
Next.js 15's `instrumentation.ts` runs once when the server process starts, before any requests are handled. This prevents `SQLITE_BUSY` lock errors that occur when `layout.tsx` tries to initialise the DB from multiple parallel static-render workers during `next build`.

**Why WAL mode?**
`PRAGMA journal_mode = WAL` allows concurrent reads while a write is in progress — ideal for a web server with occasional simultaneous requests through the Cloudflare Tunnel.

---

## 📄 License

All rights reserved. © Matchaboy.
