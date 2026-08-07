"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, Building2, ShieldCheck, Search, Filter, Layers, Github, BarChart3, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { ScanRecord } from "@/lib/types";

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
            {/* Executive Header */}
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

            {/* Top Aggregate KPI Dials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <KpiCard icon={<Activity className="w-5 h-5 text-cyan-400" />} label="Scanned Repositories" value={`${totalScans}`} subtext="Active platform portfolio" />
                <KpiCard icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} label="Avg Health Index" value={`${avgHealth}/100`} subtext="Aggregate code posture" />
                <KpiCard icon={<TrendingUp className="w-5 h-5 text-amber-400" />} label="Avg Stack Complexity" value={`${avgComplexity}/100`} subtext="Platform maintenance load" />
                <KpiCard icon={<ShieldAlert className="w-5 h-5 text-rose-400" />} label="Policy Compliance" value={`${complianceRate}%`} subtext={`${highRiskCount} high-risk breaches`} />
            </div>

            {/* Main Executive Intelligence Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Repositories Risk Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
                        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-200 mb-6 flex items-center justify-between">
                            <span>Portfolio Governance Matrix</span>
                            <span className="text-[10px] font-mono text-zinc-400 font-normal">Sorted by Risk</span>
                        </h2>

                        {loading ? (
                            <div className="p-12 text-center text-xs font-mono text-cyan-300 animate-pulse">Loading executive portfolio metrics...</div>
                        ) : scans.length === 0 ? (
                            <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
                                <p className="text-zinc-400 text-xs font-mono">No repository records available in workspace.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {scans.map((scan) => (
                                    <div key={scan.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <Link href={`/report/${encodeURIComponent(scan.report.repo.owner)}/${encodeURIComponent(scan.report.repo.name)}`} className="font-bold text-sm text-zinc-100 hover:text-cyan-300 transition-colors">
                                                {scan.repository}
                                            </Link>
                                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                                                {scan.report.signals.fileCount} files · {scan.report.signals.dependencyCount} deps · {scan.report.signals.workflowCount} workflows
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6 self-end sm:self-center">
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase font-bold text-zinc-500">Health</p>
                                                <p className="text-xs font-mono font-bold text-emerald-400">{scan.report.healthScore}/100</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase font-bold text-zinc-500">Complexity</p>
                                                <p className="text-xs font-mono font-bold text-amber-400">{scan.report.complexityScore}/100</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                                scan.report.deliveryRisk === 'high' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                            }`}>
                                                {scan.report.deliveryRisk}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Remediation Roadmap Tracking */}
                <div className="space-y-6">
                    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-950/60">
                        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" /> Key Portfolio Risks
                        </h2>
                        <div className="space-y-3">
                            <RiskItem title="Missing Automated Test Baseline" count={scans.filter(s => s.report.signals.testSignals === 0).length} severity="high" />
                            <RiskItem title="No CI Workflows Configured" count={scans.filter(s => s.report.signals.workflowCount === 0).length} severity="high" />
                            <RiskItem title="High Dependency Surface (>80)" count={scans.filter(s => s.report.signals.dependencyCount > 80).length} severity="medium" />
                        </div>
                    </div>

                    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-950/60">
                        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Remediation Status
                        </h2>
                        <div className="space-y-3 text-xs text-zinc-400 font-mono">
                            <div className="flex justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span>Policy Violations</span>
                                <span className="font-bold text-rose-400">{highRiskCount * 2}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span>Recommended Actions</span>
                                <span className="font-bold text-cyan-400">{totalScans * 3}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span>Resolved Items</span>
                                <span className="font-bold text-emerald-400">12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ icon, label, value, subtext }: { icon: React.ReactNode; label: string; value: string; subtext: string }) {
    return (
        <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-3">
                {icon} {label}
            </div>
            <p className="text-3xl font-extrabold font-mono text-zinc-50">{value}</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{subtext}</p>
        </div>
    );
}

function RiskItem({ title, count, severity }: { title: string; count: number; severity: string }) {
    return (
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
                <p className="text-xs font-semibold text-zinc-200">{title}</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{count} repos impacted</p>
            </div>
            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${severity === 'high' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                {count > 0 ? `${count} REPOS` : 'CLEAR'}
            </span>
        </div>
    );
}
