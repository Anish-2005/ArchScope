import { describe, expect, it } from "vitest";
import { calculateComplexity } from "./complexity";
import { baseReport } from "./test-utils";

describe("calculateComplexity", () => {
    it("returns 0 for an empty stack", () => {
        expect(calculateComplexity(baseReport({ languages: [] }))).toBe(0);
    });

    it("weights backend heavier than frontend", () => {
        const withBackend = calculateComplexity(baseReport({ languages: [], backend: ["Express", "Fastify"], frontend: [] }));
        const withFrontend = calculateComplexity(baseReport({ languages: [], frontend: ["React", "Vue"], backend: [] }));
        expect(withBackend).toBe(12);
        expect(withFrontend).toBe(10);
    });

    it("weights database and infrastructure heaviest", () => {
        const report = baseReport({ languages: [], database: ["Redis"], infrastructure: ["Docker"] });
        expect(calculateComplexity(report)).toBe(18);
    });

    it("caps language contribution at 15", () => {
        const languages = Array.from({ length: 10 }, (_, i) => `lang${i}`);
        const report = baseReport({ languages });
        expect(calculateComplexity(report)).toBe(15);
    });

    it("caps the total score at 100", () => {
        const report = baseReport({
            languages: Array.from({ length: 10 }, (_, i) => `lang${i}`),
            frontend: ["React", "Vue", "Svelte", "Angular", "Solid"],
            backend: ["Express", "NestJS", "Fastify", "FastAPI", "Django"],
            database: ["Prisma", "PostgreSQL"],
            infrastructure: ["Docker", "Kubernetes", "Helm", "Terraform"],
            devtools: ["Vitest", "ESLint"],
        });
        expect(calculateComplexity(report)).toBe(100);
    });
});