import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Explicit empty turbopack config to avoid build failure when plugins add a webpack config
  turbopack: {},
  // Avoid incorrect monorepo root inference when multiple lockfiles exist on machine.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
