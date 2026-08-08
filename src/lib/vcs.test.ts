import { describe, expect, it } from "vitest";
import {
    parseCargoToml,
    parseGitHubUrl,
    parseGoMod,
    parsePyprojectToml,
    parseRepoUrl,
    parseRequirementsTxt,
} from "./vcs";

describe("parseRepoUrl", () => {
    it("parses a full GitHub URL", () => {
        expect(parseRepoUrl("https://github.com/vercel/next.js")).toEqual({
            platform: "github",
            owner: "vercel",
            repo: "next.js",
        });
    });

    it("parses a schemeless URL and strips trailing .git", () => {
        expect(parseRepoUrl("github.com/acme/backend.git")).toEqual({
            platform: "github",
            owner: "acme",
            repo: "backend",
        });
    });

    it("parses GitLab and Bitbucket", () => {
        expect(parseRepoUrl("https://gitlab.com/gitlab-org/gitlab")).toEqual({
            platform: "gitlab",
            owner: "gitlab-org",
            repo: "gitlab",
        });
        expect(parseRepoUrl("https://bitbucket.org/acme/tool")).toEqual({
            platform: "bitbucket",
            owner: "acme",
            repo: "tool",
        });
    });

    it("normalizes the www. prefix", () => {
        expect(parseRepoUrl("https://www.github.com/acme/repo")?.platform).toBe("github");
    });

    it("rejects unsupported hosts and malformed input", () => {
        expect(parseRepoUrl("https://gitlab.example.com/acme/repo")).toBeNull();
        expect(parseRepoUrl("https://github.com/owneronly")).toBeNull();
        expect(parseRepoUrl("")).toBeNull();
        expect(parseRepoUrl("not a url at all")).toBeNull();
    });

    it("legacy parseGitHubUrl only accepts GitHub", async () => {
        expect(await parseGitHubUrl("https://github.com/acme/repo")).toEqual({ owner: "acme", repo: "repo" });
        expect(await parseGitHubUrl("https://gitlab.com/acme/repo")).toBeNull();
    });
});

describe("parseRequirementsTxt", () => {
    it("parses pinned, ranged, and commented lines", () => {
        const deps = parseRequirementsTxt(
            [
                "# comment",
                "fastapi>=0.100",
                "requests==2.31.0",
                "click~=8.1",
                "-r base.txt",
                "uvicorn[standard]",
                "",
            ].join("\n")
        );
        expect(deps["fastapi"]).toBe("*");
        expect(deps["requests"]).toBe("*");
        expect(deps["click"]).toBe("*");
        expect(deps["uvicorn[standard]"]).toBe("*");
        expect(Object.keys(deps)).not.toContain("base");
        expect(Object.keys(deps)).toHaveLength(4);
    });
});

describe("parseGoMod", () => {
    it("parses grouped and single requires", () => {
        const deps = parseGoMod(`
module demo

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    gorm.io/gorm v1.25.0
)

require github.com/go-chi/chi v5.0.0
`);
        expect(deps["github.com/gin-gonic/gin"]).toBe("v1.9.1");
        expect(deps["gorm.io/gorm"]).toBe("v1.25.0");
        expect(deps["github.com/go-chi/chi"]).toBe("v5.0.0");
    });
});

describe("parseCargoToml", () => {
    it("parses dependencies and dev-dependencies", () => {
        const deps = parseCargoToml(`
            [package]
            name = "svc"

            [dependencies]
            axum = "0.7"
            serde = { version = "1.0", features = ["derive"] }

            [dev-dependencies]
            tokio = { version = "1", features = ["full"] }
        `);
        expect(deps["axum"]).toBe("*");
        expect(deps["serde"]).toBe("*");
        expect(deps["tokio"]).toBe("*");
    });
});

describe("parsePyprojectToml", () => {
    it("parses poetry and project dependency sections, skipping python pin", () => {
        const deps = parsePyprojectToml(`
            [project]
            name = "svc"

            [project.dependencies]
            fastapi = "0.110"
            pydantic = "2.6"

            [tool.poetry.dependencies]
            python = "^3.11"
            sqlalchemy = "2.0.25"
        `);
        expect(deps["fastapi"]).toBe("*");
        expect(deps["pydantic"]).toBe("*");
        expect(deps["sqlalchemy"]).toBe("*");
        expect(Object.keys(deps)).not.toContain("python");
    });
});