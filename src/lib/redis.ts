import { Redis } from '@upstash/redis';
import { ArchitecturePolicy, ScanRecord } from './types';

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

export async function setCache(key: string, value: unknown, ttlSeconds: number = 21600): Promise<void> {
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

const memoryReports = new Map<string, ScanRecord[]>();
const DEFAULT_POLICY: Omit<ArchitecturePolicy, "organization"> = { requireCi: true, requireTestEvidence: true, maxDependencies: 80, maxComplexity: 70 };

export async function saveScan(record: ScanRecord): Promise<void> {
    if (!redis) {
        const scans = memoryReports.get(record.organization) || [];
        memoryReports.set(record.organization, [record, ...scans].slice(0, 50));
        return;
    }
    const key = `archscope:org:${record.organization}:scans`;
    await redis.lpush(key, record);
    await redis.ltrim(key, 0, 99);
}

export async function listScans(organization: string, limit = 20): Promise<ScanRecord[]> {
    if (!redis) return (memoryReports.get(organization) || []).slice(0, limit);
    return (await redis.lrange<ScanRecord>(`archscope:org:${organization}:scans`, 0, Math.max(0, limit - 1))) || [];
}

export async function getPolicy(organization: string): Promise<ArchitecturePolicy> {
    if (!redis) return { organization, ...DEFAULT_POLICY };
    return (await redis.get<ArchitecturePolicy>(`archscope:org:${organization}:policy`)) || { organization, ...DEFAULT_POLICY };
}

export async function savePolicy(policy: ArchitecturePolicy): Promise<void> {
    if (!redis) return;
    await redis.set(`archscope:org:${policy.organization}:policy`, policy);
}
