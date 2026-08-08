import { StackReport } from "./types";
import { GitHubRepoData } from "./vcs";

export const EMPTY_METADATA = {
    name: "demo",
    owner: { login: "acme" },
    description: "Test repository",
    stargazers_count: 12,
    languages_url: "",
    default_branch: "main",
};

export function makeRepoData(overrides: Partial<GitHubRepoData> = {}): GitHubRepoData {
    return {
        metadata: EMPTY_METADATA,
        languages: ["TypeScript"],
        files: [],
        dependencies: {},
        sourceSamples: {},
        platform: "github",
        ...overrides,
    };
}

export function baseReport(overrides: Partial<StackReport> = {}): StackReport {
    return {
        languages: ["TypeScript"],
        frameworks: [],
        frontend: [],
        backend: [],
        database: [],
        infrastructure: [],
        devtools: [],
        complexityScore: 0,
        healthScore: 100,
        deliveryRisk: "low",
        mlReadiness: 0,
        signals: {
            fileCount: 0,
            dependencyCount: 0,
            workflowCount: 0,
            testSignals: 0,
            documentationScore: 0,
            architecturePatterns: [],
        },
        findings: [],
        recommendations: [],
        architectureGraph: { nodes: [], edges: [] },
        repo: {
            name: "astro-copy",
            owner: "acme",
            url: "https://github.com/acme/repo",
            description: "Demo repository",
            stars: 12,
        },
        ...overrides,
    };
}