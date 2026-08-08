import { StackReport } from "@/lib/types";
import { RiskTrendline } from "@/components/RiskTrendline";

interface TrendsTabProps {
    data: StackReport;
}

const getRiskMomentum = (deliveryRisk: StackReport["deliveryRisk"]) => {
    if (deliveryRisk === "low") return { value: "Stable ↗", color: "text-emerald-300" };
    if (deliveryRisk === "medium") return { value: "Caution →", color: "text-amber-300" };
    return { value: "Drift ↘", color: "text-rose-300" };
};

export const TrendsTab = ({ data }: TrendsTabProps) => {
    const momentum = getRiskMomentum(data.deliveryRisk);
    const highPriority = data.findings.filter((f) => ["critical", "high"].includes(f.severity)).length;

    const stats = [
        { label: "Score Percentile", value: `${Math.max(5, 100 - data.complexityScore)}th`, sub: "vs. avg repo", color: "text-cyan-300" },
        { label: "Risk Momentum", value: momentum.value, sub: "trending direction", color: momentum.color },
        { label: "Open Findings", value: `${data.findings.length}`, sub: `${highPriority} high priority`, color: "text-orange-300" },
    ];

    return (
        <div className="space-y-5">
            <RiskTrendline repo={`${data.repo.owner}/${data.repo.name}`} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur-xl text-center">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">{stat.label}</p>
                        <p className={`text-3xl font-extrabold font-mono ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-zinc-500 mt-1.5 font-medium">{stat.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
