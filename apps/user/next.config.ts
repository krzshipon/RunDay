import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@runday/ui', '@runday/dashboard', '@runday/database', '@runday/auth'],
  // Disable static optimization to prevent SSR context issues
  experimental: {
    // Disable static optimization
    workerThreads: false,
  },
};

export default nextConfig;
