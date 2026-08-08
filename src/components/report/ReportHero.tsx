"use client";

import { StackReport } from "@/lib/types";
import {
    Github, Star, ExternalLink, Link as LinkIcon, Check, ShieldCheck,
    BrainCircuit, Activity, Package, Code2, GitPullRequest, Zap, BarChart2,
    AlertTriangle, FileText, Download, Printer,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { exportToPdf, exportToCsv } from "@/lib/export";
import { ScoreDial } from "./ScoreDial";
import { QuickKpi } from "./QuickKpi";
import { getCriticalCount, getTotalSignals } from "./config";

interface ReportHeroProps {
    data: StackReport;
    copied: boolean;
    onCopy: () => void;
    onExportJson: () => void;
}

const Description = ({ desc }: { desc: string | null }) =>
    desc ? <p className="max-w-xl text-sm leading-relaxed text-zinc-300 font-medium">{desc}</p> : null;

export const ReportHero = ({ data, copied, onCopy, onExportJson }: ReportHeroProps) => {
    const criticalCount = getCriticalCount(data);
    const totalSignals = getTotalSignals(data);

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_-20%,rgba(34,211,238,0.15),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_110%,rgba(139,92,246,0.1),transparent_60%)]" />
                <div className="absolute -right-20 -top-20 h-80 w-80 opacity-[0.025]"><Logo size={320} /></div>
            </div>

            <div className="relative z-10 p-7 sm:p-10 lg:p-14">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                            <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" /></span>
                            Analysis Complete
                        </span>
                        {criticalCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-300">
                                <AlertTriangle className="h-3 w-3" /> {criticalCount} Critical Issues
                            </span>
                        )}
                        {data.scannedAt && (
                            <span className="text-[10px] font-mono text-zinc-500">
                                Scanned {new Date(data.scannedAt).toLocaleString()}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => exportToPdf(data)} className="group inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-400/20 hover:border-cyan-400/40">
                            <FileText className="h-3.5 w-3.5" /> PDF
                        </button>
                        <button onClick={() => exportToCsv(data)} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/10">
                            <Download className="h-3.5 w-3.5" /> CSV
                        </button>
                        <button onClick={onExportJson} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/10">
                            <Code2 className="h-3.5 w-3.5" /> JSON
                        </button>
                        <button onClick={onCopy} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/10">
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <LinkIcon className="h-3.5 w-3.5" />}
                            {copied ? "Copied" : "Share"}
                        </button>
                        <button onClick={() => window.print()} className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/10">
                            <Printer className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-900">
                                <Github className="h-7 w-7 text-zinc-300" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Repository</p>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-50 leading-tight">
                                    <span className="text-zinc-500 font-light">{data.repo.owner} / </span>
                                    <span className="text-white">{data.repo.name}</span>
                                </h1>
                            </div>
                        </div>

                        <Description desc={data.repo.description} />

                        <div className="flex flex-wrap items-center gap-5 text-[11px] font-semibold text-zinc-400">
                            <span className="flex items-center gap-1.5 text-amber-300">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                {data.repo.stars.toLocaleString()} stars
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5 text-cyan-400" />
                                {totalSignals} technologies detected
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Code2 className="h-3.5 w-3.5 text-violet-400" />
                                {data.signals.fileCount.toLocaleString()} files
                            </span>
                            <a
                                href={data.repo.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-cyan-400 transition-colors hover:text-cyan-300"
                            >
                                <ExternalLink className="h-3.5 w-3.5" /> View Source
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 lg:shrink-0">
                        <ScoreDial
                            label="Health"
                            score={data.healthScore}
                            icon={<ShieldCheck className="h-4 w-4" />}
                            color={data.healthScore > 70 ? "emerald" : data.healthScore > 45 ? "amber" : "rose"}
                        />
                        <ScoreDial
                            label="Complexity"
                            score={data.complexityScore}
                            icon={<BarChart2 className="h-4 w-4" />}
                            color={data.complexityScore > 70 ? "rose" : data.complexityScore > 40 ? "amber" : "emerald"}
                            invert
                        />
                        <ScoreDial
                            label="ML Ready"
                            score={data.mlReadiness}
                            icon={<BrainCircuit className="h-4 w-4" />}
                            color={data.mlReadiness > 70 ? "violet" : data.mlReadiness > 40 ? "cyan" : "zinc"}
                        />
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <QuickKpi icon={<Activity className="h-4 w-4 text-cyan-400" />} label="Delivery Risk" value={data.deliveryRisk.toUpperCase()} valueColor={data.deliveryRisk === "high" ? "text-rose-300" : data.deliveryRisk === "medium" ? "text-amber-300" : "text-emerald-300"} />
                    <QuickKpi icon={<Package className="h-4 w-4 text-violet-400" />} label="Dependencies" value={data.signals.dependencyCount.toString()} />
                    <QuickKpi icon={<GitPullRequest className="h-4 w-4 text-sky-400" />} label="CI Workflows" value={data.signals.workflowCount.toString()} />
                    <QuickKpi icon={<Zap className="h-4 w-4 text-amber-400" />} label="Test Signals" value={data.signals.testSignals.toString()} />
                </div>
            </div>
        </div>
    );
};
