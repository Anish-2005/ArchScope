import { StackReport } from "../types";
import { RepoSignals } from "./signals";

export interface IntelligenceScores {
    healthScore: number;
    deliveryRisk: "low" | "medium" | "high";
    mlReadiness: number;
}

/**
 * Logistic-style signal model. This is deterministic and explainable rather
 * than a black-box claim: every term maps to visible repository evidence.
 */
export function computeScores(report: StackReport, signals: RepoSignals): IntelligenceScores {
    const { has, dependencyCount, workflowCount, testSignals, documentationScore, mlDependencies, patterns } = signals;

    const pressure = Math.min(100, Math.round(
        14
        + report.complexityScore * 0.52
        + Math.min(dependencyCount, 120) * 0.16
        + report.languages.length * 2.5
        - workflowCount * 7
        - Math.min(testSignals, 12) * 2.3
        - documentationScore * 3
    ));

    const healthScore = Math.max(0, Math.min(100, 100 - pressure + (patterns.includes("Infrastructure as Code") ? 5 : 0)));
    const mlReadiness = Math.max(0, Math.min(100, Math.round(
        (mlDependencies.length ? 35 : 0)
        + (has("data/") ? 18 : 0)
        + (has("models/") ? 20 : 0)
        + (has("notebooks/") ? 12 : 0)
        + (workflowCount ? 8 : 0)
        + (has("dockerfile") ? 7 : 0)
    )));

    const deliveryRisk: IntelligenceScores["deliveryRisk"] = pressure >= 65 ? "high" : pressure >= 38 ? "medium" : "low";

    return { healthScore, deliveryRisk, mlReadiness };
}
