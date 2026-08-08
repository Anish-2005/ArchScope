import { GitHubRepoData, GitHubFetchError } from "../types";
import {
    parseRequirementsTxt,
    parsePyprojectToml,
    parseGoMod,
    parseCargoToml,
    parsePomXml,
} from "../manifests";
import { sampleSources } from "../sample-sources";

export async function fetchGitHub(owner: string, repo: string, token?: string): Promise<GitHubRepoData> {
    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "ArchScope",
    };
    const effectiveToken = token || process.env.GITHUB_TOKEN;
    if (effectiveToken) headers.Authorization = `Bearer ${effectiveToken}`;

    const check = async (res: Response, ctx: string) => {
        if (res.ok) return;
        const remaining = res.headers.get("x-ratelimit-remaining");
        const reset = res.headers.get("x-ratelimit-reset");
        const msg = res.status === 404
            ? `Repository not found: ${owner}/${repo}`
            : res.status === 403
                ? `GitHub API rate limit reached${remaining === "0" && reset ? ` (resets at ${new Date(Number(reset) * 1000).toLocaleString()})` : ""}`
                : res.status === 401
                    ? "GitHub authentication failed — check your token"
                    : `GitHub API error ${res.status}`;
        throw new GitHubFetchError(`${ctx}: ${msg}`, res.status);
    };

    const base = "https://api.github.com";
    const metaRes = await fetch(`${base}/repos/${owner}/${repo}`, { headers });
    await check(metaRes, "Metadata");
    const metadata = await metaRes.json();

    const langRes = await fetch(metadata.languages_url, { headers });
    await check(langRes, "Languages");
    const languages = Object.keys(await langRes.json());

    const branch = metadata.default_branch;
    const treeRes = await fetch(`${base}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers });
    await check(treeRes, "Tree");
    const treeData = await treeRes.json();
    const files: string[] = treeData.tree ? treeData.tree.map((t: { path: string }) => t.path) : [];

    const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;
    const fetchRaw = async (path: string) => {
        const r = await fetch(`${rawBase}/${path}`);
        return r.ok ? r.text() : null;
    };

    const dependencies: Record<string, string> = {};

    // Node / Bun
    if (files.includes("package.json")) {
        const pkg = await fetchRaw("package.json").then((t) => (t ? JSON.parse(t) : {}));
        Object.assign(dependencies, pkg.dependencies || {}, pkg.devDependencies || {});
    }

    // Python
    if (files.includes("requirements.txt")) {
        const t = await fetchRaw("requirements.txt");
        if (t) Object.assign(dependencies, parseRequirementsTxt(t));
    }
    const pyproject = files.find((f) => f === "pyproject.toml");
    if (pyproject) {
        const t = await fetchRaw(pyproject);
        if (t) Object.assign(dependencies, parsePyprojectToml(t));
    }
    const pipfile = files.find((f) => f.toLowerCase() === "pipfile");
    if (pipfile) {
        const t = await fetchRaw(pipfile);
        if (t) Object.assign(dependencies, parseRequirementsTxt(t));
    }

    // Go
    if (files.includes("go.mod")) {
        const t = await fetchRaw("go.mod");
        if (t) Object.assign(dependencies, parseGoMod(t));
    }

    // Rust
    if (files.includes("Cargo.toml")) {
        const t = await fetchRaw("Cargo.toml");
        if (t) Object.assign(dependencies, parseCargoToml(t));
    }

    // Java/Kotlin
    if (files.some((f) => f === "pom.xml")) Object.assign(dependencies, parsePomXml(files));

    // Monorepo: scan sub-package.jsons in packages/ apps/ services/
    const subManifests = files.filter(
        (f) => /^(packages|apps|services)\/[^/]+\/package\.json$/.test(f)
    ).slice(0, 10);
    await Promise.all(
        subManifests.map(async (manifest) => {
            const t = await fetchRaw(manifest);
            if (t) {
                const pkg = JSON.parse(t);
                Object.assign(dependencies, pkg.dependencies || {}, pkg.devDependencies || {});
            }
        })
    );

    const sourceSamples = await sampleSources(files, fetchRaw);

    return {
        metadata: {
            name: metadata.name,
            owner: { login: metadata.owner.login },
            description: metadata.description,
            stargazers_count: metadata.stargazers_count,
            languages_url: metadata.languages_url,
            default_branch: metadata.default_branch,
        },
        languages,
        files,
        dependencies,
        sourceSamples,
        platform: "github",
    };
}
