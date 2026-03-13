export interface GitHubRepoData {
    metadata: any;
    languages: string[];
    files: string[];
    dependencies: Record<string, string>;
}

const GITHUB_API = "https://api.github.com";
const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

export async function parseGitHubUrl(url: string): Promise<{ owner: string; repo: string } | null> {
    try {
        const parsed = new URL(url);
        if (parsed.hostname !== "github.com") return null;
        const parts = parsed.pathname.split("/").filter(Boolean);
        if (parts.length < 2) return null;
        return { owner: parts[0], repo: parts[1] };
    } catch {
        return null;
    }
}

export async function fetchGitHubData(owner: string, repo: string): Promise<GitHubRepoData | null> {
    try {
        // 1. Fetch repo metadata
        const metaRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
        if (!metaRes.ok) throw new Error("Repo not found");
        const metadata = await metaRes.json();

        // 2. Fetch languages
        const langRes = await fetch(metadata.languages_url, { headers });
        const langsMap = await langRes.json();
        const languages = Object.keys(langsMap);

        // 3. Fetch file tree
        const defaultBranch = metadata.default_branch;
        const treeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
        const treeData = await treeRes.json();
        const files = treeData.tree ? treeData.tree.map((t: any) => t.path) : [];

        // 4. Try fetching package.json or other dependency files if present
        const dependencies: Record<string, string> = {};
        if (files.includes("package.json")) {
            const pkgRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/package.json`);
            if (pkgRes.ok) {
                const pkg = await pkgRes.json();
                Object.assign(dependencies, pkg.dependencies || {}, pkg.devDependencies || {});
            }
        }

        // Add additional logic here for requirements.txt, go.mod, etc if needed.
        if (files.includes("requirements.txt")) {
            const reqRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/requirements.txt`);
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
            const goRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/go.mod`);
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
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        return null;
    }
}
