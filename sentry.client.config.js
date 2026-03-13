// Safe Sentry initialization: attempt dynamic require and no-op if missing
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require('@sentry/nextjs');

  Sentry.init({
    dsn: process.env.SENTRY_DSN || '',
    tracesSampleRate: 0.2,
    environment: process.env.NODE_ENV,
  });
} catch {
  // @sentry/nextjs is not installed in this environment — skip initialization
}
