export interface GitHubMetadata {
    name: string;
    owner: {
        login: string;
    };
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
}

export class GitHubFetchError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "GitHubFetchError";
        this.status = status;
    }
}

const GITHUB_API = "https://api.github.com";
const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ArchScope",
};

if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

function normalizeRepoName(repo: string): string {
    return repo.replace(/\.git$/i, "").trim();
}

function mapGitHubErrorMessage(status: number): string {
    if (status === 404) {
        return "Repository not found. Check owner/repo and ensure it is a public repository.";
    }
    if (status === 403) {
        return "GitHub API rate limit reached. Please try again shortly or set GITHUB_TOKEN.";
    }
    if (status === 401) {
        return "GitHub authentication failed. Check your GITHUB_TOKEN configuration.";
    }
    return `GitHub API request failed with status ${status}.`;
}

function getRateLimitResetHint(response: Response): string {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");

    if (remaining !== "0" || !reset) return "";

    const epoch = Number(reset);
    if (!Number.isFinite(epoch)) return "";

    const resetAt = new Date(epoch * 1000).toLocaleString();
    return ` Rate limit resets at ${resetAt}.`;
}

async function ensureGitHubOk(response: Response, context: string): Promise<void> {
    if (response.ok) return;

    const baseMessage = mapGitHubErrorMessage(response.status);
    const rateLimitHint = response.status === 403 ? getRateLimitResetHint(response) : "";
    throw new GitHubFetchError(`${context}: ${baseMessage}${rateLimitHint}`, response.status);
}

export async function parseGitHubUrl(url: string): Promise<{ owner: string; repo: string } | null> {
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.toLowerCase();
        if (hostname !== "github.com" && hostname !== "www.github.com") return null;
        const parts = parsed.pathname.split("/").filter(Boolean);
        if (parts.length < 2) return null;
        const owner = parts[0].trim();
        const repo = normalizeRepoName(parts[1]);
        if (!owner || !repo) return null;
        return { owner, repo };
    } catch {
        return null;
    }
}

export async function fetchGitHubData(owner: string, repo: string): Promise<GitHubRepoData> {
    const normalizedRepo = normalizeRepoName(repo);

    // 1. Fetch repo metadata
    const metaRes = await fetch(`${GITHUB_API}/repos/${owner}/${normalizedRepo}`, { headers });
    await ensureGitHubOk(metaRes, "Metadata fetch failed");
    const metadata = await metaRes.json();

    // 2. Fetch languages
    const langRes = await fetch(metadata.languages_url, { headers });
    await ensureGitHubOk(langRes, "Languages fetch failed");
    const langsMap = await langRes.json();
    const languages = Object.keys(langsMap);

    // 3. Fetch file tree
    const defaultBranch = metadata.default_branch;
    const treeRes = await fetch(`${GITHUB_API}/repos/${owner}/${normalizedRepo}/git/trees/${defaultBranch}?recursive=1`, { headers });
    await ensureGitHubOk(treeRes, "Repository tree fetch failed");
    const treeData = await treeRes.json();
    const files = treeData.tree ? treeData.tree.map((t: { path: string }) => t.path) : [];

    // 4. Try fetching package.json or other dependency files if present
    const dependencies: Record<string, string> = {};
    if (files.includes("package.json")) {
        const pkgRes = await fetch(`https://raw.githubusercontent.com/${owner}/${normalizedRepo}/${defaultBranch}/package.json`);
        if (pkgRes.ok) {
            const pkg = await pkgRes.json();
            Object.assign(dependencies, pkg.dependencies || {}, pkg.devDependencies || {});
        }
    }

    // Add additional logic here for requirements.txt, go.mod, etc if needed.
    if (files.includes("requirements.txt")) {
        const reqRes = await fetch(`https://raw.githubusercontent.com/${owner}/${normalizedRepo}/${defaultBranch}/requirements.txt`);
        if (reqRes.ok) {
            const reqText = await reqRes.text();
            reqText.split('\n').forEach(line => {
                if (line && !line.startsWith('#')) {
                    const dep = line.split(/[=>~]/)[0].trim();
                    if (dep) dependencies[dep] = "*";
                }
            });
        }
    }

    if (files.includes("go.mod")) {
        const goRes = await fetch(`https://raw.githubusercontent.com/${owner}/${normalizedRepo}/${defaultBranch}/go.mod`);
        if (goRes.ok) {
            const goText = await goRes.text();
            goText.split('\n').forEach(line => {
                if (line.trim().startsWith('require')) {
                    // rudimentary parsing
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 2) dependencies[parts[1]] = "*";
                }
            });
        }
    }

    return { metadata, languages, files, dependencies };
}
