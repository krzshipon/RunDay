import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@runday/ui', '@runday/dashboard', '@runday/database', '@runday/auth'],
};

export default nextConfig;
