import { StackReport } from "@/lib/types";
import { Github, Star, Box, Server, Database, Cloud, Wrench, BarChart, ExternalLink, Activity, Link as LinkIcon, Check, ShieldAlert, Gauge, Layers, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Logo } from "./Logo";

export const ReportCard = ({ data }: { data: StackReport }) => {
    const [copied, setCopied] = useState(false);
    const totalSignals = data.languages.length + data.frameworks.length + data.frontend.length + data.backend.length + data.database.length + data.infrastructure.length + data.devtools.length;
    const complexityTier = data.complexityScore > 70 ? "High" : data.complexityScore > 40 ? "Moderate" : "Low";
    const riskNote = data.complexityScore > 70
        ? "High operational overhead likely. Standardization and platform guardrails are recommended."
        : data.complexityScore > 40
            ? "Balanced but growing complexity. Establish common patterns before scale increases."
            : "Lean architecture profile. Preserve consistency and monitor drift as the codebase grows.";

    const handleCopy = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
            {/* Header Card */}
            <div className="bg-white/[0.07] border border-white/15 rounded-3xl p-4 sm:p-6 lg:p-10 relative overflow-hidden backdrop-blur-2xl shadow-[0_24px_64px_rgba(2,8,20,0.35)]">
                <div className="absolute -top-28 -right-28 w-96 h-96 bg-cyan-300/12 rounded-full blur-[110px] pointer-events-none" />
                <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none select-none">
                    <Logo size={400} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
                    <div className="space-y-4 max-w-2xl w-full">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-zinc-200 font-mono shadow-sm">
                                <Activity className="h-3 w-3 text-emerald-300" />
                                Analysis Complete
                            </div>
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 hover:bg-white/15 transition-colors px-3 py-1 text-xs text-zinc-100 font-mono shadow-sm"
                            >
                                {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <LinkIcon className="h-3 w-3" />}
                                {copied ? "Copied" : "Share Link"}
                            </button>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white flex flex-wrap items-center gap-2.5 sm:gap-3">
                            <Github className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-200 shrink-0" />
                            <span className="break-all">{data.repo.owner} <span className="text-zinc-500 font-light px-1">/</span> {data.repo.name}</span>
                        </h1>
                        <p className="text-zinc-200/85 text-base sm:text-lg font-medium leading-relaxed max-w-xl">{data.repo.description || "No description provided for this repository."}</p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs sm:text-sm text-zinc-300 font-medium">
                            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-zinc-300" /> {data.repo.stars.toLocaleString()} Stars</span>
                            <span className="text-zinc-700 font-light hidden sm:inline">|</span>
                            <a href={data.repo.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition group">
                                <ExternalLink className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors" /> GitHub Repository
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3">
                            <MiniKpi icon={<Layers className="w-4 h-4 text-cyan-300" />} label="Detected Signals" value={`${totalSignals}`} />
                            <MiniKpi icon={<Gauge className="w-4 h-4 text-amber-300" />} label="Complexity Tier" value={complexityTier} />
                            <MiniKpi icon={<GitBranch className="w-4 h-4 text-emerald-300" />} label="Repo Scale" value={data.repo.stars > 1000 ? "Mature" : "Emerging"} />
                        </div>
                    </div>
                    <ComplexityGauge score={data.complexityScore} />
                </div>
            </div>

            <div className="bg-white/[0.06] border border-white/14 rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-[0_16px_42px_rgba(2,8,20,0.28)]">
                <div className="flex items-start gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-300/15 border border-amber-200/30 flex items-center justify-center">
                        <ShieldAlert className="w-5 h-5 text-amber-100" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-100">Executive Summary</h2>
                        <p className="text-sm text-zinc-300/80">Portfolio-level interpretation of repository architecture.</p>
                    </div>
                </div>
                <p className="text-zinc-100/90 leading-relaxed text-sm sm:text-base">{riskNote}</p>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <CategoryBlock
                        title="Frameworks"
                        icon={<Layers className="text-cyan-400" />}
                        items={data.frameworks}
                        emptyText="No framework signatures detected."
                    />
                    <CategoryBlock
                        title="Frontend Ecosystem"
                        icon={<Box className="text-blue-400" />}
                        items={data.frontend}
                        emptyText="No frontend layer detected."
                    />
                    <CategoryBlock
                        title="Backend & Services"
                        icon={<Server className="text-emerald-400" />}
                        items={data.backend}
                        emptyText="No backend services detected."
                    />
                    <CategoryBlock
                        title="Data & Storage"
                        icon={<Database className="text-amber-400" />}
                        items={data.database}
                        emptyText="No datastores defined."
                    />
                    <CategoryBlock
                        title="Infrastructure"
                        icon={<Cloud className="text-indigo-400" />}
                        items={data.infrastructure}
                        emptyText="No infrastructure configs."
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:col-span-2 xl:col-span-1">
                    <CategoryBlock
                        title="Languages"
                        icon={<BarChart className="text-sky-300" />}
                        items={data.languages}
                        emptyText="No languages detected."
                        isCompact
                    />
                    <CategoryBlock
                        title="Developer Tools"
                        icon={<Wrench className="text-zinc-400" />}
                        items={data.devtools}
                        emptyText="No specific build tools."
                        isCompact
                    />
                </div>
            </div>
        </motion.div>
    );
};

const CategoryBlock = ({ title, icon, items, emptyText, isCompact = false }: { title: string; icon: React.ReactNode; items: string[]; emptyText: string; isCompact?: boolean }) => {
    return (
        <div className="bg-white/[0.05] border border-white/12 rounded-2xl p-4 sm:p-6 hover:bg-white/[0.1] hover:border-white/20 transition-all flex flex-col h-full shadow-[0_14px_36px_rgba(2,8,20,0.22)] backdrop-blur-xl min-w-0">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/15 shadow-inner">{icon}</div>
                <h3 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase">{title}</h3>
            </div>

            <div className="flex-1">
                {items.length > 0 ? (
                    <div className={`flex flex-wrap gap-2 ${isCompact ? 'gap-y-2' : 'gap-y-2'}`}>
                        {items.map((item, i) => (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 + 0.1 }}
                                key={item}
                                className="px-3 py-1.5 bg-white/10 text-zinc-100 font-mono text-xs rounded-lg border border-white/15 shadow-sm break-all"
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-300/75 font-mono text-xs bg-white/5 p-3 rounded-xl border border-white/10 hidden sm:block">{emptyText}</p>
                )}
            </div>
        </div>
    );
};

const MiniKpi = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
    return (
        <div className="rounded-xl border border-white/15 bg-white/8 p-3 backdrop-blur-md">
            <div className="text-zinc-300 text-[11px] uppercase tracking-wide font-mono mb-1 flex items-center gap-1.5">
                {icon}
                {label}
            </div>
            <p className="text-zinc-100 text-sm font-semibold">{value}</p>
        </div>
    );
};

const ComplexityGauge = ({ score }: { score: number }) => {
    const isHigh = score > 70;
    const isMed = score > 40;

    const color = isHigh ? "text-red-400" : isMed ? "text-amber-400" : "text-emerald-400";
    const bgRing = isHigh ? "ring-red-500/10" : isMed ? "ring-amber-500/10" : "ring-emerald-500/10";
    const borderColor = isHigh ? "border-red-500/30" : isMed ? "border-amber-500/30" : "border-emerald-500/30";

    return (
        <div className={`flex flex-col items-center justify-center p-5 sm:p-6 bg-white/[0.08] rounded-3xl ring-1 ${bgRing} shadow-[0_18px_42px_rgba(2,8,20,0.32)] relative w-full sm:w-auto lg:shrink-0 min-w-0 lg:min-w-[200px] backdrop-blur-xl border border-white/12`}>
            <span className="text-zinc-200 text-xs sm:text-sm uppercase font-mono tracking-widest mb-4">Architecture Index</span>
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-white/12 border-t-[4px] ${borderColor} flex flex-col items-center justify-center bg-slate-950/30 shadow-inner ring-4 ring-slate-900/25`}>
                <span className={`text-4xl sm:text-5xl font-mono ${color}`}>{score}</span>
                <span className="text-zinc-300/70 text-[11px] uppercase font-bold mt-1 tracking-wider">/ 100</span>
            </div>
        </div>
    );
};
