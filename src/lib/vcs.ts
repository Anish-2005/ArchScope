/**
 * Unified VCS adapter — supports GitHub (public + private), GitLab, and Bitbucket.
 * All providers return the same GitHubRepoData-compatible shape so downstream
 * detector.ts logic requires zero changes.
 */

export interface GitHubMetadata {
    name: string;
    owner: { login: string };
    description: string | null;
    stargazers_count: number;
    languages_url: string;
    default_branch: string;
}

export interface GitHubRepoData {
    metadata: GitHubMetadata;
    languages: string[];
    files: string[];
    dependencies: Record<string, string>;
    sourceSamples: Record<string, string>;
    platform: "github" | "gitlab" | "bitbucket";
}

export class GitHubFetchError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "GitHubFetchError";
        this.status = status;
    }
}

// ─── URL Parsing ────────────────────────────────────────────────────────────────
export interface ParsedRepo {
    platform: "github" | "gitlab" | "bitbucket";
    owner: string;
    repo: string;
}

export function parseRepoUrl(url: string): ParsedRepo | null {
    try {
        const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
        const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
        const parts = parsed.pathname.split("/").filter(Boolean);
        if (parts.length < 2) return null;
        const owner = parts[0];
        const repo = parts[1].replace(/\.git$/i, "");
        if (host === "github.com") return { platform: "github", owner, repo };
        if (host === "gitlab.com") return { platform: "gitlab", owner, repo };
        if (host === "bitbucket.org") return { platform: "bitbucket", owner, repo };
        return null;
    } catch {
        return null;
    }
}

/** Legacy GitHub-only URL parse for backwards compat */
export async function parseGitHubUrl(url: string): Promise<{ owner: string; repo: string } | null> {
    const parsed = parseRepoUrl(url);
    if (!parsed || parsed.platform !== "github") return null;
    return { owner: parsed.owner, repo: parsed.repo };
}

// ─── Manifest Parsers ───────────────────────────────────────────────────────────
export function parseRequirementsTxt(text: string): Record<string, string> {
    const deps: Record<string, string> = {};
    text.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("-")) return;
        const dep = trimmed.split(/[=><~!;]/)[0].trim();
        if (dep) deps[dep.toLowerCase()] = "*";
    });
    return deps;
}

export function parseGoMod(text: string): Record<string, string> {
    const deps: Record<string, string> = {};
    const requireBlock = /require\s*\(([\s\S]*?)\)/g;
    const singleRequire = /^require\s+(\S+)\s+(\S+)/gm;
    let m;
    while ((m = requireBlock.exec(text)) !== null) {
        const block = m[1];
        block.split("\n").forEach((line) => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2 && !parts[0].startsWith("//")) deps[parts[0]] = parts[1];
        });
    }
    while ((m = singleRequire.exec(text)) !== null) deps[m[1]] = m[2];
    return deps;
}

export function parseCargoToml(text: string): Record<string, string> {
    const deps: Record<string, string> = {};
    const inDepsSection = /\[(?:dependencies|dev-dependencies|build-dependencies)\]([\s\S]*?)(?=\[|$)/g;
    let m;
    while ((m = inDepsSection.exec(text)) !== null) {
        m[1].split("\n").forEach((line) => {
            const parts = line.split("=");
            if (parts.length >= 2) {
                const key = parts[0].trim();
                if (key && !key.startsWith("#")) deps[key] = "*";
            }
        });
    }
    return deps;
}

function parsePomXml(files: string[]): Record<string, string> {
    // We signal Spring ecosystem from file presence only; XML parsing is deferred
    const deps: Record<string, string> = {};
    if (files.some((f) => f.includes("pom.xml"))) deps["spring-boot"] = "*";
    return deps;
}

export function parsePyprojectToml(text: string): Record<string, string> {
    const deps: Record<string, string> = {};
    const depSection = /\[(?:tool\.poetry\.dependencies|project\.dependencies)\]([\s\S]*?)(?=\[|$)/g;
    let m;
    while ((m = depSection.exec(text)) !== null) {
        m[1].split("\n").forEach((line) => {
            const parts = line.split("=");
            if (parts.length >= 2) {
                const key = parts[0].trim().toLowerCase();
                if (key && key !== "python" && !key.startsWith("#")) deps[key] = "*";
            }
        });
    }
    return deps;
}

// ─── Shared source sampling ─────────────────────────────────────────────────────
async function sampleSources(
    files: string[],
    rawFetcher: (path: string) => Promise<string | null>
): Promise<Record<string, string>> {
    const candidates = files
        .filter((f) => /\.(ts|tsx|js|jsx|py|go|java|cs|rs|rb)$/i.test(f) && !/(node_modules|dist|build|coverage|vendor|__pycache__)/.test(f))
        .slice(0, 48);
    const samples: Record<string, string> = {};
    await Promise.all(
        candidates.map(async (file) => {
            const text = await rawFetcher(file);
            if (text && text.length <= 180_000) samples[file] = text;
        })
    );
    return samples;
}

// ─── GitHub Provider ────────────────────────────────────────────────────────────
async function fetchGitHub(owner: string, repo: string, token?: string): Promise<GitHubRepoData> {
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
        let msg = res.status === 404
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

// ─── GitLab Provider ────────────────────────────────────────────────────────────
async function fetchGitLab(owner: string, repo: string, token?: string): Promise<GitHubRepoData> {
    const headers: Record<string, string> = { "User-Agent": "ArchScope" };
    const effectiveToken = token || process.env.GITLAB_TOKEN;
    if (effectiveToken) headers["PRIVATE-TOKEN"] = effectiveToken;

    const projectId = encodeURIComponent(`${owner}/${repo}`);
    const base = "https://gitlab.com/api/v4";

    const metaRes = await fetch(`${base}/projects/${projectId}`, { headers });
    if (!metaRes.ok) throw new GitHubFetchError(`GitLab: project not found (${metaRes.status})`, metaRes.status);
    const meta = await metaRes.json();

    const branch = meta.default_branch || "main";

    // Languages
    const langRes = await fetch(`${base}/projects/${projectId}/languages`, { headers });
    const langMap = langRes.ok ? await langRes.json() : {};
    const languages = Object.keys(langMap);

    // Tree
    const treeRes = await fetch(`${base}/projects/${projectId}/repository/tree?recursive=true&per_page=500`, { headers });
    const treeData = treeRes.ok ? await treeRes.json() : [];
    const files: string[] = treeData.map((f: { path: string }) => f.path);

    const fetchRaw = async (path: string) => {
        const r = await fetch(`${base}/projects/${projectId}/repository/files/${encodeURIComponent(path)}/raw?ref=${branch}`, { headers });
        return r.ok ? r.text() : null;
    };

    const dependencies: Record<string, string> = {};
    if (files.includes("package.json")) {
        const t = await fetchRaw("package.json");
        if (t) { const pkg = JSON.parse(t); Object.assign(dependencies, pkg.dependencies || {}, pkg.devDependencies || {}); }
    }
    if (files.includes("requirements.txt")) {
        const t = await fetchRaw("requirements.txt");
        if (t) Object.assign(dependencies, parseRequirementsTxt(t));
    }
    if (files.includes("go.mod")) {
        const t = await fetchRaw("go.mod");
        if (t) Object.assign(dependencies, parseGoMod(t));
    }
    if (files.includes("Cargo.toml")) {
        const t = await fetchRaw("Cargo.toml");
        if (t) Object.assign(dependencies, parseCargoToml(t));
    }

    const sourceSamples = await sampleSources(files, fetchRaw);

    return {
        metadata: {
            name: meta.path,
            owner: { login: meta.namespace?.path || owner },
            description: meta.description,
            stargazers_count: meta.star_count || 0,
            languages_url: "",
            default_branch: branch,
        },
        languages,
        files,
        dependencies,
        sourceSamples,
        platform: "gitlab",
    };
}

// ─── Bitbucket Provider ─────────────────────────────────────────────────────────
async function fetchBitbucket(owner: string, repo: string, token?: string): Promise<GitHubRepoData> {
    const headers: Record<string, string> = { "User-Agent": "ArchScope" };
    const effectiveToken = token || process.env.BITBUCKET_TOKEN;
    if (effectiveToken) headers.Authorization = `Bearer ${effectiveToken}`;

    const base = "https://api.bitbucket.org/2.0";
    const metaRes = await fetch(`${base}/repositories/${owner}/${repo}`, { headers });
    if (!metaRes.ok) throw new GitHubFetchError(`Bitbucket: repository not found (${metaRes.status})`, metaRes.status);
    const meta = await metaRes.json();
    const branch = meta.mainbranch?.name || "main";

    // Languages — Bitbucket doesn't expose language breakdown; use repo language field
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

// ─── Public Entry Point ─────────────────────────────────────────────────────────
export async function fetchRepoData(url: string, token?: string): Promise<GitHubRepoData> {
    const parsed = parseRepoUrl(url);
    if (!parsed) throw new GitHubFetchError("Unsupported repository URL. Provide a GitHub, GitLab, or Bitbucket URL.", 400);

    switch (parsed.platform) {
        case "github": return fetchGitHub(parsed.owner, parsed.repo, token);
        case "gitlab": return fetchGitLab(parsed.owner, parsed.repo, token);
        case "bitbucket": return fetchBitbucket(parsed.owner, parsed.repo, token);
    }
}

/** Legacy compat export */
export const fetchGitHubData = (owner: string, repo: string) =>
    fetchGitHub(owner, repo);
