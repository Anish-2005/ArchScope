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

export interface ParsedRepo {
    platform: "github" | "gitlab" | "bitbucket";
    owner: string;
    repo: string;
}

export class GitHubFetchError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "GitHubFetchError";
        this.status = status;
    }
}
