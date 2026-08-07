import { StackReport } from "@/lib/types";
import { Github, Star, Box, Server, Database, Cloud, Wrench, BarChart, ExternalLink, Activity, Link as LinkIcon, Check, ShieldAlert, Gauge, Layers, GitBranch, BrainCircuit, ShieldCheck, ClipboardList, CircleAlert } from "lucide-react";
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-10">
            {/* Header Card */}
            <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden backdrop-blur-2xl shadow-[0_48px_128px_-32px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.1),transparent_50%)] pointer-events-none" />
                <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none select-none">
                    <Logo size={480} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                    <div className="space-y-6 max-w-2xl w-full">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                                <Activity className="h-3 w-3 animate-pulse" />
                                Analysis Protocol Finalized
                            </div>
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-200"
                            >
                                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <LinkIcon className="h-3 w-3" />}
                                {copied ? "Token Copied" : "Share Engine Insight"}
                            </button>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-zinc-50 flex flex-wrap items-center gap-4 leading-tight tracking-tighter">
                            <Github className="w-12 h-12 lg:w-16 lg:h-16 text-zinc-400 shrink-0" />
                            <span className="break-all">{data.repo.owner} <span className="text-zinc-600 font-light">/</span> {data.repo.name}</span>
                        </h1>
                        <p className="text-zinc-400 text-lg lg:text-xl font-medium leading-relaxed max-w-xl">{data.repo.description || "No description provided for this repository."}</p>
                        <div className="flex flex-wrap items-center gap-6 pt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                            <span className="flex items-center gap-2 text-zinc-300">
                                <Star className="w-4 h-4 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" /> 
                                {data.repo.stars.toLocaleString()} 
                                <span className="text-zinc-600 ml-1 underline decoration-zinc-700 underline-offset-8">Recognition Tokens</span>
                            </span>
                            <a href={data.repo.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors group">
                                <ExternalLink className="w-4 h-4" /> 
                                Source Protocol
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                            <MiniKpi icon={<Layers className="w-4 h-4 text-cyan-400" />} label="Detected Signals" value={`${totalSignals}`} />
                            <MiniKpi icon={<Gauge className="w-4 h-4 text-amber-400" />} label="Complexity Tier" value={complexityTier} />
                            <MiniKpi icon={<GitBranch className="w-4 h-4 text-emerald-400" />} label="Repo Scale" value={data.repo.stars > 1000 ? "Mature" : "Emerging"} />
                        </div>
                    </div>
                    <ComplexityGauge score={data.complexityScore} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50" />
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-[0.2em] mb-2">Strategic Narrative</h2>
                                <p className="text-zinc-400 leading-relaxed font-medium">{riskNote}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InsightKpi icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} label="Engineering health" value={`${data.healthScore}/100`} detail={`${data.deliveryRisk} delivery risk`} />
                        <InsightKpi icon={<BrainCircuit className="w-4 h-4 text-violet-400" />} label="ML readiness" value={`${data.mlReadiness}/100`} detail="Data, model & delivery signals" />
                        <InsightKpi icon={<Activity className="w-4 h-4 text-cyan-400" />} label="Repository signals" value={`${data.signals.fileCount}`} detail={`${data.signals.dependencyCount} dependencies · ${data.signals.workflowCount} workflows`} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <IntelligencePanel data={data} />
                        <ActionPanel data={data} />
                    </div>

                    <ArchitectureMap data={data} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                </div>

                <div className="space-y-6">
                    <CategoryBlock
                        title="Core Languages"
                        icon={<BarChart className="text-sky-300" />}
                        items={data.languages}
                        emptyText="No languages detected."
                    />
                    <CategoryBlock
                        title="Engineering Tooling"
                        icon={<Wrench className="text-zinc-400" />}
                        items={data.devtools}
                        emptyText="No specific build tools."
                    />
                </div>
            </div>
        </motion.div>
    );
};

const CategoryBlock = ({ title, icon, items, emptyText }: { title: string; icon: React.ReactNode; items: string[]; emptyText: string }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative bg-slate-900/40 border border-white/10 rounded-[2rem] p-6 hover:bg-slate-900/60 hover:border-cyan-500/30 transition-all duration-500 flex flex-col h-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl min-w-0"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.05),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-4 mb-6">
                <div className="p-3 bg-zinc-950/50 rounded-2xl border border-white/5 shadow-inner group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-500">{icon}</div>
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] group-hover:text-zinc-100 transition-colors">{title}</h3>
            </div>

            <div className="relative z-10 flex-1">
                {items.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                        {items.map((item, i) => (
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 + 0.2 }}
                                key={item}
                                className="px-4 py-2 bg-white/[0.03] text-zinc-100 font-mono text-[11px] font-medium rounded-xl border border-white/5 shadow-sm hover:border-cyan-500/40 hover:bg-white/[0.08] transition-all cursor-default"
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest bg-white/[0.02] p-4 rounded-2xl border border-white/[0.03] italic">{emptyText}</p>
                )}
            </div>
        </motion.div>
    );
};

const MiniKpi = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
    return (
        <div className="rounded-2xl border border-white/5 bg-zinc-950/40 p-4 backdrop-blur-md shadow-inner">
            <div className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] font-bold mb-2 flex items-center gap-2">
                {icon}
                {label}
            </div>
            <p className="text-zinc-100 text-lg font-bold tracking-tight">{value}</p>
        </div>
    );
};

const InsightKpi = ({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) => (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/35 p-5">
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.16em]">{icon}{label}</div>
        <p className="mt-3 text-2xl font-bold text-zinc-100">{value}</p>
        <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
);

const IntelligencePanel = ({ data }: { data: StackReport }) => (
    <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
        <div className="flex items-center gap-3 mb-5"><CircleAlert className="w-5 h-5 text-amber-400" /><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200">Risk intelligence</h2></div>
        <div className="space-y-3">
            {data.findings.slice(0, 4).map((finding) => <div key={finding.id} className="rounded-xl bg-white/[0.035] border border-white/5 p-3.5"><div className="flex justify-between gap-3"><p className="text-sm font-semibold text-zinc-200">{finding.title}</p><span className="text-[9px] uppercase tracking-wider text-amber-300">{finding.severity}</span></div><p className="mt-1 text-xs leading-relaxed text-zinc-500">{finding.detail}</p></div>)}
        </div>
        {data.signals.architecturePatterns.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{data.signals.architecturePatterns.map((pattern) => <span key={pattern} className="rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1 text-[10px] font-medium text-cyan-200">{pattern}</span>)}</div>}
    </div>
);

const ActionPanel = ({ data }: { data: StackReport }) => (
    <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
        <div className="flex items-center gap-3 mb-5"><ClipboardList className="w-5 h-5 text-cyan-400" /><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200">Recommended roadmap</h2></div>
        <div className="space-y-3">
            {data.recommendations.map((item) => <div key={item.title} className="flex gap-3 rounded-xl bg-white/[0.035] border border-white/5 p-3.5"><span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">{item.priority}</span><div><p className="text-sm font-semibold text-zinc-200">{item.title}</p><p className="mt-1 text-xs leading-relaxed text-zinc-500">{item.detail}</p></div></div>)}
        </div>
    </div>
);

const ArchitectureMap = ({ data }: { data: StackReport }) => {
    const colors: Record<string, string> = { application: "border-cyan-400/30 text-cyan-100", service: "border-emerald-400/30 text-emerald-100", data: "border-amber-400/30 text-amber-100", delivery: "border-blue-400/30 text-blue-100", ml: "border-violet-400/30 text-violet-100" };
    return <div className="rounded-3xl border border-white/10 bg-slate-900/35 p-6"><div className="flex items-center gap-3"><GitBranch className="h-5 w-5 text-cyan-400" /><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200">Architecture topology</h2></div><p className="mt-2 text-xs text-zinc-500">High-level components inferred from repository topology and sampled import relationships. Validate boundaries during technical review.</p><div className="mt-6 flex flex-wrap items-center gap-3">{data.architectureGraph.nodes.map((node, index) => <div className="flex items-center gap-3" key={node.id}>{index > 0 && <div className="h-px w-6 bg-white/20" />}<div className={`rounded-xl border bg-white/[0.025] px-4 py-3 text-xs font-semibold ${colors[node.kind]}`}><span className="block text-[9px] uppercase tracking-wider opacity-60">{node.kind}</span>{node.label}</div></div>)}</div>{data.architectureGraph.edges.length > data.architectureGraph.nodes.length - 1 && <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] px-4 py-3 text-xs text-cyan-100">Observed cross-layer evidence: {data.architectureGraph.edges.filter((edge) => edge.label.includes("sampled imports")).map((edge) => `${edge.from} → ${edge.to} (${edge.label})`).join(" · ")}</div>}</div>;
};

const ComplexityGauge = ({ score }: { score: number }) => {
    const isHigh = score > 70;
    const isMed = score > 40;

    const color = isHigh ? "text-rose-500" : isMed ? "text-amber-500" : "text-emerald-500";
    const bgRing = isHigh ? "border-rose-500/20" : isMed ? "border-amber-500/20" : "border-emerald-500/20";
    const accentColor = isHigh ? "shadow-[0_0_30px_rgba(244,63,94,0.3)]" : isMed ? "shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "shadow-[0_0_30px_rgba(16,185,129,0.3)]";

    return (
        <div className={`group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
            
            <span className="relative z-10 text-zinc-500 text-[10px] uppercase font-bold tracking-[0.3em] mb-8">Architecture Index</span>
            
            <div className="relative flex items-center justify-center">
                {/* Tactical Outer Ring */}
                <div className={`absolute inset-0 rounded-full border border-dashed ${bgRing} animate-[spin_30s_linear_infinite] opacity-40`} />
                
                <div className={`relative w-40 h-40 rounded-full border border-white/5 flex flex-col items-center justify-center bg-zinc-950/60 transition-all duration-500 ${accentColor}`}>
                    <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className={`text-6xl font-bold font-mono tracking-tighter ${color}`}
                    >
                        {score}
                    </motion.span>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">/ 100</span>
                </div>
            </div>
        </div>
    );
};
