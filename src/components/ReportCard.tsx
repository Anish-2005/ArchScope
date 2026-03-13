import { StackReport } from "@/lib/types";
import { Github, Star, Box, Server, Database, Cloud, Wrench, BarChart, ExternalLink, Activity } from "lucide-react";
import { motion } from "framer-motion";

export const ReportCard = ({ data }: { data: StackReport }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header Card */}
            <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden backdrop-blur-2xl">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-zinc-400 font-mono">
                            <Activity className="h-3 w-3 text-green-500" />
                            Analysis Complete
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-semibold text-white flex flex-wrap items-center gap-3">
                            <Github className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-300" />
                            {data.repo.owner}
                            <span className="text-zinc-600 font-light">/</span>
                            {data.repo.name}
                        </h1>
                        <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed">{data.repo.description}</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
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

                <div className="grid grid-cols-1 gap-4 lg:gap-6 flex-1">
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
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 hover:border-white/10 transition-all flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-black/40 rounded-xl border border-white/5">{icon}</div>
                <h3 className="text-sm font-semibold text-zinc-300 tracking-wide uppercase">{title}</h3>
            </div>

            <div className="flex-1">
                {items.length > 0 ? (
                    <div className={`flex flex-wrap gap-2 ${isCompact ? 'gap-y-2' : 'gap-y-3'}`}>
                        {items.map((item, i) => (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 + 0.2 }}
                                key={item}
                                className="px-3 py-1.5 bg-black/40 text-zinc-200 font-mono text-xs rounded-lg border border-white/5 shadow-sm whitespace-nowrap"
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-600 font-mono text-xs">{emptyText}</p>
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
        <div className={`flex flex-col items-center justify-center p-6 bg-black/50 rounded-2xl ring-1 ${bgRing} shadow-2xl relative shrink-0`}>
            <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-4">Architecture Index</span>
            <div className={`w-28 h-28 rounded-full border border-white/10 border-t-[3px] ${borderColor} flex flex-col items-center justify-center bg-zinc-900/50 shadow-inner`}>
                <span className={`text-4xl font-mono ${color}`}>{score}</span>
                <span className="text-zinc-600 text-[9px] uppercase font-bold mt-1 tracking-wider">/ 100</span>
            </div>
        </div>
    );
};
