import { GitHubRepoData } from "../github";
import { ML_PACKAGES } from "./ml";

export interface RepoSignals {
    files: string[];
    has: (value: string) => boolean;
    dependencyCount: number;
    workflowCount: number;
    testSignals: number;
    documentationScore: number;
    mlDependencies: string[];
    patterns: string[];
}

/**
 * Derives all static repository evidence used by the intelligence model.
 * Kept pure so findings and scoring share a single source of truth.
 */
export function computeSignals(repoData: GitHubRepoData): RepoSignals {
    const files = repoData.files.map((file) => file.toLowerCase());
    const dependencies = Object.keys(repoData.dependencies).map((dependency) => dependency.toLowerCase());
    const has = (value: string) => files.some((file) => file.includes(value));

    const dependencyCount = dependencies.length;
    const workflowCount = files.filter((file) => file.startsWith(".github/workflows/") && /\.(yml|yaml)$/.test(file)).length;
    const testSignals = files.filter((file) => /(^|\/)(__tests__|test|tests|spec)(\/|\.|$)/.test(file) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(file)).length;
    const documentationScore = ["readme", "docs/", "adr", "architecture", "contributing", "security.md"].filter(has).length;
    const mlDependencies = dependencies.filter((dependency) => ML_PACKAGES.some((ml) => dependency === ml || dependency.includes(ml)));

    const patterns = [
        has("apps/") || has("packages/") ? "Monorepo" : "",
        has("dockerfile") ? "Containerized" : "",
        has("terraform") || has("pulumi") || has("k8s") || has("helm/") ? "Infrastructure as Code" : "",
        workflowCount > 0 ? "Continuous Integration" : "",
        mlDependencies.length > 0 || has("notebooks/") || has("models/") ? "Machine Learning" : "",
        has("openapi") || has("swagger") ? "API Contract" : "",
    ].filter(Boolean);

    return {
        files,
        has,
        dependencyCount,
        workflowCount,
        testSignals,
        documentationScore,
        mlDependencies,
        patterns,
    };
}
