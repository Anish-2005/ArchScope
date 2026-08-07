import { StackReport } from "@/lib/types";
import { Github, Star, Box, Server, Database, Cloud, Wrench, BarChart, ExternalLink, Activity, Link as LinkIcon, Check, ShieldAlert, Gauge, Layers, GitBranch, BrainCircuit, ShieldCheck, ClipboardList, CircleAlert, Download, Printer, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Logo } from "./Logo";
import { DependencyGraph } from "./DependencyGraph";
import { TechDebtHeatmap } from "./TechDebtHeatmap";
import { RiskTrendline } from "./RiskTrendline";
import { exportToPdf, exportToCsv } from "@/lib/export";

export const ReportCard = ({ data }: { data: StackReport }) => {
    const [copied, setCopied] = useState(false);
    const [selectedKind, setSelectedKind] = useState<string | null>(null);

    const totalSignals = data.languages.length + data.frameworks.length + data.frontend.length + data.backend.length + data.database.length + data.infrastructure.length + data.devtools.length;
    const complexityTier = data.complexityScore > 70 ? "High Risk" : data.complexityScore > 40 ? "Moderate" : "Optimized";
    const riskNote = data.complexityScore > 70
        ? "High operational overhead likely. Standardization and platform guardrails are strongly recommended."
        : data.complexityScore > 40
            ? "Balanced but growing complexity. Establish common architectural patterns before scaling."
            : "Lean architecture profile. Preserve consistency and monitor stack drift as the codebase expands.";

    const handleCopy = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const exportJson = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `archscope-${data.repo.owner}-${data.repo.name}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 sm:space-y-12">
            {/* Header Executive Banner */}
            <div className="glass-panel rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden backdrop-blur-2xl shadow-[0_48px_128px_-32px_rgba(0,0,0,0.8)] border border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.12),transparent_60%)] pointer-events-none" />
                <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none select-none">
                    <Logo size={480} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                    <div className="space-y-6 max-w-2xl w-full">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                <Activity className="h-3 w-3 animate-pulse text-cyan-400" />
                                Analysis Protocol Verified
                            </div>
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-all px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white"
                            >
                                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <LinkIcon className="h-3 w-3" />}
                                {copied ? "Link Copied to Clipboard" : "Share Executive Brief"}
                            </button>
                            <button onClick={() => exportToPdf(data)} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 transition-all px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"><FileText className="h-3 w-3" /> Export PDF</button>
                            <button onClick={() => exportToCsv(data)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-all px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white"><Download className="h-3 w-3" /> CSV</button>
                            <button onClick={exportJson} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-all px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white"><Download className="h-3 w-3" /> JSON</button>
                            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-all px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white"><Printer className="h-3 w-3" /> Print</button>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-zinc-50 flex flex-wrap items-center gap-3 leading-tight tracking-tight">
                            <Github className="w-10 h-10 lg:w-14 lg:h-14 text-cyan-400 shrink-0" />
                            <span className="break-all">{data.repo.owner} <span className="text-zinc-600 font-light">/</span> {data.repo.name}</span>
                        </h1>
                        <p className="text-zinc-300 text-base lg:text-lg font-medium leading-relaxed max-w-xl">{data.repo.description || "No description provided for this repository."}</p>
                        <div className="flex flex-wrap items-center gap-6 pt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                            <span className="flex items-center gap-2 text-zinc-200">
                                <Star className="w-4 h-4 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]" /> 
                                {data.repo.stars.toLocaleString()} Stars
                            </span>
                            <a href={data.repo.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors group">
                                <ExternalLink className="w-4 h-4" /> 
                                View Source Code
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                            <MiniKpi icon={<Layers className="w-4 h-4 text-cyan-400" />} label="Detected Signals" value={`${totalSignals}`} />
                            <MiniKpi icon={<Gauge className="w-4 h-4 text-amber-400" />} label="Complexity Risk" value={complexityTier} />
                            <MiniKpi icon={<GitBranch className="w-4 h-4 text-emerald-400" />} label="Scale Class" value={data.repo.stars > 1000 ? "Mature Production" : "Emerging Project"} />
                        </div>
                    </div>
                    <ComplexityGauge score={data.complexityScore} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-50 pointer-events-none" />
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0 shadow-lg">
                                <ShieldAlert className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-[0.2em] mb-1.5">Executive Strategic Narrative</h2>
                                <p className="text-zinc-300 leading-relaxed font-medium text-sm">{riskNote}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InsightKpi icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} label="Engineering Health" value={`${data.healthScore}/100`} detail={`${data.deliveryRisk} delivery risk profile`} />
                        <InsightKpi icon={<BrainCircuit className="w-4 h-4 text-violet-400" />} label="ML & AI Readiness" value={`${data.mlReadiness}/100`} detail="Data, model & delivery signals" />
                        <InsightKpi icon={<Activity className="w-4 h-4 text-cyan-400" />} label="Codebase Scale" value={`${data.signals.fileCount} Files`} detail={`${data.signals.dependencyCount} deps · ${data.signals.workflowCount} workflows`} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <IntelligencePanel data={data} />
                        <ActionPanel data={data} />
                    </div>

                    <RiskTrendline repo={`${data.repo.owner}/${data.repo.name}`} />

                    <ArchitectureMap data={data} selectedKind={selectedKind} onSelectKind={setSelectedKind} />

                    <TechDebtHeatmap findings={data.findings} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <CategoryBlock
                            title="Frameworks"
                            icon={<Layers className="text-cyan-400" />}
                            items={data.frameworks}
                            emptyText="No framework signatures detected."
                        />
                        <CategoryBlock
                            title="Frontend Ecosystem"
                            icon={<Box className="text-sky-400" />}
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
                        icon={<BarChart className="text-cyan-300" />}
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
            className="group relative glass-panel rounded-[2rem] p-6 hover:border-cyan-400/40 transition-all duration-500 flex flex-col h-full shadow-2xl backdrop-blur-xl min-w-0"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.06),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-3.5 mb-5">
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-white/10 shadow-inner group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-500">{icon}</div>
                <h3 className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em] group-hover:text-cyan-300 transition-colors">{title}</h3>
            </div>

            <div className="relative z-10 flex-1">
                {items.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {items.map((item, i) => (
                            <motion.span
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 + 0.1 }}
                                key={item}
                                className="px-3.5 py-1.5 bg-white/[0.05] text-zinc-100 font-mono text-[11px] font-medium rounded-xl border border-white/10 shadow-sm hover:border-cyan-400/40 hover:bg-white/10 transition-all cursor-default"
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest bg-white/[0.02] p-4 rounded-xl border border-white/[0.03] italic">{emptyText}</p>
                )}
            </div>
        </motion.div>
    );
};

const MiniKpi = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-md shadow-inner">
            <div className="text-zinc-400 text-[9px] uppercase tracking-[0.2em] font-bold mb-1.5 flex items-center gap-2">
                {icon}
                {label}
            </div>
            <p className="text-zinc-100 text-base font-bold tracking-tight">{value}</p>
        </div>
    );
};

const InsightKpi = ({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) => (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.16em]">{icon}{label}</div>
        <p className="mt-2.5 text-2xl font-extrabold text-zinc-50 font-mono">{value}</p>
        <p className="mt-1 text-xs text-zinc-400 font-medium">{detail}</p>
    </div>
);

const IntelligencePanel = ({ data }: { data: StackReport }) => (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4"><CircleAlert className="w-5 h-5 text-amber-400" /><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200">Risk Intelligence</h2></div>
        <div className="space-y-3">
            {data.findings.slice(0, 4).map((finding) => (
                <div key={finding.id} className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 hover:border-amber-400/30 transition-all">
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <p className="text-sm font-semibold text-zinc-100">{finding.title}</p>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${finding.severity === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : finding.severity === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                            {finding.severity}
                        </span>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-400">{finding.detail}</p>
                </div>
            ))}
        </div>
        {data.signals.architecturePatterns.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-white/5">
                {data.signals.architecturePatterns.map((pattern) => (
                    <span key={pattern} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-mono text-cyan-200">
                        {pattern}
                    </span>
                ))}
            </div>
        )}
    </div>
);

const ActionPanel = ({ data }: { data: StackReport }) => (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4"><ClipboardList className="w-5 h-5 text-cyan-400" /><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200">Recommended Roadmap</h2></div>
        <div className="space-y-3">
            {data.recommendations.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl bg-white/[0.03] border border-white/10 p-4 hover:border-cyan-400/30 transition-all">
                    <span className={`mt-0.5 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 h-fit rounded-full ${item.priority === 'now' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : item.priority === 'next' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                        {item.priority}
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-zinc-100">{item.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">{item.detail}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ArchitectureMap = ({ data, selectedKind, onSelectKind }: { data: StackReport; selectedKind: string | null; onSelectKind: (kind: string | null) => void }) => {
    const colors: Record<string, string> = {
        application: "border-cyan-400/40 text-cyan-200 bg-cyan-500/10",
        service: "border-emerald-400/40 text-emerald-200 bg-emerald-500/10",
        data: "border-amber-400/40 text-amber-200 bg-amber-500/10",
        delivery: "border-sky-400/40 text-sky-200 bg-sky-500/10",
        ml: "border-violet-400/40 text-violet-200 bg-violet-500/10"
    };

    const kinds = Array.from(new Set(data.architectureGraph.nodes.map(n => n.kind)));

    return (
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                    <GitBranch className="h-5 w-5 text-cyan-400" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200">Architecture Topology Map</h2>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    <button 
                        onClick={() => onSelectKind(null)} 
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${selectedKind === null ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-zinc-400 hover:text-zinc-200'}`}
                    >
                        All Layers
                    </button>
                    {kinds.map(k => (
                        <button 
                            key={k} 
                            onClick={() => onSelectKind(selectedKind === k ? null : k)} 
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${selectedKind === k ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-zinc-400 hover:text-zinc-200'}`}
                        >
                            {k}
                        </button>
                    ))}
                </div>
            </div>
            <p className="text-xs text-zinc-400 mb-6">Inferred component node relationships derived from repository structure and manifest dependencies.</p>
            
            <div className="mb-6">
                <DependencyGraph graph={data.architectureGraph} selectedKind={selectedKind} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {data.architectureGraph.nodes
                    .filter(node => selectedKind === null || node.kind === selectedKind)
                    .map((node, index) => (
                        <div className="flex items-center gap-3" key={node.id}>
                            {index > 0 && <div className="h-0.5 w-6 bg-cyan-400/40 rounded-full" />}
                            <div className={`rounded-2xl border px-4 py-3 text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105 ${colors[node.kind] || "border-white/20 text-zinc-200 bg-white/5"}`}>
                                <span className="block text-[9px] font-mono uppercase tracking-widest opacity-70 mb-0.5">{node.kind}</span>
                                {node.label}
                            </div>
                        </div>
                    ))}
            </div>

            {data.architectureGraph.edges.length > 0 && (
                <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-xs text-cyan-200 font-mono">
                    Observed Connections: {data.architectureGraph.edges.map((edge) => `${edge.from} → ${edge.to}`).join(" · ")}
                </div>
            )}
        </div>
    );
};

const ComplexityGauge = ({ score }: { score: number }) => {
    const isHigh = score > 70;
    const isMed = score > 40;

    const color = isHigh ? "text-rose-400" : isMed ? "text-amber-400" : "text-emerald-400";
    const bgRing = isHigh ? "border-rose-500/30" : isMed ? "border-amber-500/30" : "border-emerald-500/30";
    const accentColor = isHigh ? "shadow-[0_0_40px_rgba(244,63,94,0.25)]" : isMed ? "shadow-[0_0_40px_rgba(245,158,11,0.25)]" : "shadow-[0_0_40px_rgba(16,185,129,0.25)]";

    return (
        <div className="group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-slate-950/80 border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_70%)] pointer-events-none" />
            
            <span className="relative z-10 text-zinc-400 text-[10px] uppercase font-bold tracking-[0.25em] mb-6">Architecture Index</span>
            
            <div className="relative flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border border-dashed ${bgRing} animate-[spin_30s_linear_infinite] opacity-60`} />
                
                <div className={`relative w-36 h-36 rounded-full border border-white/10 flex flex-col items-center justify-center bg-slate-950 transition-all duration-500 ${accentColor}`}>
                    <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className={`text-5xl font-extrabold font-mono tracking-tighter ${color}`}
                    >
                        {score}
                    </motion.span>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">/ 100</span>
                </div>
            </div>
        </div>
    );
};
