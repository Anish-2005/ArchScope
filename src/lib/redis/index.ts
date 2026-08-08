// Redis-backed persistence layer with an in-memory fallback.
// Exports mirror the former `@/lib/redis` module so callers are unaffected.

export { hasRedisConfig, redis, memoryReports, memoryPolicies, memoryBaselines, memoryMembers, memoryWebhookLog, DEFAULT_POLICY } from "./client";
export type { OrgMember, OrgRecord, WebhookEvent, ScanJob } from "./types";
export { getCache, setCache } from "./cache";
export { saveScan, listScans, listScansByRepo, saveBaseline, getBaseline, getRepoTrend } from "./scans";
export { getOrgMembers, saveOrgMember, listOrgs, saveOrg } from "./members";
export { getPolicy, savePolicy } from "./policy";
export { checkRateLimit, enqueueScanJob, getScanJob, updateScanJob, logWebhookEvent, listWebhookEvents } from "./queue";
