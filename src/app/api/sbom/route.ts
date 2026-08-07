import { NextResponse } from "next/server";
import { fetchGitHubData, parseGitHubUrl } from "@/lib/github";

export async function POST(request: Request) {
    const { repoUrl } = await request.json();
    const parsed = typeof repoUrl === "string" ? await parseGitHubUrl(repoUrl) : null;
    if (!parsed) return NextResponse.json({ error: "A valid GitHub repository URL is required" }, { status: 400 });
    const repository = await fetchGitHubData(parsed.owner, parsed.repo);
    const now = new Date().toISOString();
    return NextResponse.json({
        bomFormat: "CycloneDX", specVersion: "1.5", serialNumber: `urn:uuid:${crypto.randomUUID()}`, version: 1,
        metadata: { timestamp: now, component: { type: "application", name: `${parsed.owner}/${parsed.repo}`, version: repository.metadata.default_branch } },
        components: Object.entries(repository.dependencies).map(([name, version]) => ({ type: "library", name, version, purl: `pkg:npm/${encodeURIComponent(name)}@${encodeURIComponent(version)}` })),
    });
}
