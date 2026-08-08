import { GitHubRepoData, GitHubFetchError } from "../types";
import { parseRequirementsTxt, parseGoMod, parseCargoToml } from "../manifests";
import { sampleSources } from "../sample-sources";

export async function fetchGitLab(owner: string, repo: string, token?: string): Promise<GitHubRepoData> {
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
