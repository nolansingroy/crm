import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Remove turbopack config that's causing issues
  }
};

export default nextConfig;
