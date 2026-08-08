/**
 * Unified VCS adapter — supports GitHub (public + private), GitLab, and Bitbucket.
 * All providers return the same GitHubRepoData-compatible shape so downstream
 * detector logic requires zero changes.
 */

import { GitHubRepoData, GitHubFetchError, ParsedRepo, GitHubMetadata } from "./types";
import { fetchGitHub } from "./providers/github";
import { fetchGitLab } from "./providers/gitlab";
import { fetchBitbucket } from "./providers/bitbucket";

// URL Parsing
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

// Public Entry Point
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

// Manifest Parsers
export { parseRequirementsTxt, parseGoMod, parseCargoToml, parsePomXml, parsePyprojectToml } from "./manifests";

// Types
export type { GitHubMetadata, GitHubRepoData, ParsedRepo };
export { GitHubFetchError };
