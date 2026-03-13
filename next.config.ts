import type { NextConfig } from "next";

// Wrap Next config with Sentry if available
let nextConfig: NextConfig = {
  reactCompiler: true,
};

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { withSentryConfig } = require('@sentry/nextjs');
  nextConfig = withSentryConfig(nextConfig, { silent: true });
} catch (e) {
  // Sentry not installed in some environments; fall back to default config
}

export default nextConfig;
