import { StackReport } from "../types";
import { GitHubRepoData } from "../github";
import { computeSignals } from "./signals";
import { buildFindings } from "./findings";
import { computeScores } from "./scoring";
import { buildArchitectureGraph } from "./graph";

export { ML_PACKAGES } from "./ml";
export { computeSignals } from "./signals";
export { buildFindings } from "./findings";
export { computeScores } from "./scoring";
export { buildArchitectureGraph } from "./graph";

/**
 * An explainable signal model for static repository intelligence. Scores are
 * intentionally derived from visible repository evidence, never hidden data.
 */
export function buildIntelligence(report: StackReport, repoData: GitHubRepoData) {
    const signals = computeSignals(repoData);
    const { findings, recommendations } = buildFindings(report, signals);
    const { healthScore, deliveryRisk, mlReadiness } = computeScores(report, signals);

    return {
        healthScore,
        deliveryRisk,
        mlReadiness,
        signals: {
            fileCount: signals.files.length,
            dependencyCount: signals.dependencyCount,
            workflowCount: signals.workflowCount,
            testSignals: signals.testSignals,
            documentationScore: signals.documentationScore,
            architecturePatterns: signals.patterns,
        },
        findings,
        recommendations: recommendations.slice(0, 5),
        architectureGraph: buildArchitectureGraph(signals.files, signals.patterns, signals.mlDependencies.length > 0, repoData.sourceSamples),
    };
}
