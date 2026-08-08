import { NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";
import { listOrgs, saveOrg, saveOrgMember, OrgRecord, OrgMember } from "@/lib/redis";
import crypto from "crypto";

export async function GET(req: Request) {
    const nextReq = req as unknown as import("next/server").NextRequest;
    const session = getSessionFromRequest(nextReq);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orgs = await listOrgs();
    return NextResponse.json({ orgs });
}

export async function POST(req: Request) {
    const nextReq = req as unknown as import("next/server").NextRequest;
    const session = getSessionFromRequest(nextReq);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, plan = "free" } = body;
    if (!name || typeof name !== "string") {
        return NextResponse.json({ error: "org name is required" }, { status: 400 });
    }
    const normalized = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const org: OrgRecord = {
        name: normalized,
        plan: plan as OrgRecord["plan"],
        createdAt: new Date().toISOString(),
        ownerId: session.userId,
    };
    await saveOrg(org);

    // Add creator as owner member
    const member: OrgMember = {
        userId: session.userId,
        password: crypto.randomBytes(8).toString("hex"),
        role: "owner",
        joinedAt: new Date().toISOString(),
    };
    await saveOrgMember(normalized, member);

    return NextResponse.json({ ok: true, org });
}

export async function PUT(req: Request) {
    const nextReq = req as unknown as import("next/server").NextRequest;
    const session = getSessionFromRequest(nextReq);
    if (!session || !requireRole(session, "admin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, password, role } = body;
    if (!userId || !password || !role) {
        return NextResponse.json({ error: "userId, password, and role are required" }, { status: 400 });
    }

    const member: OrgMember = {
        userId,
        password,
        role,
        joinedAt: new Date().toISOString(),
    };
    await saveOrgMember(session.org, member);
    return NextResponse.json({ ok: true, member });
}
