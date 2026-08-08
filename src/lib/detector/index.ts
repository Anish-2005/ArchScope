import { StackReport } from "../types";
import { GitHubRepoData } from "../vcs";
import { calculateComplexity } from "../complexity";
import { buildIntelligence } from "../intelligence";
import { RULES } from "./rules";

export { RULES } from "./rules";

export function detectStack(repoData: GitHubRepoData, url: string): StackReport {
    const result: Partial<StackReport> = {
        languages: repoData.languages,
        frameworks: [],
        frontend: [],
        backend: [],
        database: [],
        infrastructure: [],
        devtools: [],
        repo: {
            name: repoData.metadata.name,
            owner: repoData.metadata.owner.login,
            url,
            description: repoData.metadata.description,
            stars: repoData.metadata.stargazers_count,
        },
    };

    const allDetected = new Set<string>();
    const depKeys = Object.keys(repoData.dependencies).map((k) => k.toLowerCase());
    const lowerFiles = repoData.files.map((f) => f.toLowerCase());

    const hasFile = (pattern: string) => lowerFiles.some((f) => f.includes(pattern.toLowerCase()));
    const hasDep = (dep: string) => depKeys.includes(dep.toLowerCase()) || depKeys.some((d) => d.startsWith(dep.toLowerCase()));

    for (const rule of RULES) {
        let matched = false;

        if (rule.matchDependencies) {
            if (rule.matchDependencies.some((d) => hasDep(d))) matched = true;
        }

        if (!matched && rule.matchFiles) {
            if (rule.matchFiles.some((f) => hasFile(f))) matched = true;
        }

        if (matched && !allDetected.has(rule.name)) {
            allDetected.add(rule.name);
            result[rule.category]!.push(rule.name);

            if (["frontend", "backend"].includes(rule.category)) {
                result.frameworks!.push(rule.name);
            }
        }
    }

    const report = result as StackReport;
    report.complexityScore = calculateComplexity(report);
    Object.assign(report, buildIntelligence(report, repoData));

    return report;
}
