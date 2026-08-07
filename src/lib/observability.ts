/**
 * Lightweight structured observability layer.
 * Emits JSON-structured logs and optionally fires Sentry performance spans.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    [key: string]: unknown;
}

function emit(level: LogLevel, message: string, meta: Record<string, unknown> = {}) {
    const entry: LogEntry = { level, message, timestamp: new Date().toISOString(), ...meta };
    const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    fn(JSON.stringify(entry));
}

export const log = {
    info: (message: string, meta?: Record<string, unknown>) => emit("info", message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => emit("warn", message, meta),
    error: (message: string, meta?: Record<string, unknown>) => emit("error", message, meta),
    debug: (message: string, meta?: Record<string, unknown>) => {
        if (process.env.NODE_ENV !== "production") emit("debug", message, meta);
    },
};

export function recordMetric(name: string, value: number, tags: Record<string, string> = {}) {
    log.info(`metric:${name}`, { value, tags });
    // If Sentry is configured, this can be extended to push a measurement:
    // Sentry.metrics.distribution(name, value, { tags });
}

export function withTiming<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    return fn().then(
        (result) => {
            recordMetric(`${label}.duration_ms`, Date.now() - start, { status: "ok" });
            return result;
        },
        (err) => {
            recordMetric(`${label}.duration_ms`, Date.now() - start, { status: "error" });
            log.error(`${label} failed`, { error: String(err) });
            throw err;
        }
    );
}
