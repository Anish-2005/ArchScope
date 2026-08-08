import { redis, memoryMembers } from "./client";
import { OrgMember, OrgRecord } from "./types";

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
