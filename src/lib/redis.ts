import { Redis } from '@upstash/redis';

// Default to a mock redis client if env vars are missing so the app doesn't crash locally
// before the user sets up their Upstash account, but we log a warning.
const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = hasRedisConfig
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// Helper to reliably interact with cache even if Redis isn't configured
export async function getCache<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
        return await redis.get<T>(key);
    } catch (error) {
        console.warn(`Redis get error:`, error);
        return null;
    }
}

export async function setCache(key: string, value: any, ttlSeconds: number = 21600): Promise<void> {
    if (!redis) {
        console.warn('Skipping cache set: Redis not configured');
        return;
    }
    try {
        await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
        console.warn(`Redis set error:`, error);
    }
}
