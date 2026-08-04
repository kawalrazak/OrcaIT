import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server for Docker (.next/standalone).
  output: "standalone",
};

export default nextConfig;
