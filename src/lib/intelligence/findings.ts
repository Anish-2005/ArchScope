import { Finding, Recommendation, StackReport } from "../types";
import { RepoSignals } from "./signals";

/**
 * Flags evidence-based gaps in the scanned repository and pairs each one
 * with an actionable recommendation.
 */
export function buildFindings(
    report: StackReport,
    signals: RepoSignals
): { findings: Finding[]; recommendations: Recommendation[] } {
    const { has, dependencyCount, workflowCount, testSignals, mlDependencies } = signals;

    const findings: Finding[] = [];
    const recommendations: Recommendation[] = [];

    const add = (severity: Finding["severity"], category: Finding["category"], title: string, detail: string, priority: Recommendation["priority"], action: string) => {
        findings.push({ id: `${category}-${findings.length}`, severity, category, title, detail });
        recommendations.push({ title: action, detail, priority });
    };

    if (!workflowCount) add("medium", "delivery", "No CI workflow detected", "No GitHub Actions workflow was found in the scanned tree.", "now", "Add a protected CI quality gate");
    if (!testSignals) add("high", "delivery", "No test evidence detected", "No conventional test paths or test-file signatures were found.", "now", "Establish a test baseline");
    if (!has("security.md") && !has(".github/dependabot")) add("medium", "security", "Dependency governance is not visible", "No SECURITY.md or Dependabot configuration was detected.", "next", "Automate dependency hygiene");
    if (dependencyCount > 80) add("medium", "architecture", "High dependency surface", `${dependencyCount} declared dependencies increase upgrade and supply-chain coordination cost.`, "next", "Review dependency ownership");
    if (report.languages.length > 5) add("medium", "architecture", "Broad language footprint", `${report.languages.length} languages were detected; use explicit boundaries and shared standards.`, "next", "Define platform boundaries");
    if (mlDependencies.length && !has("model") && !has("notebooks")) add("low", "ml", "ML library detected without visible model assets", `Detected: ${mlDependencies.join(", ")}. Model and experiment governance may live outside this repository.`, "later", "Document model lifecycle controls");
    if (has(".env") && !has(".env.example")) add("low", "security", "Environment contract is not visible", "Environment files were detected without an accompanying example contract.", "later", "Publish a safe environment template");
    if (!findings.length) findings.push({ id: "baseline", severity: "info", category: "architecture", title: "Healthy baseline signals", detail: "No high-confidence gaps were found from the available static repository evidence." });

    return { findings, recommendations };
}
