import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure better-sqlite3 native bindings are not bundled for client
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
