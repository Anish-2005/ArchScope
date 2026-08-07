import { Finding, Recommendation, StackReport } from "./types";
import { GitHubRepoData } from "./github";

const ML_PACKAGES = ["tensorflow", "@tensorflow/tfjs", "torch", "pytorch", "scikit-learn", "sklearn", "transformers", "langchain", "openai", "@google/generative-ai", "mlflow", "pandas", "numpy"];

/**
 * An explainable signal model for static repository intelligence. Scores are
 * intentionally derived from visible repository evidence, never hidden data.
 */
export function buildIntelligence(report: StackReport, repoData: GitHubRepoData) {
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

    // Logistic-style signal model. This is deterministic and explainable rather than a black-box claim.
    const pressure = Math.min(100, Math.round(14 + report.complexityScore * 0.52 + Math.min(dependencyCount, 120) * 0.16 + report.languages.length * 2.5 - workflowCount * 7 - Math.min(testSignals, 12) * 2.3 - documentationScore * 3));
    const healthScore = Math.max(0, Math.min(100, 100 - pressure + (patterns.includes("Infrastructure as Code") ? 5 : 0)));
    const mlReadiness = Math.max(0, Math.min(100, Math.round((mlDependencies.length ? 35 : 0) + (has("data/") ? 18 : 0) + (has("models/") ? 20 : 0) + (has("notebooks/") ? 12 : 0) + (workflowCount ? 8 : 0) + (has("dockerfile") ? 7 : 0))));

    return {
        healthScore,
        deliveryRisk: pressure >= 65 ? "high" as const : pressure >= 38 ? "medium" as const : "low" as const,
        mlReadiness,
        signals: { fileCount: files.length, dependencyCount, workflowCount, testSignals, documentationScore, architecturePatterns: patterns },
        findings,
        recommendations: recommendations.slice(0, 5),
        architectureGraph: buildArchitectureGraph(files, patterns, mlDependencies.length > 0, repoData.sourceSamples),
    };
}

function buildArchitectureGraph(files: string[], patterns: string[], hasMl: boolean, sourceSamples: Record<string, string>) {
    const has = (value: string) => files.some((file) => file.includes(value));
    const nodes: StackReport["architectureGraph"]["nodes"] = [{ id: "repository", label: "Repository", kind: "application" }];
    const edges: StackReport["architectureGraph"]["edges"] = [];
    const add = (id: string, label: string, kind: StackReport["architectureGraph"]["nodes"][number]["kind"], edgeLabel: string) => {
        nodes.push({ id, label, kind }); edges.push({ from: "repository", to: id, label: edgeLabel });
    };
    if (has("src/") || has("app/") || has("apps/")) add("application", "Application layer", "application", "implements");
    if (has("api/") || has("server/") || has("services/")) add("services", "Service/API layer", "service", "exposes");
    if (has("prisma/") || has("migrations/") || has("database/") || has("models/")) add("data", "Data layer", "data", "persists to");
    if (has(".github/workflows/") || patterns.includes("Continuous Integration")) add("delivery", "Delivery pipeline", "delivery", "validates");
    if (hasMl || patterns.includes("Machine Learning")) add("ml", "ML capability", "ml", "operates");
    const nodeForPath = (path: string) => {
        if (/(prisma|migrations|database|models)\//.test(path)) return "data";
        if (/(api|server|services)\//.test(path)) return "services";
        if (/(\.github\/workflows|pipeline|ci)\//.test(path)) return "delivery";
        if (/(models|notebooks|ml|training)\//.test(path)) return "ml";
        return "application";
    };
    const observed = new Map<string, number>();
    for (const [path, source] of Object.entries(sourceSamples)) {
        const from = nodeForPath(path.toLowerCase());
        const imports = source.matchAll(/(?:from\s+|require\(|import\s+)['"]([^'"]+)['"]/g);
        for (const match of imports) {
            const specifier = match[1].toLowerCase();
            const to = nodeForPath(specifier);
            if (from !== to && nodes.some((node) => node.id === from) && nodes.some((node) => node.id === to)) {
                const key = `${from}:${to}`;
                observed.set(key, (observed.get(key) || 0) + 1);
            }
        }
    }
    for (const [key, count] of observed) {
        const [from, to] = key.split(":");
        edges.push({ from, to, label: `${count} sampled imports` });
    }
    return { nodes, edges };
}
