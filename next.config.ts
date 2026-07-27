import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 避免父级 lockfile 干扰
  turbopack: {
    root: process.cwd(),
  },

  // 确保 data 目录在部署时被包含
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
  },
};

export default nextConfig;
