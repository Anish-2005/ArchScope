import { NextResponse } from 'next/server';
import { parseGitHubUrl, fetchGitHubData, GitHubFetchError } from '@/lib/github';
import { detectStack } from '@/lib/detector';
import { getCache, setCache } from '@/lib/redis';
import crypto from 'crypto';
import { StackReport } from '@/lib/types';

export async function POST(req: Request) {
    try {
        const { repoUrl } = await req.json();

        if (!repoUrl) {
            return NextResponse.json({ error: 'repoUrl is required' }, { status: 400 });
        }

        const parsed = await parseGitHubUrl(repoUrl);
        if (!parsed) {
            return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
        }

        const repoRef = `${parsed.owner}/${parsed.repo}`;
        // Create cache key `archscope:{hash}`
        const hash = crypto.createHash('sha256').update(repoRef).digest('hex').substring(0, 16);
        const cacheKey = `archscope:v2:${hash}`;

        // 1. Check Redis cache
        try {
            const cached = await getCache<StackReport>(cacheKey);
            if (cached) {
                return NextResponse.json({ ...cached, cached: true });
            }
        } catch (e) {
            console.warn("Cache read failed", e);
        }

        // 2. Fetch from GitHub
        let repoData;
        try {
            repoData = await fetchGitHubData(parsed.owner, parsed.repo);
        } catch (e) {
            if (e instanceof GitHubFetchError) {
                return NextResponse.json({ error: e.message }, { status: e.status });
            }
            throw e;
        }

        // 3. Detect stack
        const report = detectStack(repoData, repoUrl);

        // 4. Cache the result for 6 hours (21600 seconds)
        try {
            await setCache(cacheKey, report, 21600);
        } catch (e) {
            console.warn("Cache write failed", e);
        }

        return NextResponse.json({ ...report, cached: false });

    } catch (error) {
        console.error('Scan Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
