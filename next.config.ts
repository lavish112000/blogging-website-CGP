import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: [],
  // Dev server configuration
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;
