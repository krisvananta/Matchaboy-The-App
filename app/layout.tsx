import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Matchaboy — Sales Tracker",
  description: "Daily sales tracker for Matchaboy matcha beverages",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Matchaboy",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // iOS safe area
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-dark-base text-white antialiased">
        {/* Mobile container — centered, max-width for tablet/desktop */}
        <div className="max-w-md mx-auto min-h-dvh flex flex-col relative">
          {/* Safe area top spacer */}
          <div
            className="flex-shrink-0 bg-dark-surface/80"
            style={{ height: "env(safe-area-inset-top)" }}
          />

          {/* Page content — scrollable area */}
          <main
            className="flex-1 overflow-y-auto"
            style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}
          >
            {children}
          </main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}
