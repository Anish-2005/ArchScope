"use client";

import { useEffect, useState } from "react";
import { Activity, BarChart3, ShieldCheck, ShieldAlert, TrendingUp } from "lucide-react";
import { ScanRecord } from "@/lib/types";
import { KpiCard } from "@/components/executive/KpiCard";
import { GovernanceMatrix } from "@/components/executive/GovernanceMatrix";
import { PortfolioRisksPanel } from "@/components/executive/PortfolioRisksPanel";
import { RemediationStatusPanel } from "@/components/executive/RemediationStatusPanel";

export default function ExecutiveDashboardPage() {
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/reports?organization=personal")
            .then((response) => response.json())
            .then((data) => setScans(data.scans || []))
            .finally(() => setLoading(false));
    }, []);

    const totalScans = scans.length;
    const avgHealth = totalScans ? Math.round(scans.reduce((acc, s) => acc + s.report.healthScore, 0) / totalScans) : 0;
    const avgComplexity = totalScans ? Math.round(scans.reduce((acc, s) => acc + s.report.complexityScore, 0) / totalScans) : 0;
    const highRiskCount = scans.filter((s) => s.report.deliveryRisk === "high").length;
    const complianceRate = totalScans ? Math.round(((totalScans - highRiskCount) / totalScans) * 100) : 100;

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-10">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <BarChart3 className="h-3.5 w-3.5" /> Portfolio Intelligence
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-50">Executive Risk Dashboard</h1>
                    <p className="mt-2.5 max-w-2xl text-zinc-300 text-sm sm:text-base font-medium">
                        Real-time aggregate architecture posture, policy compliance metrics, and remediation tracking across your repository portfolio.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 px-5 py-3 text-xs font-bold text-zinc-200 transition-all">
                        Export Portfolio Brief
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <KpiCard icon={<Activity className="w-5 h-5 text-cyan-400" />} label="Scanned Repositories" value={`${totalScans}`} subtext="Active platform portfolio" />
                <KpiCard icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} label="Avg Health Index" value={`${avgHealth}/100`} subtext="Aggregate code posture" />
                <KpiCard icon={<TrendingUp className="w-5 h-5 text-amber-400" />} label="Avg Stack Complexity" value={`${avgComplexity}/100`} subtext="Platform maintenance load" />
                <KpiCard icon={<ShieldAlert className="w-5 h-5 text-rose-400" />} label="Policy Compliance" value={`${complianceRate}%`} subtext={`${highRiskCount} high-risk breaches`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <GovernanceMatrix scans={scans} loading={loading} />
                </div>

                <div className="space-y-6">
                    <PortfolioRisksPanel scans={scans} />
                    <RemediationStatusPanel totalScans={totalScans} highRiskCount={highRiskCount} />
                </div>
            </div>
        </div>
    );
}
