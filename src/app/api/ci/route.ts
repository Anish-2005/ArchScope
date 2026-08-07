import { NextResponse } from "next/server";
import { parseRepoUrl, fetchRepoData, GitHubFetchError } from "@/lib/vcs";
import { detectStack } from "@/lib/detector";
import { getPolicy, saveScan, listScansByRepo, checkRateLimit } from "@/lib/redis";
import { log } from "@/lib/observability";
import crypto from "crypto";
import { StackReport } from "@/lib/types";

export interface CIResult {
    pass: boolean;
    score: number;
    healthScore: number;
    complexityScore: number;
    deliveryRisk: string;
    violations: string[];
    criticalFindings: number;
    reportUrl: string;
    baselineDelta: { health: number; complexity: number } | null;
    scannedAt: string;
    repo: string;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { repoUrl, org = "personal", token, failOnPolicy = true, baselineCompare = true } = body;

        if (!repoUrl) return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });

        const { allowed } = await checkRateLimit(org, 60, 10);
        if (!allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

        const parsed = parseRepoUrl(repoUrl);
        if (!parsed) return NextResponse.json({ error: "Invalid repository URL" }, { status: 400 });

        const repoRef = `${parsed.owner}/${parsed.repo}`;

        // Fetch & analyze
        let repoData;
        try {
            repoData = await fetchRepoData(repoUrl, token);
        } catch (e) {
            if (e instanceof GitHubFetchError) {
                return NextResponse.json({ error: e.message }, { status: e.status });
            }
            throw e;
        }

        const report = detectStack(repoData, repoUrl);
        report.scanId = crypto.randomUUID();
        report.scannedAt = new Date().toISOString();

        // Policy evaluation
        const policy = await getPolicy(org);
        const violations: string[] = [];

        if (policy.requireCi && report.signals.workflowCount === 0) {
            violations.push("No CI workflow detected (policy requires automated CI)");
        }
        if (policy.requireTestEvidence && report.signals.testSignals === 0) {
            violations.push("No test evidence detected (policy requires test coverage)");
        }
        if (report.signals.dependencyCount > policy.maxDependencies) {
            violations.push(`Dependency count ${report.signals.dependencyCount} exceeds budget of ${policy.maxDependencies}`);
        }
        if (report.complexityScore > policy.maxComplexity) {
            violations.push(`Complexity score ${report.complexityScore} exceeds budget of ${policy.maxComplexity}`);
        }

        const criticalFindings = report.findings.filter((f) => f.severity === "critical" || f.severity === "high").length;
        const pass = !failOnPolicy || violations.length === 0;

        // Baseline delta comparison
        let baselineDelta = null;
        if (baselineCompare) {
            const history = await listScansByRepo(org, repoRef, 2);
            if (history.length >= 2) {
                const prev = history[1];
                baselineDelta = {
                    health: report.healthScore - prev.report.healthScore,
                    complexity: report.complexityScore - prev.report.complexityScore,
                };
            }
        }

        // Persist
        await saveScan({ id: report.scanId!, organization: org, repository: repoRef, scannedAt: report.scannedAt!, report });
        log.info("CI scan complete", { org, repo: repoRef, pass, violations: violations.length });

        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "https://archscope.dev";
        const result: CIResult = {
            pass,
            score: report.healthScore,
            healthScore: report.healthScore,
            complexityScore: report.complexityScore,
            deliveryRisk: report.deliveryRisk,
            violations,
            criticalFindings,
            reportUrl: `${origin}/report/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`,
            baselineDelta,
            scannedAt: report.scannedAt!,
            repo: repoRef,
        };

        return NextResponse.json(result, { status: pass ? 200 : 422 });
    } catch (error) {
        log.error("CI scan error", { error: String(error) });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
