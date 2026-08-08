import { NextResponse } from "next/server";
import { updateScanJob, saveScan, getPolicy } from "@/lib/redis";
import { parseRepoUrl, fetchRepoData } from "@/lib/vcs";
import { detectStack } from "@/lib/detector";
import { log } from "@/lib/observability";
import crypto from "crypto";

export async function POST(req: Request) {
    const { jobId, repoUrl, org } = await req.json();
    
    if (!jobId || !repoUrl || !org) {
        return NextResponse.json({ error: "Missing required params" }, { status: 400 });
    }

    try {
        await updateScanJob(jobId, { status: "running" });
        
        const parsed = parseRepoUrl(repoUrl);
        if (!parsed) throw new Error("Invalid repo URL");

        const repoData = await fetchRepoData(repoUrl);
        const report = detectStack(repoData, repoUrl);
        report.scanId = crypto.randomUUID();
        report.scannedAt = new Date().toISOString();

        const policy = await getPolicy(org);
        if (policy.requireCi && report.signals.workflowCount === 0) {
            report.findings.unshift({ id: "policy-ci", severity: "high", category: "delivery", title: "Policy breach: CI required", detail: "Automated CI workflow required." });
        }

        const repoRef = `${parsed.owner}/${parsed.repo}`;
        await saveScan({ id: report.scanId, organization: org, repository: repoRef, scannedAt: report.scannedAt, report });
        
        await updateScanJob(jobId, { status: "done", completedAt: new Date().toISOString(), result: { id: report.scanId, organization: org, repository: repoRef, scannedAt: report.scannedAt, report } });
        log.info("Background job completed", { jobId, repoUrl });
        
        return NextResponse.json({ ok: true });
    } catch (e) {
        log.error("Background job failed", { jobId, error: String(e) });
        await updateScanJob(jobId, { status: "failed", error: String(e), completedAt: new Date().toISOString() });
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
