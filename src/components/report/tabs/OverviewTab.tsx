"use client";

import { StackReport } from "@/lib/types";
import { Activity, ChevronRight, CircleAlert, ShieldAlert, Zap } from "lucide-react";
import { SignalBar } from "../SignalBar";
import { MiniStat } from "../MiniStat";
import { FindingCard } from "../FindingCard";

interface OverviewTabProps {
    data: StackReport;
}

const getRiskNarrative = (complexityScore: number): string => {
    if (complexityScore > 70) {
        return "High operational overhead detected. This codebase carries significant technology breadth that introduces coordination costs. Standardization and platform engineering guardrails are strongly recommended before further scaling.";
    }
    if (complexityScore > 40) {
        return "Balanced complexity profile. The architecture is growing in breadth. Establishing shared patterns and internal platform conventions now will pay compounding dividends as the team scales.";
    }
    return "Lean and intentional architecture. The repository shows a coherent, focused technology profile. Preserve this simplicity by enforcing strict dependency budgets as the codebase evolves.";
};

export const OverviewTab = ({ data }: OverviewTabProps) => {
    const riskNarrative = getRiskNarrative(data.complexityScore);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-slate-950/70 p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.07] to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
                                <ShieldAlert className="h-4 w-4 text-amber-400" />
                            </div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Executive Narrative</h2>
                        </div>
                        <p className="text-zinc-200 text-sm leading-[1.85] font-medium">{riskNarrative}</p>

                        {data.signals.architecturePatterns.length > 0 && (
                            <div className="mt-5 pt-4 border-t border-white/[0.06]">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2.5">Detected Patterns</p>
                                <div className="flex flex-wrap gap-2">
                                    {data.signals.architecturePatterns.map((p) => (
                                        <span key={p} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-mono text-cyan-300">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                            <Activity className="h-4 w-4 text-cyan-400" />
                        </div>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Repository Signals</h2>
                    </div>
                    <div className="space-y-3">
                        <SignalBar label="Documentation Coverage" value={data.signals.documentationScore} max={100} color="cyan" />
                        <SignalBar label="CI/CD Pipeline Maturity" value={Math.min(100, data.signals.workflowCount * 20)} max={100} color="emerald" />
                        <SignalBar label="Test Evidence Signals" value={Math.min(100, data.signals.testSignals * 25)} max={100} color="violet" />
                        <SignalBar label="Dependency Load" value={Math.min(100, (data.signals.dependencyCount / 200) * 100)} max={100} color="amber" invert />
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3">
                        <MiniStat label="Files" value={data.signals.fileCount.toLocaleString()} />
                        <MiniStat label="Dependencies" value={data.signals.dependencyCount.toString()} />
                    </div>
                </div>
            </div>

            {data.findings.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-7 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-rose-400/10 border border-rose-400/20">
                                <CircleAlert className="h-4 w-4 text-rose-400" />
                            </div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Top Risk Findings</h2>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">{data.findings.length} total findings</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.findings.slice(0, 4).map((f) => <FindingCard key={f.id} finding={f} compact />)}
                    </div>
                </div>
            )}

            {data.recommendations.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-7 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                            <Zap className="h-4 w-4 text-emerald-400" />
                        </div>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Immediate Action Items</h2>
                    </div>
                    <div className="space-y-2">
                        {data.recommendations.filter((r) => r.priority === "now").slice(0, 3).map((r, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-3.5 hover:border-emerald-400/20 transition-all">
                                <ChevronRight className="h-4 w-4 shrink-0 text-emerald-400" />
                                <p className="text-sm font-semibold text-zinc-100">{r.title}</p>
                                <span className="ml-auto shrink-0 rounded-full bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-rose-300">Now</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
