import { GitHubRepoData, GitHubFetchError } from "../types";
import { sampleSources } from "../sample-sources";

export async function fetchBitbucket(owner: string, repo: string, token?: string): Promise<GitHubRepoData> {
    const headers: Record<string, string> = { "User-Agent": "ArchScope" };
    const effectiveToken = token || process.env.BITBUCKET_TOKEN;
    if (effectiveToken) headers.Authorization = `Bearer ${effectiveToken}`;

    const base = "https://api.bitbucket.org/2.0";
    const metaRes = await fetch(`${base}/repositories/${owner}/${repo}`, { headers });
    if (!metaRes.ok) throw new GitHubFetchError(`Bitbucket: repository not found (${metaRes.status})`, metaRes.status);
    const meta = await metaRes.json();
    const branch = meta.mainbranch?.name || "main";

    // Bitbucket doesn't expose language breakdown; use repo language field
    const languages: string[] = meta.language ? [meta.language] : [];

    // File tree via src API
    const treeRes = await fetch(`${base}/repositories/${owner}/${repo}/src/${branch}/?pagelen=500`, { headers });
    const treeData = treeRes.ok ? await treeRes.json() : { values: [] };
    const files: string[] = (treeData.values || []).map((f: { path: string }) => f.path);

    const fetchRaw = async (path: string) => {
        const r = await fetch(`${base}/repositories/${owner}/${repo}/src/${branch}/${path}`, { headers });
        return r.ok ? r.text() : null;
    };

    const dependencies: Record<string, string> = {};
    if (files.includes("package.json")) {
        const t = await fetchRaw("package.json");
        if (t) { const pkg = JSON.parse(t); Object.assign(dependencies, pkg.dependencies || {}, pkg.devDependencies || {}); }
    }

    const sourceSamples = await sampleSources(files, fetchRaw);

    return {
        metadata: {
            name: meta.slug,
            owner: { login: owner },
            description: meta.description || null,
            stargazers_count: 0,
            languages_url: "",
            default_branch: branch,
        },
        languages,
        files,
        dependencies,
        sourceSamples,
        platform: "bitbucket",
    };
}
