import { NextResponse } from "next/server";
import { getSessionFromRequest, signSession, COOKIE_OPTIONS, SESSION_COOKIE, OrgRole } from "@/lib/auth";
import { getOrgMembers, saveOrgMember } from "@/lib/redis";

const DEFAULT_ORG_PASSCODES: Record<string, { password: string; role: OrgRole }[]> = {
    personal: [{ password: "personal", role: "owner" }],
};

export async function POST(req: Request) {
    const { org, password, userId } = await req.json();

    if (!org || typeof org !== "string" || !password || typeof password !== "string") {
        return NextResponse.json({ error: "org and password are required" }, { status: 400 });
    }

    const normalizedOrg = org.toLowerCase().replace(/[^a-z0-9-]/g, "");

    // Check org members stored in Redis first, then fall back to defaults
    let matched: OrgRole | null = null;
    try {
        const members = await getOrgMembers(normalizedOrg);
        const member = members.find((m) => m.password === password && (m.userId === userId || !userId));
        if (member) matched = member.role;
    } catch {
        // Redis not configured — fall back to in-memory defaults
    }

    if (!matched) {
        const defaults = DEFAULT_ORG_PASSCODES[normalizedOrg];
        const found = defaults?.find((d) => d.password === password);
        if (found) matched = found.role;
    }

    if (!matched) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signSession({ org: normalizedOrg, role: matched, userId: userId || normalizedOrg });
    const response = NextResponse.json({ ok: true, org: normalizedOrg, role: matched });
    response.cookies.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
    return response;
}

export async function GET(req: Request) {
    const nextReq = req as unknown as import("next/server").NextRequest;
    const session = getSessionFromRequest(nextReq);
    if (!session) return NextResponse.json({ session: null });
    return NextResponse.json({ session });
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
    return response;
}
