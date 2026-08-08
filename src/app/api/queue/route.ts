import { NextResponse } from "next/server";
import { enqueueScanJob, getScanJob } from "@/lib/redis";
import { getSessionFromRequest } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
    const nextReq = req as unknown as import("next/server").NextRequest;
    const session = getSessionFromRequest(nextReq);
    const org = session?.org || "personal";

    const { repoUrl } = await req.json();
    if (!repoUrl) return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });

    const jobId = crypto.randomUUID();
    const job = {
        id: jobId,
        org,
        repoUrl,
        status: "pending" as const,
        createdAt: new Date().toISOString()
    };

    await enqueueScanJob(job);
    
    // In a real Redis queue system (like BullMQ), a worker would pick this up.
    // For this edge/serverless demo, we'll fire-and-forget a fetch call to ourselves 
    // to process the job asynchronously in the background.
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    fetch(`${origin}/api/queue/worker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, repoUrl, org })
    }).catch(() => {});

    return NextResponse.json({ ok: true, jobId, status: "pending" });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

    const job = await getScanJob(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json({ job });
}
