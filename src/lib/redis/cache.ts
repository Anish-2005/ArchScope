import { redis } from "./client";

export async function getCache<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try { return await redis.get<T>(key); } catch { return null; }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 21600): Promise<void> {
    if (!redis) return;
    try { await redis.set(key, value, { ex: ttlSeconds }); } catch { /* no-op */ }
}
