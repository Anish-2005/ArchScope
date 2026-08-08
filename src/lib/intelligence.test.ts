import { describe, expect, it } from "vitest";
import { buildIntelligence } from "./intelligence";
import { baseReport, makeRepoData } from "./test-utils";

describe("buildIntelligence", () => {
    it("flags missing CI and missing tests as top priorities", () => {
        const result = buildIntelligence(baseReport(), makeRepoData({ files: ["src/index.ts"] }));

        const titles = result.findings.map((f) => f.title);
        expect(titles).toContain("No CI workflow detected");
        expect(titles).toContain("No test evidence detected");
        expect(result.findings.find((f) => f.title === "No test evidence detected")?.severity).toBe("high");
        expect(result.recommendations[0].priority).toBe("now");
        expect(result.healthScore).toBeLessThan(100);
    });

    it("scores a healthy repo with CI, tests, and docs at low risk", () => {
        const repoData = makeRepoData({
            languages: ["TypeScript"],
            files: [
                ".github/workflows/ci.yml",
                "src/utils.ts",
                "src/utils.test.ts",
                "README.md",
                "docs/architecture.md",
                "SECURITY.md",
            ],
        });
        const report = baseReport({ languages: ["TypeScript"] });
        const result = buildIntelligence(report, repoData);

        expect(result.signals.workflowCount).toBe(1);
        expect(result.signals.testSignals).toBeGreaterThan(0);
        expect(result.deliveryRisk).toBe("low");
        expect(result.healthScore).toBeGreaterThan(60);
        expect(result.findings.some((f) => f.title === "No CI workflow detected")).toBe(false);
        expect(result.findings.some((f) => f.title === "No test evidence detected")).toBe(false);
    });

    it("flags broad language footprint and high dependency surface", () => {
        const deps: Record<string, string> = {};
        for (let i = 0; i < 85; i++) deps[`pkg-${i}`] = "1.0.0";
        const backend = ["Express", "NestJS", "Fastify", "FastAPI", "Django", "Hono"];
        const result = buildIntelligence(
            baseReport({ languages: ["A", "B", "C", "D", "E", "F"], backend, complexityScore: 51 }),
            makeRepoData({ languages: ["A", "B", "C", "D", "E", "F"], dependencies: deps })
        );

        const titles = result.findings.map((f) => f.title);
        expect(titles).toContain("Broad language footprint");
        expect(titles).toContain("High dependency surface");
        expect(result.deliveryRisk).toBe("high");
    });

    it("reports ML readiness when model assets exist", () => {
        const result = buildIntelligence(
            baseReport(),
            makeRepoData({
                files: ["models/classifier.onnx", "data/train.csv", "notebooks/eda.ipynb"],
                dependencies: { openai: "*", torch: "*" },
            })
        );

        expect(result.mlReadiness).toBeGreaterThan(50);
        expect(result.signals.architecturePatterns).toContain("Machine Learning");
    });

    it("produces an architecture graph with layered nodes and import edges", () => {
        const result = buildIntelligence(
            baseReport(),
            makeRepoData({
                files: ["src/app.ts", "api/server.ts", "prisma/schema.prisma", ".github/workflows/ci.yml"],
                sourceSamples: {
                    "api/server.ts": "import { db } from '../prisma/client';",
                },
            })
        );

        const kinds = result.architectureGraph.nodes.map((n) => n.kind);
        expect(kinds).toContain("application");
        expect(kinds).toContain("service");
        expect(kinds).toContain("data");
        expect(kinds).toContain("delivery");
        expect(result.architectureGraph.edges.some((e) => e.from === "services" && e.to === "data")).toBe(true);
    });

    it("flags a missing environment contract when only .env exists", () => {
        const result = buildIntelligence(baseReport(), makeRepoData({ files: [".env"] }));
        expect(result.findings.some((f) => f.title === "Environment contract is not visible")).toBe(true);

        const withExample = buildIntelligence(baseReport(), makeRepoData({ files: [".env", ".env.example"] }));
        expect(withExample.findings.some((f) => f.title === "Environment contract is not visible")).toBe(false);
    });

    it("adds an info baseline finding when nothing else is flagged", () => {
        const repoData = makeRepoData({
            files: [".github/workflows/ci.yml", "src/a.test.ts", "SECURITY.md", "README.md", ".env.example"],
            dependencies: { react: "19" },
        });
        const result = buildIntelligence(baseReport({ languages: ["TypeScript"] }), repoData);
        expect(result.findings.some((f) => f.severity === "info" && f.title === "Healthy baseline signals")).toBe(true);
    });

    it("keeps all scores within [0, 100]", () => {
        const result = buildIntelligence(baseReport(), makeRepoData({ files: [] }));
        expect(result.healthScore).toBeGreaterThanOrEqual(0);
        expect(result.healthScore).toBeLessThanOrEqual(100);
        expect(result.mlReadiness).toBeGreaterThanOrEqual(0);
        expect(result.mlReadiness).toBeLessThanOrEqual(100);
    });
});