"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, Building2, ShieldCheck, Search, Filter, Layers, Github } from "lucide-react";
import { ScanRecord } from "@/lib/types";

export default function PortfolioPage() {
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRisk, setFilterRisk] = useState<string>("all");

    useEffect(() => {
        fetch("/api/reports?organization=personal")
            .then((response) => response.json())
            .then((data) => setScans(data.scans || []))
            .finally(() => setLoading(false));
    }, []);

    const filteredScans = scans.filter((scan) => {
        const matchesSearch = scan.repository.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRisk = filterRisk === "all" || scan.report.deliveryRisk.toLowerCase() === filterRisk.toLowerCase();
        return matchesSearch && matchesRisk;
    });

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-10">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Building2 className="h-3.5 w-3.5" /> Workspace Executive Hub
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-50">Engineering Portfolio</h1>
                    <p className="mt-2.5 max-w-xl text-zinc-300 text-sm sm:text-base font-medium">A durable repository history of architectural posture, policy compliance, and delivery risk.</p>
                </div>
                <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all px-5 py-3 text-xs font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                    New Analysis <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search repository..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-cyan-400/50"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <Filter className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
                    {["all", "low", "moderate", "high"].map((risk) => (
                        <button
                            key={risk}
                            onClick={() => setFilterRisk(risk)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                filterRisk === risk
                                    ? "bg-cyan-400 text-slate-950 font-extrabold shadow-md"
                                    : "bg-white/[0.04] text-zinc-400 hover:text-zinc-200 hover:bg-white/10"
                            }`}
                        >
                            {risk === "all" ? "All Risks" : `${risk} Risk`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scan Cards List */}
            <div className="grid gap-4">
                {loading && (
                    <div className="glass-card rounded-3xl p-12 text-center text-sm font-mono text-cyan-300 animate-pulse">
                        Fetching engineering portfolio records...
                    </div>
                )}

                {!loading && filteredScans.length === 0 && (
                    <div className="glass-card rounded-3xl p-12 text-center border-dashed border-white/15">
                        <ShieldCheck className="mx-auto h-10 w-10 text-cyan-400 mb-3" />
                        <h2 className="text-lg font-bold text-zinc-100">No matching scans found</h2>
                        <p className="mt-1 text-xs text-zinc-400">Try adjusting your search filter or analyze a new repository URL.</p>
                    </div>
                )}

                {filteredScans.map((scan) => (
                    <Link
                        key={scan.id}
                        href={`/report/${encodeURIComponent(scan.report.repo.owner)}/${encodeURIComponent(scan.report.repo.name)}`}
                        className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-900/80 shadow-xl"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 group-hover:border-cyan-400/40 text-cyan-400 transition-colors">
                                    <Github className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-zinc-100 group-hover:text-cyan-300 transition-colors">
                                        {scan.repository}
                                    </h3>
                                    <p className="mt-1 text-xs font-mono text-zinc-400">
                                        Scanned on {new Date(scan.scannedAt).toLocaleDateString()} at {new Date(scan.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 self-end sm:self-center">
                                <Metric label="Health Index" value={`${scan.report.healthScore}/100`} />
                                <Metric label="Complexity" value={`${scan.report.complexityScore}/100`} />
                                <span className={`rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                                    scan.report.deliveryRisk.toLowerCase() === 'high'
                                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                        : scan.report.deliveryRisk.toLowerCase() === 'moderate'
                                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                }`}>
                                    {scan.report.deliveryRisk} risk
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
            <p className="mt-0.5 text-sm font-bold text-zinc-100 font-mono flex items-center justify-end gap-1">
                <Activity className="h-3 w-3 text-cyan-400" />
                {value}
            </p>
        </div>
    );
}

