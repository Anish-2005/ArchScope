import { ArchitecturePolicy } from "../types";
import { redis, memoryPolicies, DEFAULT_POLICY } from "./client";

export async function getPolicy(organization: string): Promise<ArchitecturePolicy> {
    if (!redis) return memoryPolicies.get(organization) || { organization, ...DEFAULT_POLICY };
    return (await redis.get<ArchitecturePolicy>(`archscope:org:${organization}:policy`)) || { organization, ...DEFAULT_POLICY };
}

export async function savePolicy(policy: ArchitecturePolicy): Promise<void> {
    if (!redis) { memoryPolicies.set(policy.organization, policy); return; }
    await redis.set(`archscope:org:${policy.organization}:policy`, policy);
}
