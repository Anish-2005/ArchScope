import { StackReport } from "@/lib/types";
import { Github, Star, Box, Server, Database, Cloud, Wrench, BarChart, ExternalLink, Activity, Link as LinkIcon, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const ReportCard = ({ data }: { data: StackReport }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header Card */}
            <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden backdrop-blur-2xl">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-zinc-400 font-mono shadow-sm">
                                <Activity className="h-3 w-3 text-green-500" />
                                Analysis Complete
                            </div>
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3 py-1 text-xs text-zinc-300 font-mono shadow-sm"
                            >
                                {copied ? <Check className="h-3 w-3 text-green-400" /> : <LinkIcon className="h-3 w-3" />}
                                {copied ? "Copied" : "Share Link"}
                            </button>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-semibold text-white flex flex-wrap items-center gap-3">
                            <Github className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-300 shrink-0" />
                            <span className="break-all">{data.repo.owner} <span className="text-zinc-600 font-light px-1">/</span> {data.repo.name}</span>
                        </h1>
                        <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed max-w-xl">{data.repo.description || "No description provided for this repository."}</p>
                        <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-zinc-400 font-medium">
                            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-zinc-500" /> {data.repo.stars.toLocaleString()} Stars</span>
                            <span className="text-zinc-700 font-light hidden sm:inline">|</span>
                            <a href={data.repo.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition group">
                                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" /> GitHub Repository
                            </a>
                        </div>
                    </div>
                    <ComplexityGauge score={data.complexityScore} />
                </div>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                        icon={<BarChart className="text-purple-400" />}
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
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 hover:border-white/10 transition-all flex flex-col h-full shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-black/50 rounded-xl border border-white/5 shadow-inner">{icon}</div>
                <h3 className="text-sm font-semibold text-zinc-300 tracking-wide uppercase">{title}</h3>
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
                                className="px-3 py-1.5 bg-black/60 text-zinc-200 font-mono text-xs rounded-lg border border-white/10 shadow-sm whitespace-nowrap"
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-600 font-mono text-xs bg-black/20 p-3 rounded-xl border border-white/5 hidden sm:block">{emptyText}</p>
                )}
            </div>
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
        <div className={`flex flex-col items-center justify-center p-6 sm:p-8 bg-black/60 rounded-3xl ring-1 ${bgRing} shadow-2xl relative shrink-0 min-w-[200px]`}>
            <span className="text-zinc-400 text-xs sm:text-sm uppercase font-mono tracking-widest mb-4">Architecture Index</span>
            <div className={`w-32 h-32 rounded-full border border-white/5 border-t-[4px] ${borderColor} flex flex-col items-center justify-center bg-zinc-900/40 shadow-inner ring-4 ring-black/40`}>
                <span className={`text-5xl font-mono ${color}`}>{score}</span>
                <span className="text-zinc-500 text-[11px] uppercase font-bold mt-1 tracking-wider">/ 100</span>
            </div>
        </div>
    );
};
