import { ArchitecturePolicy, StackReport } from "./types";

export type PolicyViolationCode = "ci" | "tests" | "dependencies" | "complexity";

export interface PolicyViolation {
    code: PolicyViolationCode;
    detail: string;
    severity: "high" | "medium";
    category: "delivery" | "architecture";
}

/**
 * Evaluates a scanned report against an organization's architecture policy.
 * Returns structured violations; each caller formats its own output
 * (findings, CI violation strings, or PR comment content).
 */
export function evaluatePolicy(report: StackReport, policy: ArchitecturePolicy): PolicyViolation[] {
    const violations: PolicyViolation[] = [];

    if (policy.requireCi && report.signals.workflowCount === 0) {
        violations.push({
            code: "ci",
            severity: "high",
            category: "delivery",
            detail: `The ${policy.organization} baseline requires an automated CI workflow (GitHub Actions, GitLab CI, or CircleCI).`,
        });
    }

    if (policy.requireTestEvidence && report.signals.testSignals === 0) {
        violations.push({
            code: "tests",
            severity: "high",
            category: "delivery",
            detail: `The ${policy.organization} baseline requires detectable test coverage conventions.`,
        });
    }

    if (report.signals.dependencyCount > policy.maxDependencies) {
        violations.push({
            code: "dependencies",
            severity: "medium",
            category: "architecture",
            detail: `Dependency count ${report.signals.dependencyCount} exceeds the configured budget of ${policy.maxDependencies}.`,
        });
    }

    if (report.complexityScore > policy.maxComplexity) {
        violations.push({
            code: "complexity",
            severity: "medium",
            category: "architecture",
            detail: `Complexity score ${report.complexityScore} exceeds the configured budget of ${policy.maxComplexity}.`,
        });
    }

    return violations;
}

export const violationIsBudget = (v: PolicyViolation) => v.code === "dependencies" || v.code === "complexity";
