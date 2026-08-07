import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export type OrgRole = "owner" | "admin" | "member" | "viewer";

export interface Session {
    org: string;
    role: OrgRole;
    userId: string;
    iat: number;
}

const AUTH_SECRET = process.env.AUTH_SECRET || "archscope-dev-secret-change-in-prod";
const COOKIE_NAME = "archscope-session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hmac(data: string): string {
    return crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
}

export function signSession(payload: Omit<Session, "iat">): string {
    const session: Session = { ...payload, iat: Date.now() };
    const data = Buffer.from(JSON.stringify(session)).toString("base64url");
    const sig = hmac(data);
    return `${data}.${sig}`;
}

export function verifySession(token: string): Session | null {
    try {
        const [data, sig] = token.split(".");
        if (!data || !sig) return null;
        const expected = hmac(data);
        if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
        const session: Session = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
        if (Date.now() - session.iat > SESSION_TTL_MS) return null;
        return session;
    } catch {
        return null;
    }
}

/** Server Component helper — reads session from Next.js cookies() */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySession(token);
}

/** API Route helper — reads session from a Request object */
export function getSessionFromRequest(req: NextRequest): Session | null {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySession(token);
}

/** Returns session or throws a Response with 401 */
export async function requireSession(): Promise<Session> {
    const session = await getSession();
    if (!session) throw new Response("Unauthorized", { status: 401 });
    return session;
}

export function requireRole(session: Session, minRole: OrgRole): boolean {
    const levels: Record<OrgRole, number> = { owner: 4, admin: 3, member: 2, viewer: 1 };
    return (levels[session.role] ?? 0) >= levels[minRole];
}

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
};

export const SESSION_COOKIE = COOKIE_NAME;
