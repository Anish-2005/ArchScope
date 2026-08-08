import { ScanRecord } from "../types";
import { redis, memoryReports, memoryBaselines } from "./client";

const SCAN_LIST_LIMIT = 199;

export async function saveScan(record: ScanRecord): Promise<void> {
    const key = `archscope:org:${record.organization}:scans`;
    if (!redis) {
        const list = memoryReports.get(record.organization) || [];
        memoryReports.set(record.organization, [record, ...list].slice(0, 200));
        return;
    }
    await redis.lpush(key, record);
    await redis.ltrim(key, 0, SCAN_LIST_LIMIT);
}

export async function listScans(organization: string, limit = 20): Promise<ScanRecord[]> {
    if (!redis) return (memoryReports.get(organization) || []).slice(0, limit);
    return (await redis.lrange<ScanRecord>(`archscope:org:${organization}:scans`, 0, Math.max(0, limit - 1))) || [];
}

export async function listScansByRepo(organization: string, repo: string, limit = 10): Promise<ScanRecord[]> {
    const all = await listScans(organization, 200);
    return all.filter((s) => s.repository === repo || s.repository.endsWith(`/${repo}`)).slice(0, limit);
}

export async function saveBaseline(organization: string, record: ScanRecord): Promise<void> {
    const key = `archscope:org:${organization}:baseline`;
    if (!redis) { memoryBaselines.set(organization, record); return; }
    await redis.set(key, record);
}

export async function getBaseline(organization: string): Promise<ScanRecord | null> {
    if (!redis) return memoryBaselines.get(organization) || null;
    return redis.get<ScanRecord>(`archscope:org:${organization}:baseline`);
}

export async function getRepoTrend(organization: string, repository: string, limit = 10): Promise<{ date: string; health: number; complexity: number }[]> {
    const scans = await listScansByRepo(organization, repository, limit);
    return scans.map((s) => ({
        date: s.scannedAt,
        health: s.report.healthScore,
        complexity: s.report.complexityScore,
    })).reverse();
}
