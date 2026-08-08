import { OrgRole } from "../auth";

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
    result?: import("../types").ScanRecord;
    error?: string;
}
