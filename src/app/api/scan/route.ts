import { NextResponse } from 'next/server';
import { parseRepoUrl, fetchRepoData, GitHubFetchError } from '@/lib/vcs';
import { detectStack } from '@/lib/detector';
import { getCache, setCache, getPolicy, saveScan, checkRateLimit } from '@/lib/redis';
import { getSessionFromRequest } from '@/lib/auth';
import { log, withTiming } from '@/lib/observability';
import { evaluatePolicy, violationIsBudget } from '@/lib/policy';
import crypto from 'crypto';
import { StackReport } from '@/lib/types';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { repoUrl, organization: requestedOrganization, token } = body;

        // Determine org from session cookie first, then body param
        const nextReq = req as unknown as import("next/server").NextRequest;
        const session = getSessionFromRequest(nextReq);
        const organization = session?.org
            ?? (typeof requestedOrganization === "string" && /^[a-z0-9-]{1,48}$/i.test(requestedOrganization)
                ? requestedOrganization.toLowerCase()
                : "personal");

        if (!repoUrl) {
            return NextResponse.json({ error: 'repoUrl is required' }, { status: 400 });
        }

        // Rate limiting: 10 scans per minute per org
        const { allowed, remaining } = await checkRateLimit(organization, 60, 10);
        if (!allowed) {
            log.warn("Rate limit exceeded", { organization });
            return NextResponse.json(
                { error: 'Rate limit exceeded. Maximum 10 scans per minute per organization.' },
                { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
            );
        }

        // Validate URL — support github/gitlab/bitbucket
        const parsed = parseRepoUrl(repoUrl);
        if (!parsed) {
            return NextResponse.json(
                { error: 'Invalid repository URL. Provide a GitHub, GitLab, or Bitbucket repository URL.' },
                { status: 400 }
            );
        }

        const repoRef = `${parsed.owner}/${parsed.repo}`;
        const hash = crypto.createHash('sha256').update(`${parsed.platform}:${repoRef}`).digest('hex').substring(0, 16);
        const cacheKey = `archscope:v3:${hash}`;

        // 1. Check Redis cache
        try {
            const cached = await getCache<StackReport>(cacheKey);
            if (cached) {
                const scanId = crypto.randomUUID();
                const scannedAt = new Date().toISOString();
                const report = { ...cached, scanId, scannedAt };
                await saveScan({ id: scanId, organization, repository: repoRef, scannedAt, report });
                log.info("Cache hit", { org: organization, repo: repoRef, platform: parsed.platform });
                return NextResponse.json({ ...report, cached: true });
            }
        } catch (e) {
            log.warn("Cache read failed", { error: String(e) });
        }

        // 2. Fetch from VCS provider
        let repoData;
        try {
            repoData = await withTiming("vcs.fetch", () => fetchRepoData(repoUrl, token));
        } catch (e) {
            if (e instanceof GitHubFetchError) {
                return NextResponse.json({ error: e.message }, { status: e.status });
            }
            throw e;
        }

        // 3. Detect stack
        const report = detectStack(repoData, repoUrl);
        report.scanId = crypto.randomUUID();
        report.scannedAt = new Date().toISOString();

        // 4. Policy evaluation
        const policy = await getPolicy(organization);
        const violations = evaluatePolicy(report, policy);

        for (const violation of violations.filter((v) => !violationIsBudget(v))) {
            report.findings.unshift({
                id: `policy-${violation.code}`,
                severity: violation.severity,
                category: violation.category,
                title: violation.code === "ci" ? "Policy breach: CI required" : "Policy breach: test evidence required",
                detail: violation.detail,
            });
        }
        if (violations.some(violationIsBudget)) {
            report.findings.unshift({
                id: "policy-budget",
                severity: "medium",
                category: "architecture",
                title: "Policy budget exceeded",
                detail: "This repository exceeds the organization's configured dependency or complexity budget."
            });
        }

        // 5. Persist
        await saveScan({ id: report.scanId!, organization, repository: repoRef, scannedAt: report.scannedAt!, report });
        log.info("Scan complete", { org: organization, repo: repoRef, platform: parsed.platform, health: report.healthScore });

        // 6. Cache for 6 hours
        try {
            await setCache(cacheKey, report, 21600);
        } catch (e) {
            log.warn("Cache write failed", { error: String(e) });
        }

        return NextResponse.json(
            { ...report, cached: false },
            { headers: { 'X-RateLimit-Remaining': String(remaining) } }
        );

    } catch (error) {
        log.error('Scan Error', { error: String(error) });
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
