import crypto from "crypto";

export function verifyGithubSignature(payload: string, signature: string | null, secret: string): boolean {
    if (!signature || !secret) return !secret; // pass-through if no secret set
    const expected = `sha256=${crypto.createHmac("sha256", secret).update(payload).digest("hex")}`;
    try {
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
        return false;
    }
}

export interface PrCommentResult {
    repo: string;
    healthScore: number;
    complexityScore: number;
    deliveryRisk: string;
    violations: string[];
    criticalFindings: number;
    reportUrl: string;
    pass: boolean;
}

export function buildPrComment(result: PrCommentResult): string {
    const statusEmoji = result.pass ? "✅" : "❌";
    const riskEmoji = result.deliveryRisk === "high" ? "🔴" : result.deliveryRisk === "medium" ? "🟠" : "🟢";
    const violationsList = result.violations.length
        ? result.violations.map((v) => `- ⚠️ ${v}`).join("\n")
        : "- ✅ All policy checks passed";

    return `## ${statusEmoji} ArchScope Architecture Analysis

**Repository:** \`${result.repo}\` | **Delivery Risk:** ${riskEmoji} ${result.deliveryRisk.toUpperCase()}

| Metric | Score |
|--------|-------|
| 🩺 Health Score | **${result.healthScore}/100** |
| 🧮 Complexity Score | **${result.complexityScore}/100** |
| 🚨 Critical Findings | **${result.criticalFindings}** |

### Policy Evaluation
${violationsList}

${result.violations.length > 0 ? "**This PR has policy violations. Please review the findings before merging.**" : "**All policy checks passed. Architecture is within defined guardrails.**"}

🔗 [View Full Architecture Report](${result.reportUrl})

---
*Powered by [ArchScope](https://archscope.dev) — Engineering Intelligence Platform*`;
}
