import { StackReport } from "../types";

type Graph = StackReport["architectureGraph"];

const nodeForPath = (path: string): Graph["nodes"][number]["id"] => {
    if (/(prisma|migrations|database|models)\//.test(path)) return "data";
    if (/(api|server|services)\//.test(path)) return "services";
    if (/(\.github\/workflows|pipeline|ci)\//.test(path)) return "delivery";
    if (/(models|notebooks|ml|training)\//.test(path)) return "ml";
    return "application";
};

/**
 * Builds a coarse architecture graph by mapping sampled source imports
 * between known layers (application, service, data, delivery, ml).
 */
export function buildArchitectureGraph(
    files: string[],
    patterns: string[],
    hasMl: boolean,
    sourceSamples: Record<string, string>
): Graph {
    const has = (value: string) => files.some((file) => file.includes(value));

    const nodes: Graph["nodes"] = [{ id: "repository", label: "Repository", kind: "application" }];
    const edges: Graph["edges"] = [];

    const add = (id: Graph["nodes"][number]["id"], label: string, kind: Graph["nodes"][number]["kind"], edgeLabel: string) => {
        nodes.push({ id, label, kind });
        edges.push({ from: "repository", to: id, label: edgeLabel });
    };

    if (has("src/") || has("app/") || has("apps/")) add("application", "Application layer", "application", "implements");
    if (has("api/") || has("server/") || has("services/")) add("services", "Service/API layer", "service", "exposes");
    if (has("prisma/") || has("migrations/") || has("database/") || has("models/")) add("data", "Data layer", "data", "persists to");
    if (has(".github/workflows/") || patterns.includes("Continuous Integration")) add("delivery", "Delivery pipeline", "delivery", "validates");
    if (hasMl || patterns.includes("Machine Learning")) add("ml", "ML capability", "ml", "operates");

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
