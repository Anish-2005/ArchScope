import { NextResponse } from "next/server";
import { listScans } from "@/lib/redis";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const organization = (searchParams.get("organization") || "personal").toLowerCase();
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));
    if (!/^[a-z0-9-]{1,48}$/.test(organization)) {
        return NextResponse.json({ error: "Invalid organization" }, { status: 400 });
    }
    return NextResponse.json({ organization, scans: await listScans(organization, limit) });
}
