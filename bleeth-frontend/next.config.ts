import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Exclude test files from node_modules
    config.module.rules.push({
      test: /node_modules\/.*\/test\/.*/,
      use: 'null-loader',
    });
    return config;
  },
};

export default nextConfig;
