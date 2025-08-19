import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/5crowns' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/5crowns/' : '',
};

export default nextConfig;
