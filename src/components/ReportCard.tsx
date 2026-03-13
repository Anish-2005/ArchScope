import { StackReport } from "@/lib/types";
import { Github, Star, Box, Server, Database, Cloud, Wrench, BarChart, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export const ReportCard = ({ data }: { data: StackReport }) => {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            {/* Header */}
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all z-0" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Github className="w-8 h-8" />
                            {data.repo.owner} / {data.repo.name}
                        </h1>
                        <p className="text-zinc-400 text-lg">{data.repo.description}</p>
                        <div className="flex items-center gap-4 pt-2 text-sm text-zinc-500 font-medium">
                            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {data.repo.stars.toLocaleString()} Stars</span>
                            <a href={data.repo.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-400 transition">
                                <ExternalLink className="w-4 h-4" /> View Source
                            </a>
                        </div>
                    </div>
                    <ComplexityGauge score={data.complexityScore} />
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryBlock
                    title="Frontend Frameworks"
                    icon={<Box className="text-blue-400" />}
                    items={data.frontend}
                    emptyText="No frontend stack detected."
                />
                <CategoryBlock
                    title="Backend Infrastructure"
                    icon={<Server className="text-green-400" />}
                    items={data.backend}
                    emptyText="No backend frameworks detected."
                />
                <CategoryBlock
                    title="Database & Storage"
                    icon={<Database className="text-yellow-400" />}
                    items={data.database}
                    emptyText="No databases detected."
                />
                <CategoryBlock
                    title="Cloud & Infra"
                    icon={<Cloud className="text-indigo-400" />}
                    items={data.infrastructure}
                    emptyText="No infrastructure configs detected."
                />
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CategoryBlock
                        title="DevTools & Build"
                        icon={<Wrench className="text-zinc-400" />}
                        items={data.devtools}
                        emptyText="No specific dev tools detected."
                    />
                    <CategoryBlock
                        title="Languages Used"
                        icon={<BarChart className="text-purple-400" />}
                        items={data.languages}
                        emptyText="No primary languages detected."
                    />
                </div>
            </div>
        </motion.div>
    );
};

const CategoryBlock = ({ title, icon, items, emptyText }: { title: string; icon: React.ReactNode; items: string[]; emptyText: string }) => {
    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-inner ring-1 ring-white/5 backdrop-blur-sm hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-sm">{icon}</div>
                <h3 className="text-xl font-semibold text-white tracking-wide">{title}</h3>
            </div>

            {items.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={item}
                            className="px-4 py-1.5 bg-zinc-800 text-zinc-300 font-medium rounded-full text-sm border border-zinc-700 shadow-sm"
                        >
                            {item}
                        </motion.span>
                    ))}
                </div>
            ) : (
                <p className="text-zinc-600 italic">{emptyText}</p>
            )}
        </div>
    );
};

const ComplexityGauge = ({ score }: { score: number }) => {
    const isHigh = score > 70;
    const isMed = score > 40;

    const color = isHigh ? "text-red-500" : isMed ? "text-yellow-500" : "text-green-500";
    const bgRing = isHigh ? "ring-red-500/20" : isMed ? "ring-yellow-500/20" : "ring-green-500/20";
    const borderRing = isHigh ? "border-red-500" : isMed ? "border-yellow-500" : "border-green-500";

    return (
        <div className={`flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl ring-2 ${bgRing} shadow-xl relative`}>
            <span className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">Complexity</span>
            <div className={`w-24 h-24 rounded-full border-4 ${borderRing} flex flex-col items-center justify-center`}>
                <span className={`text-3xl font-black ${color}`}>{score}</span>
                <span className="text-zinc-500 text-[10px] uppercase font-bold mt-[-2px]">Score</span>
            </div>
        </div>
    );
};
