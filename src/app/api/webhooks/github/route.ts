import { NextResponse } from "next/server";
import { parseRepoUrl, fetchRepoData } from "@/lib/vcs";
import { detectStack } from "@/lib/detector";
import { getPolicy, saveScan, logWebhookEvent } from "@/lib/redis";
import { evaluatePolicy } from "@/lib/policy";
import { verifyGithubSignature, buildPrComment } from "@/lib/webhooks";
import { log } from "@/lib/observability";
import crypto from "crypto";

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event");

    // Verify webhook signature
    if (!verifyGithubSignature(rawBody, signature, GITHUB_WEBHOOK_SECRET)) {
        log.warn("GitHub webhook signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payload: Record<string, unknown>;
    try {
        payload = JSON.parse(rawBody);
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Log the event
    await logWebhookEvent("personal", {
        id: crypto.randomUUID(),
        type: event || "unknown",
        payload,
        receivedAt: new Date().toISOString(),
    });

    // Only process pull_request events
    if (event !== "pull_request") {
        return NextResponse.json({ ok: true, processed: false, reason: "event not handled" });
    }

    const action = payload.action as string;
    if (!["opened", "synchronize", "reopened"].includes(action)) {
        return NextResponse.json({ ok: true, processed: false, reason: "action not handled" });
    }

    const pr = payload.pull_request as Record<string, unknown>;
    const repository = payload.repository as Record<string, unknown>;
    const repoFullName = repository?.full_name as string;
    const prNumber = pr?.number as number;
    const githubToken = process.env.GITHUB_TOKEN;

    if (!repoFullName || !prNumber || !githubToken) {
        log.warn("GitHub webhook: missing repo name, PR number, or token");
        return NextResponse.json({ ok: true, processed: false, reason: "insufficient config" });
    }

    // Run analysis in "background" (synchronous here since Next.js edge is stateless)
    try {
        const repoUrl = `https://github.com/${repoFullName}`;
        const parsed = parseRepoUrl(repoUrl);
        if (!parsed) throw new Error("Could not parse repo URL");

        const repoData = await fetchRepoData(repoUrl, githubToken);
        const report = detectStack(repoData, repoUrl);
        report.scanId = crypto.randomUUID();
        report.scannedAt = new Date().toISOString();

        const org = (repository?.owner as Record<string, unknown>)?.login as string || "personal";
        const policy = await getPolicy(org);
        const violations: string[] = evaluatePolicy(report, policy)
            .filter((v) => v.code !== "complexity")
            .map((v) =>
                v.code === "ci"
                    ? "No CI workflow detected"
                    : v.code === "tests"
                        ? "No test evidence detected"
                        : `Dependency count exceeds budget of ${policy.maxDependencies}`
            );

        await saveScan({ id: report.scanId!, organization: org, repository: repoFullName, scannedAt: report.scannedAt!, report });

        const origin = process.env.NEXT_PUBLIC_BASE_URL || "https://archscope.dev";
        const reportUrl = `${origin}/report/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`;
        const pass = violations.length === 0;

        const comment = buildPrComment({
            repo: repoFullName,
            healthScore: report.healthScore,
            complexityScore: report.complexityScore,
            deliveryRisk: report.deliveryRisk,
            violations,
            criticalFindings: report.findings.filter((f) => ["critical", "high"].includes(f.severity)).length,
            reportUrl,
            pass,
        });

        // Post comment to GitHub PR
        const commentRes = await fetch(`https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`, {
            method: "POST",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${githubToken}`,
                "Content-Type": "application/json",
                "User-Agent": "ArchScope",
            },
            body: JSON.stringify({ body: comment }),
        });

        if (!commentRes.ok) {
            log.warn("Failed to post PR comment", { status: commentRes.status, repo: repoFullName, pr: prNumber });
        } else {
            log.info("PR comment posted", { repo: repoFullName, pr: prNumber, pass });
        }

        return NextResponse.json({ ok: true, processed: true, pass, violations });
    } catch (e) {
        log.error("Webhook processing error", { error: String(e) });
        return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
}
