import { redis, memoryWebhookLog } from "./client";
import { ScanJob, WebhookEvent } from "./types";

// Rate Limiter (Sliding Window)
export async function checkRateLimit(org: string, windowSecs = 60, max = 5): Promise<{ allowed: boolean; remaining: number }> {
    if (!redis) return { allowed: true, remaining: max };
    const key = `archscope:ratelimit:${org}`;
    const now = Date.now();
    const windowStart = now - windowSecs * 1000;
    await redis.zremrangebyscore(key, 0, windowStart);
    const count = await redis.zcard(key);
    if (count >= max) return { allowed: false, remaining: 0 };
    await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    await redis.expire(key, windowSecs * 2);
    return { allowed: true, remaining: max - count - 1 };
}

// Scan Job Queue
export async function enqueueScanJob(job: ScanJob): Promise<void> {
    const key = "archscope:queue:scans";
    const jobKey = `archscope:job:${job.id}`;
    if (!redis) return;
    await redis.set(jobKey, job, { ex: 3600 });
    await redis.lpush(key, job.id);
}

export async function getScanJob(jobId: string): Promise<ScanJob | null> {
    if (!redis) return null;
    return redis.get<ScanJob>(`archscope:job:${jobId}`);
}

export async function updateScanJob(jobId: string, updates: Partial<ScanJob>): Promise<void> {
    if (!redis) return;
    const existing = await getScanJob(jobId);
    if (!existing) return;
    await redis.set(`archscope:job:${jobId}`, { ...existing, ...updates }, { ex: 3600 });
}

// Webhook Log
export async function logWebhookEvent(organization: string, event: WebhookEvent): Promise<void> {
    const key = `archscope:org:${organization}:webhooks`;
    if (!redis) {
        const list = memoryWebhookLog.get(organization) || [];
        memoryWebhookLog.set(organization, [event, ...list].slice(0, 500));
        return;
    }
    await redis.lpush(key, event);
    await redis.ltrim(key, 0, 499);
}

export async function listWebhookEvents(organization: string, limit = 20): Promise<WebhookEvent[]> {
    if (!redis) return (memoryWebhookLog.get(organization) || []).slice(0, limit);
    return (await redis.lrange<WebhookEvent>(`archscope:org:${organization}:webhooks`, 0, limit - 1)) || [];
}
