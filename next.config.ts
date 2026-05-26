import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/TaliinAtlas",
  assetPrefix: "/TaliinAtlas/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
