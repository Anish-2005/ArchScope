import { NextResponse } from "next/server";
import { listScansByRepo, getRepoTrend } from "@/lib/redis";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
    const nextReq = req as unknown as import("next/server").NextRequest;
    const session = getSessionFromRequest(nextReq);
    const org = session?.org || "personal";

    const { searchParams } = new URL(req.url);
    const repo = searchParams.get("repo");
    const mode = searchParams.get("mode"); // 'full' or 'trend'
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!repo) return NextResponse.json({ error: "repo is required" }, { status: 400 });

    if (mode === "trend") {
        const trend = await getRepoTrend(org, repo, limit);
        return NextResponse.json({ trend });
    }

    const history = await listScansByRepo(org, repo, limit);
    return NextResponse.json({ history });
}
