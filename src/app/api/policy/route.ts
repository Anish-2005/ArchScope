import { NextResponse } from "next/server";
import { getPolicy, savePolicy } from "@/lib/redis";
import { ArchitecturePolicy } from "@/lib/types";

export async function GET(request: Request) {
    const organization = (new URL(request.url).searchParams.get("organization") || "personal").toLowerCase();
    return NextResponse.json(await getPolicy(organization));
}

export async function PUT(request: Request) {
    const body = await request.json() as Partial<ArchitecturePolicy>;
    const organization = typeof body.organization === "string" ? body.organization.toLowerCase() : "";
    if (!/^[a-z0-9-]{1,48}$/.test(organization) || typeof body.requireCi !== "boolean" || typeof body.requireTestEvidence !== "boolean" || !Number.isFinite(body.maxDependencies) || !Number.isFinite(body.maxComplexity)) {
        return NextResponse.json({ error: "Invalid policy" }, { status: 400 });
    }
    const maxDependencies = body.maxDependencies!;
    const maxComplexity = body.maxComplexity!;
    const policy: ArchitecturePolicy = { organization, requireCi: body.requireCi!, requireTestEvidence: body.requireTestEvidence!, maxDependencies: Math.max(1, Math.min(500, maxDependencies)), maxComplexity: Math.max(1, Math.min(100, maxComplexity)) };
    await savePolicy(policy);
    return NextResponse.json(policy);
}
