import { describe, expect, it } from "vitest";
import { detectStack } from "./detector";
import { makeRepoData } from "./test-utils";

describe("detectStack", () => {
    it("detects a modern Next.js frontend stack", () => {
        const report = detectStack(
            makeRepoData({
                dependencies: { next: "15", react: "19", typescript: "5", tailwindcss: "4" },
                files: ["next.config.mjs", "tsconfig.json", "app/page.tsx"],
            }),
            "https://github.com/acme/web"
        );

        expect(report.frontend).toContain("Next.js");
        expect(report.frontend).toContain("React");
        expect(report.frontend).toContain("TailwindCSS");
        expect(report.devtools).toContain("TypeScript");
        expect(report.frameworks).toContain("Next.js");
        expect(report.repo.name).toBe("demo");
        expect(report.repo.owner).toBe("acme");
        expect(report.repo.url).toBe("https://github.com/acme/web");
    });

    it("detects backend, database, and infrastructure layers from manifests", () => {
        const report = detectStack(
            makeRepoData({
                languages: ["Python", "SQL"],
                dependencies: { fastapi: "*", sqlalchemy: "*", "aiosqlite": "*" },
                files: ["api/main.py", "requirements.txt", "Dockerfile", ".github/workflows/ci.yml"],
            }),
            "https://github.com/acme/backend"
        );

        expect(report.backend).toContain("FastAPI");
        expect(report.backend).toContain("SQLAlchemy");
        expect(report.infrastructure).toContain("Docker");
        expect(report.infrastructure).toContain("GitHub Actions");
    });

    it("matches files case-insensitively", () => {
        const report = detectStack(
            makeRepoData({ files: [".GITHUB/WORKFLOWS/ci.yml", "DOCKERFILE"] }),
            "https://github.com/acme/casey"
        );

        expect(report.infrastructure).toContain("Docker");
        expect(report.infrastructure).toContain("GitHub Actions");
    });

    it("detects monorepo-sharded packages", () => {
        const report = detectStack(
            makeRepoData({
                dependencies: { "astro": "4" },
                files: ["apps/web/astro.config.mjs", "packages/ui/index.ts"],
            }),
            "https://github.com/acme/mono"
        );

        expect(report.frontend).toContain("Astro");
    });

    it("returns an empty-but-valid report for a bare repository", () => {
        const report = detectStack(
            makeRepoData({ languages: [], files: ["hello.txt"] }),
            "https://github.com/acme/bare"
        );

        expect(report.frontend).toEqual([]);
        expect(report.backend).toEqual([]);
        expect(report.infrastructure).toEqual([]);
        expect(report.devtools).toEqual([]);
        expect(report.complexityScore).toBe(0);
        expect(report.healthScore).toBeGreaterThanOrEqual(0);
        expect(report.healthScore).toBeLessThanOrEqual(100);
    });

    it("detects a full enterprise stack (graph, ML, IaC) in a single scan", () => {
        const report = detectStack(
            makeRepoData({
                languages: ["TypeScript", "Python", "terraform"],
                dependencies: { openai: "*", "@libsql/client": "*", "hono": "*", "cypress": "13" },
                files: [
                    "src/index.ts",
                    "workers/wrangler.toml",
                    "cypress/e2e/auth.spec.ts",
                    "Dockerfile",
                    "main.tf",
                ],
            }),
            "https://example.com/api/repos/supabase"
        );

        expect(report.backend).toContain("Hono");
        expect(report.backend).toContain("OpenAI");
        expect(report.database).toContain("Turso");
        expect(report.infrastructure).toContain("Docker");
        expect(report.infrastructure).toContain("Terraform");
        expect(report.infrastructure).toContain("Cloudflare Workers");
        expect(report.devtools).toContain("Cypress");
    });
});