import { NextResponse } from "next/server";
import { listScansByRepo, getBaseline, getPolicy } from "@/lib/redis";
import { log } from "@/lib/observability";

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

export async function POST(req: Request) {
    const { repo, org = "personal" } = await req.json();
    if (!repo) return NextResponse.json({ error: "repo required" }, { status: 400 });

    // Compare latest scan vs baseline
    const scans = await listScansByRepo(org, repo, 1);
    if (!scans.length) return NextResponse.json({ error: "No scans found" }, { status: 404 });
    const latest = scans[0];
    
    const baseline = await getBaseline(org);
    const policy = await getPolicy(org);
    
    let driftScore = 0;
    const details = [];

    // 1. Compare against baseline (if exists)
    if (baseline && baseline.repository === repo) {
        if (latest.report.complexityScore > baseline.report.complexityScore + 5) {
            driftScore += 30;
            details.push(`Complexity increased from ${baseline.report.complexityScore} to ${latest.report.complexityScore}`);
        }
        if (latest.report.healthScore < baseline.report.healthScore - 5) {
            driftScore += 30;
            details.push(`Health score dropped from ${baseline.report.healthScore} to ${latest.report.healthScore}`);
        }
    }

    // 2. Compare against policy
    if (latest.report.complexityScore > policy.maxComplexity) {
        driftScore += 40;
        details.push(`Complexity (${latest.report.complexityScore}) exceeds policy budget (${policy.maxComplexity})`);
    }

    if (driftScore < 50) {
        return NextResponse.json({ ok: true, drift: driftScore, action: "none" });
    }

    // High drift detected -> create a ticket
    let ticketUrl = null;
    if (LINEAR_API_KEY) {
        try {
            const res = await fetch("https://api.linear.app/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": LINEAR_API_KEY },
                body: JSON.stringify({
                    query: `
                        mutation IssueCreate($title: String!, $description: String!) {
                            issueCreate(input: { teamId: "TEAM_ID_HERE", title: $title, description: $description }) {
                                issue { id url }
                            }
                        }
                    `,
                    variables: {
                        title: `[ArchScope] Architecture Drift Detected: ${repo}`,
                        description: `Significant architectural drift detected.\n\n${details.map(d => "- " + d).join("\n")}`
                    }
                })
            });
            const data = await res.json();
            ticketUrl = data?.data?.issueCreate?.issue?.url;
        } catch (e) {
            log.error("Linear ticket creation failed", { error: String(e) });
        }
    }

    log.warn("High architecture drift detected", { org, repo, drift: driftScore, ticketUrl });

    return NextResponse.json({ 
        ok: true, 
        drift: driftScore, 
        action: "ticket_created",
        details,
        ticketUrl
    });
}
