import { Redis } from "@upstash/redis";
import { ArchitecturePolicy, ScanRecord } from "../types";
import { OrgMember, WebhookEvent } from "./types";

export const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = hasRedisConfig
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// In-memory fallback store (used when no Redis is configured)
export const memoryReports = new Map<string, ScanRecord[]>();
export const memoryPolicies = new Map<string, ArchitecturePolicy>();
export const memoryBaselines = new Map<string, ScanRecord>();
export const memoryMembers = new Map<string, OrgMember[]>();
export const memoryWebhookLog = new Map<string, WebhookEvent[]>();

export const DEFAULT_POLICY: Omit<ArchitecturePolicy, "organization"> = {
    requireCi: true,
    requireTestEvidence: true,
    maxDependencies: 80,
    maxComplexity: 70,
};
