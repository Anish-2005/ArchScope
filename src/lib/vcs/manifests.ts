export function parseRequirementsTxt(text: string): Record<string, string> {
    const deps: Record<string, string> = {};
    text.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("-")) return;
        const dep = trimmed.split(/[=><~!;]/)[0].trim();
        if (dep) deps[dep.toLowerCase()] = "*";
    });
    return deps;
}

export function parseGoMod(text: string): Record<string, string> {
    const deps: Record<string, string> = {};
    const requireBlock = /require\s*\(([\s\S]*?)\)/g;
    const singleRequire = /^require\s+(\S+)\s+(\S+)/gm;
    let m;
    while ((m = requireBlock.exec(text)) !== null) {
        const block = m[1];
        block.split("\n").forEach((line) => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2 && !parts[0].startsWith("//")) deps[parts[0]] = parts[1];
        });
    }
    while ((m = singleRequire.exec(text)) !== null) deps[m[1]] = m[2];
    return deps;
}

export function parseCargoToml(text: string): Record<string, string> {
    const deps: Record<string, string> = {};
    const inDepsSection = /\[(?:dependencies|dev-dependencies|build-dependencies)\]([\s\S]*?)(?=\[|$)/g;
    let m;
    while ((m = inDepsSection.exec(text)) !== null) {
        m[1].split("\n").forEach((line) => {
            const parts = line.split("=");
            if (parts.length >= 2) {
                const key = parts[0].trim();
                if (key && !key.startsWith("#")) deps[key] = "*";
            }
        });
    }
    return deps;
}

export function parsePomXml(files: string[]): Record<string, string> {
    // We signal Spring ecosystem from file presence only; XML parsing is deferred
    const deps: Record<string, string> = {};
    if (files.some((f) => f.includes("pom.xml"))) deps["spring-boot"] = "*";
    return deps;
}

export function parsePyprojectToml(text: string): Record<string, string> {
    const deps: Record<string, string> = {};
    const depSection = /\[(?:tool\.poetry\.dependencies|project\.dependencies)\]([\s\S]*?)(?=\[|$)/g;
    let m;
    while ((m = depSection.exec(text)) !== null) {
        m[1].split("\n").forEach((line) => {
            const parts = line.split("=");
            if (parts.length >= 2) {
                const key = parts[0].trim().toLowerCase();
                if (key && key !== "python" && !key.startsWith("#")) deps[key] = "*";
            }
        });
    }
    return deps;
}
