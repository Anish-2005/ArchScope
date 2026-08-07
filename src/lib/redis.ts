import { Redis } from "@upstash/redis";
import { ArchitecturePolicy, ScanRecord, StackReport } from "./types";
import { OrgRole } from "./auth";

// ─── Redis Client ──────────────────────────────────────────────────────────────
const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = hasRedisConfig
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// ─── In-Memory Fallback Store (no Redis) ──────────────────────────────────────
const memoryReports = new Map<string, ScanRecord[]>();
const memoryPolicies = new Map<string, ArchitecturePolicy>();
const memoryBaselines = new Map<string, ScanRecord>();
const memoryMembers = new Map<string, OrgMember[]>();
const memoryWebhookLog = new Map<string, WebhookEvent[]>();

const DEFAULT_POLICY: Omit<ArchitecturePolicy, "organization"> = {
    requireCi: true,
    requireTestEvidence: true,
    maxDependencies: 80,
    maxComplexity: 70,
};

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface OrgMember {
    userId: string;
    password: string;
    role: OrgRole;
    joinedAt: string;
}

export interface OrgRecord {
    name: string;
    plan: "free" | "team" | "enterprise";
    createdAt: string;
    ownerId: string;
}

export interface WebhookEvent {
    id: string;
    type: string;
    payload: unknown;
    receivedAt: string;
}

export interface ScanJob {
    id: string;
    org: string;
    repoUrl: string;
    status: "pending" | "running" | "done" | "failed";
    createdAt: string;
    completedAt?: string;
    result?: ScanRecord;
    error?: string;
}

// ─── Cache ─────────────────────────────────────────────────────────────────────
export async function getCache<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try { return await redis.get<T>(key); } catch { return null; }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 21600): Promise<void> {
    if (!redis) return;
    try { await redis.set(key, value, { ex: ttlSeconds }); } catch { /* no-op */ }
}

// ─── Scans ─────────────────────────────────────────────────────────────────────
export async function saveScan(record: ScanRecord): Promise<void> {
    const key = `archscope:org:${record.organization}:scans`;
    if (!redis) {
        const list = memoryReports.get(record.organization) || [];
        memoryReports.set(record.organization, [record, ...list].slice(0, 200));
        return;
    }
    await redis.lpush(key, record);
    await redis.ltrim(key, 0, 199);
}

export async function listScans(organization: string, limit = 20): Promise<ScanRecord[]> {
    if (!redis) return (memoryReports.get(organization) || []).slice(0, limit);
    return (await redis.lrange<ScanRecord>(`archscope:org:${organization}:scans`, 0, Math.max(0, limit - 1))) || [];
}

export async function listScansByRepo(organization: string, repo: string, limit = 10): Promise<ScanRecord[]> {
    const all = await listScans(organization, 200);
    return all.filter((s) => s.repository === repo || s.repository.endsWith(`/${repo}`)).slice(0, limit);
}

// ─── Policies ──────────────────────────────────────────────────────────────────
export async function getPolicy(organization: string): Promise<ArchitecturePolicy> {
    if (!redis) return memoryPolicies.get(organization) || { organization, ...DEFAULT_POLICY };
    return (await redis.get<ArchitecturePolicy>(`archscope:org:${organization}:policy`)) || { organization, ...DEFAULT_POLICY };
}

export async function savePolicy(policy: ArchitecturePolicy): Promise<void> {
    if (!redis) { memoryPolicies.set(policy.organization, policy); return; }
    await redis.set(`archscope:org:${policy.organization}:policy`, policy);
}

// ─── Baselines ─────────────────────────────────────────────────────────────────
export async function saveBaseline(organization: string, record: ScanRecord): Promise<void> {
    const key = `archscope:org:${organization}:baseline`;
    if (!redis) { memoryBaselines.set(organization, record); return; }
    await redis.set(key, record);
}

export async function getBaseline(organization: string): Promise<ScanRecord | null> {
    if (!redis) return memoryBaselines.get(organization) || null;
    return redis.get<ScanRecord>(`archscope:org:${organization}:baseline`);
}

// ─── Org Members ───────────────────────────────────────────────────────────────
export async function getOrgMembers(organization: string): Promise<OrgMember[]> {
    if (!redis) return memoryMembers.get(organization) || [];
    return (await redis.get<OrgMember[]>(`archscope:org:${organization}:members`)) || [];
}

export async function saveOrgMember(organization: string, member: OrgMember): Promise<void> {
    const existing = await getOrgMembers(organization);
    const updated = [member, ...existing.filter((m) => m.userId !== member.userId)];
    if (!redis) { memoryMembers.set(organization, updated); return; }
    await redis.set(`archscope:org:${organization}:members`, updated);
}

export async function listOrgs(): Promise<OrgRecord[]> {
    if (!redis) return [];
    const keys = await redis.keys("archscope:org:*:meta");
    const orgs = await Promise.all(keys.map((k) => redis!.get<OrgRecord>(k)));
    return orgs.filter(Boolean) as OrgRecord[];
}

export async function saveOrg(org: OrgRecord): Promise<void> {
    if (!redis) return;
    await redis.set(`archscope:org:${org.name}:meta`, org);
}

// ─── Rate Limiter (Sliding Window) ─────────────────────────────────────────────
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

// ─── Scan Job Queue ─────────────────────────────────────────────────────────────
export async function enqueueScanJob(job: ScanJob): Promise<void> {
    const key = `archscope:queue:scans`;
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

// ─── Webhook Log ───────────────────────────────────────────────────────────────
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

// ─── Trend Data ────────────────────────────────────────────────────────────────
export async function getRepoTrend(organization: string, repository: string, limit = 10): Promise<{ date: string; health: number; complexity: number }[]> {
    const scans = await listScansByRepo(organization, repository, limit);
    return scans.map((s) => ({
        date: s.scannedAt,
        health: s.report.healthScore,
        complexity: s.report.complexityScore,
    })).reverse();
}
