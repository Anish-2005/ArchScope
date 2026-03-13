// Safe Sentry initialization on server: dynamic require with no-op fallback
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Sentry = require('@sentry/nextjs');

  Sentry.init({
    dsn: process.env.SENTRY_DSN || '',
    tracesSampleRate: 0.2,
    environment: process.env.NODE_ENV,
  });
} catch (err) {
  // @sentry/nextjs is not installed or not available — no-op
}
