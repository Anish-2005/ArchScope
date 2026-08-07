"use client";

import { StackReport, Finding } from "@/lib/types";
import {
    Github, Star, ExternalLink, Activity, Link as LinkIcon, Check, ShieldAlert,
    Layers, GitBranch, BrainCircuit, ShieldCheck, ClipboardList, CircleAlert,
    Download, FileText, Printer, ChevronRight, Zap, Database, Cloud, Server,
    Box, Wrench, Code2, TrendingUp, AlertTriangle, Info, Eye, BarChart2,
    Map, Flame, Package, GitPullRequest
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Logo } from "./Logo";
import { DependencyGraph } from "./DependencyGraph";
import { TechDebtHeatmap } from "./TechDebtHeatmap";
import { RiskTrendline } from "./RiskTrendline";
import { exportToPdf, exportToCsv } from "@/lib/export";

// ─── Severity Config ────────────────────────────────────────────────────────
const SEVERITY_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    critical: { bg: "bg-rose-500/15", text: "text-rose-200", border: "border-rose-500/40", dot: "bg-rose-400" },
    high:     { bg: "bg-orange-500/15", text: "text-orange-200", border: "border-orange-500/40", dot: "bg-orange-400" },
    medium:   { bg: "bg-amber-500/15", text: "text-amber-200", border: "border-amber-500/40", dot: "bg-amber-400" },
    low:      { bg: "bg-cyan-500/10", text: "text-cyan-200", border: "border-cyan-500/30", dot: "bg-cyan-400" },
    info:     { bg: "bg-zinc-500/10", text: "text-zinc-300", border: "border-zinc-500/20", dot: "bg-zinc-400" },
};

const PRIORITY_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
    now:  { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30", label: "Act Now" },
    next: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30", label: "This Sprint" },
    later:{ bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/20", label: "Backlog" },
};

// ─── Tab Definitions ────────────────────────────────────────────────────────
const TABS = [
    { id: "overview",  label: "Overview",     icon: Eye },
    { id: "stack",     label: "Stack",        icon: Layers },
    { id: "findings",  label: "Findings",     icon: AlertTriangle },
    { id: "roadmap",   label: "Roadmap",      icon: ClipboardList },
    { id: "topology",  label: "Topology",     icon: Map },
    { id: "trends",    label: "Trends",       icon: TrendingUp },
] as const;
type TabId = typeof TABS[number]["id"];

// ─── Main Export ─────────────────────────────────────────────────────────────
export const ReportCard = ({ data }: { data: StackReport }) => {
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [copied, setCopied] = useState(false);
    const [selectedKind, setSelectedKind] = useState<string | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

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
        const a = document.createElement("a");
        a.href = url;
        a.download = `archscope-${data.repo.owner}-${data.repo.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const criticalCount = data.findings.filter(f => f.severity === "critical" || f.severity === "high").length;
    const totalSignals = data.languages.length + data.frameworks.length + data.frontend.length + data.backend.length + data.database.length + data.infrastructure.length + data.devtools.length;

    return (
        <motion.div
            ref={topRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-0"
        >
            {/* ── Hero Banner ───────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                {/* Background decorations */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_-20%,rgba(34,211,238,0.15),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_110%,rgba(139,92,246,0.1),transparent_60%)]" />
                    <div className="absolute -right-20 -top-20 h-80 w-80 opacity-[0.025]"><Logo size={320} /></div>
                </div>

                <div className="relative z-10 p-7 sm:p-10 lg:p-14">
                    {/* Top strip: status + actions */}
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

                        {/* Export toolbar */}
                        <div className="flex items-center gap-2">
                            <button onClick={() => exportToPdf(data)} className="group inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-all hover:bg-cyan-400/20 hover:border-cyan-400/40">
                                <FileText className="h-3.5 w-3.5" /> PDF
                            </button>
                            <button onClick={() => exportToCsv(data)} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/10">
                                <Download className="h-3.5 w-3.5" /> CSV
                            </button>
                            <button onClick={exportJson} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/10">
                                <Code2 className="h-3.5 w-3.5" /> JSON
                            </button>
                            <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/10">
                                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <LinkIcon className="h-3.5 w-3.5" />}
                                {copied ? "Copied" : "Share"}
                            </button>
                            <button onClick={() => window.print()} className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/10">
                                <Printer className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Repo identity + score */}
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-4 max-w-2xl">
                            {/* Repo name */}
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

                            {p(data.repo.description)}

                            {/* Meta row */}
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

                        {/* Score dials */}
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

                    {/* Quick KPI strip */}
                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <QuickKpi icon={<Activity className="h-4 w-4 text-cyan-400" />} label="Delivery Risk" value={data.deliveryRisk.toUpperCase()} valueColor={data.deliveryRisk === "high" ? "text-rose-300" : data.deliveryRisk === "medium" ? "text-amber-300" : "text-emerald-300"} />
                        <QuickKpi icon={<Package className="h-4 w-4 text-violet-400" />} label="Dependencies" value={data.signals.dependencyCount.toString()} />
                        <QuickKpi icon={<GitPullRequest className="h-4 w-4 text-sky-400" />} label="CI Workflows" value={data.signals.workflowCount.toString()} />
                        <QuickKpi icon={<Zap className="h-4 w-4 text-amber-400" />} label="Test Signals" value={data.signals.testSignals.toString()} />
                    </div>
                </div>
            </div>

            {/* ── Tab Navigation ────────────────────────────────────────── */}
            <div className="sticky top-[64px] z-40 mt-6 mb-0">
                <div className="relative rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 backdrop-blur-2xl shadow-xl">
                    <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const findingsBadge = tab.id === "findings" && data.findings.length > 0 ? data.findings.length : null;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                                        isActive
                                            ? "bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {tab.label}
                                    {findingsBadge && (
                                        <span className={`ml-1 rounded-full px-1.5 py-px text-[9px] font-bold ${isActive ? "bg-slate-950/30 text-slate-950" : "bg-rose-500/20 text-rose-300"}`}>
                                            {findingsBadge}
                                        </span>
                                    )}
                                    {isActive && (
                                        <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded-xl bg-cyan-400 -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Tab Content ───────────────────────────────────────────── */}
            <div className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                    >
                        {activeTab === "overview"  && <OverviewTab data={data} />}
                        {activeTab === "stack"     && <StackTab data={data} />}
                        {activeTab === "findings"  && <FindingsTab data={data} />}
                        {activeTab === "roadmap"   && <RoadmapTab data={data} />}
                        {activeTab === "topology"  && <TopologyTab data={data} selectedKind={selectedKind} onSelectKind={setSelectedKind} />}
                        {activeTab === "trends"    && <TrendsTab data={data} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ─── Helper: description ─────────────────────────────────────────────────────
const p = (desc: string | null) =>
    desc ? <p className="max-w-xl text-sm leading-relaxed text-zinc-300 font-medium">{desc}</p> : null;


// ─── Score Dial ──────────────────────────────────────────────────────────────
const DIAL_COLORS: Record<string, { ring: string; text: string; glow: string; track: string }> = {
    emerald: { ring: "stroke-emerald-400", text: "text-emerald-300", glow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]", track: "stroke-emerald-900/50" },
    amber:   { ring: "stroke-amber-400", text: "text-amber-300", glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]", track: "stroke-amber-900/50" },
    rose:    { ring: "stroke-rose-400", text: "text-rose-300", glow: "shadow-[0_0_30px_rgba(244,63,94,0.3)]", track: "stroke-rose-900/50" },
    violet:  { ring: "stroke-violet-400", text: "text-violet-300", glow: "shadow-[0_0_30px_rgba(167,139,250,0.3)]", track: "stroke-violet-900/50" },
    cyan:    { ring: "stroke-cyan-400", text: "text-cyan-300", glow: "shadow-[0_0_30px_rgba(34,211,238,0.3)]", track: "stroke-cyan-900/50" },
    zinc:    { ring: "stroke-zinc-400", text: "text-zinc-300", glow: "", track: "stroke-zinc-800" },
};

const ScoreDial = ({ label, score, icon, color, invert }: { label: string; score: number; icon: React.ReactNode; color: string; invert?: boolean }) => {
    const c = DIAL_COLORS[color] || DIAL_COLORS.zinc;
    const r = 34;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(100, Math.max(0, score));
    const dash = (pct / 100) * circ;

    return (
        <div className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-slate-950/80 px-6 py-5 shadow-xl backdrop-blur-xl ${c.glow}`}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
            <div className="relative">
                <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
                    <circle cx="45" cy="45" r={r} fill="none" strokeWidth="6" className={c.track} />
                    <motion.circle
                        cx="45" cy="45" r={r} fill="none" strokeWidth="6"
                        strokeLinecap="round"
                        className={c.ring}
                        strokeDasharray={circ}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: circ - dash }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className={`text-xl font-extrabold font-mono ${c.text}`}>
                        {score}
                    </motion.span>
                </div>
            </div>
            <div className={`flex items-center gap-1 text-[9px] font-semibold ${c.text}`}>{icon} {invert ? (score > 70 ? "High Load" : score > 40 ? "Moderate" : "Lean") : (score > 70 ? "Excellent" : score > 45 ? "Fair" : "Needs Work")}</div>
        </div>
    );
};

// ─── Quick KPI Strip ─────────────────────────────────────────────────────────
const QuickKpi = ({ icon, label, value, valueColor = "text-zinc-100" }: { icon: React.ReactNode; label: string; value: string; valueColor?: string }) => (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
        <div className="shrink-0">{icon}</div>
        <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">{label}</p>
            <p className={`text-sm font-extrabold font-mono ${valueColor}`}>{value}</p>
        </div>
    </div>
);


// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
const OverviewTab = ({ data }: { data: StackReport }) => {
    const riskNarrative = data.complexityScore > 70
        ? "High operational overhead detected. This codebase carries significant technology breadth that introduces coordination costs. Standardization and platform engineering guardrails are strongly recommended before further scaling."
        : data.complexityScore > 40
            ? "Balanced complexity profile. The architecture is growing in breadth. Establishing shared patterns and internal platform conventions now will pay compounding dividends as the team scales."
            : "Lean and intentional architecture. The repository shows a coherent, focused technology profile. Preserve this simplicity by enforcing strict dependency budgets as the codebase evolves.";

    return (
        <div className="space-y-5">
            {/* Narrative + Signals */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Strategic Narrative */}
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
                                    {data.signals.architecturePatterns.map(p => (
                                        <span key={p} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-mono text-cyan-300">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Signals Panel */}
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

            {/* Top Findings Preview */}
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
                        {data.findings.slice(0, 4).map(f => <FindingCard key={f.id} finding={f} compact />)}
                    </div>
                </div>
            )}

            {/* Top Recommendations Preview */}
            {data.recommendations.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-7 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                            <Zap className="h-4 w-4 text-emerald-400" />
                        </div>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Immediate Action Items</h2>
                    </div>
                    <div className="space-y-2">
                        {data.recommendations.filter(r => r.priority === "now").slice(0, 3).map((r, i) => (
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

const SignalBar = ({ label, value, max, color, invert }: { label: string; value: number; max: number; color: string; invert?: boolean }) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const barColors: Record<string, string> = {
        cyan: "bg-cyan-400", emerald: "bg-emerald-400", violet: "bg-violet-400", amber: "bg-amber-400"
    };
    const good = invert ? pct < 50 : pct > 60;
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium text-zinc-400">{label}</span>
                <span className={`text-[10px] font-bold font-mono ${good ? "text-emerald-400" : pct > 30 ? "text-amber-400" : "text-rose-400"}`}>
                    {Math.round(pct)}%
                </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.05]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-1.5 rounded-full ${barColors[color]}`}
                />
            </div>
        </div>
    );
};

const MiniStat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 text-center">
        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
        <p className="text-lg font-extrabold font-mono text-zinc-100">{value}</p>
    </div>
);

// ─── STACK TAB ───────────────────────────────────────────────────────────────
const STACK_SECTIONS = [
    { key: "languages" as const,       label: "Languages",        icon: <Code2 className="h-4 w-4 text-cyan-400" />,    accent: "cyan"    },
    { key: "frameworks" as const,      label: "Frameworks",       icon: <Layers className="h-4 w-4 text-sky-400" />,    accent: "sky"     },
    { key: "frontend" as const,        label: "Frontend",         icon: <Box className="h-4 w-4 text-violet-400" />,    accent: "violet"  },
    { key: "backend" as const,         label: "Backend",          icon: <Server className="h-4 w-4 text-emerald-400" />,accent: "emerald" },
    { key: "database" as const,        label: "Data & Storage",   icon: <Database className="h-4 w-4 text-amber-400" />,accent: "amber"   },
    { key: "infrastructure" as const,  label: "Infrastructure",   icon: <Cloud className="h-4 w-4 text-indigo-400" />,  accent: "indigo"  },
    { key: "devtools" as const,        label: "DevTools",         icon: <Wrench className="h-4 w-4 text-zinc-400" />,   accent: "zinc"    },
];

const TAG_ACCENT: Record<string, string> = {
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 hover:border-cyan-400/50",
    sky: "border-sky-400/25 bg-sky-400/10 text-sky-200 hover:border-sky-400/50",
    violet: "border-violet-400/25 bg-violet-400/10 text-violet-200 hover:border-violet-400/50",
    emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200 hover:border-emerald-400/50",
    amber: "border-amber-400/25 bg-amber-400/10 text-amber-200 hover:border-amber-400/50",
    indigo: "border-indigo-400/25 bg-indigo-400/10 text-indigo-200 hover:border-indigo-400/50",
    zinc: "border-zinc-500/25 bg-zinc-500/10 text-zinc-300 hover:border-zinc-400/50",
};

const StackTab = ({ data }: { data: StackReport }) => (
    <div className="space-y-4">
        {STACK_SECTIONS.filter(s => data[s.key].length > 0).map((section, si) => (
            <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.06 }}
                className="group rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur-xl hover:border-white/20 transition-all"
            >
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:bg-white/[0.07] transition-all">
                            {section.icon}
                        </div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-300">{section.label}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{data[section.key].length} detected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data[section.key].map((item, i) => (
                        <motion.span
                            key={item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: si * 0.06 + i * 0.03 }}
                            className={`cursor-default rounded-xl border px-4 py-2 text-xs font-semibold font-mono transition-all ${TAG_ACCENT[section.accent]}`}
                        >
                            {item}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        ))}
    </div>
);


// ─── FINDINGS TAB ────────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    security:     <ShieldCheck className="h-3.5 w-3.5" />,
    delivery:     <GitPullRequest className="h-3.5 w-3.5" />,
    architecture: <GitBranch className="h-3.5 w-3.5" />,
    data:         <Database className="h-3.5 w-3.5" />,
    ml:           <BrainCircuit className="h-3.5 w-3.5" />,
};

const FindingsTab = ({ data }: { data: StackReport }) => {
    const [filter, setFilter] = useState<string>("all");
    const severities = ["all", "critical", "high", "medium", "low", "info"];
    const filtered = filter === "all" ? data.findings : data.findings.filter(f => f.severity === filter);
    const counts = severities.reduce((acc, s) => {
        acc[s] = s === "all" ? data.findings.length : data.findings.filter(f => f.severity === s).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-5">
            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur-xl">
                {severities.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                            filter === s
                                ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                        }`}
                    >
                        {s} {counts[s] > 0 && <span className={`ml-1 ${filter === s ? "opacity-70" : "opacity-60"}`}>({counts[s]})</span>}
                    </button>
                ))}
            </div>

            {/* Findings grid */}
            <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center rounded-3xl border border-white/[0.05] bg-slate-950/40">
                        <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto mb-3 opacity-60" />
                        <p className="text-zinc-400 text-sm font-medium">No findings at this severity level.</p>
                    </motion.div>
                ) : (
                    <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filtered.map((f, i) => (
                            <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}>
                                <FindingCard finding={f} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FindingCard = ({ finding, compact }: { finding: Finding; compact?: boolean }) => {
    const [open, setOpen] = useState(false);
    const cfg = SEVERITY_CONFIG[finding.severity] || SEVERITY_CONFIG.info;

    return (
        <div
            className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4 sm:p-5 transition-all cursor-pointer hover:brightness-110`}
            onClick={() => !compact && setOpen(o => !o)}
        >
            <div className="flex items-start gap-3">
                <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={`text-sm font-bold ${cfg.text} leading-snug`}>{finding.title}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.text}`}>
                                {finding.severity}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 text-[9px] font-semibold opacity-60 ${cfg.text}`}>
                            {CATEGORY_ICONS[finding.category]} {finding.category}
                        </span>
                    </div>
                    <AnimatePresence>
                        {(open || compact) && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mt-2.5 text-xs leading-relaxed opacity-75 ${cfg.text}`}
                            >
                                {finding.detail}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    {!compact && (
                        <p className={`mt-2 text-[9px] font-mono opacity-40 ${cfg.text}`}>
                            {open ? "Click to collapse" : "Click to expand"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── ROADMAP TAB ─────────────────────────────────────────────────────────────
const RoadmapTab = ({ data }: { data: StackReport }) => {
    const groups: Record<string, typeof data.recommendations> = {
        now:   data.recommendations.filter(r => r.priority === "now"),
        next:  data.recommendations.filter(r => r.priority === "next"),
        later: data.recommendations.filter(r => r.priority === "later"),
    };

    return (
        <div className="space-y-6">
            {(["now", "next", "later"] as const).map((priority) => {
                const cfg = PRIORITY_CONFIG[priority];
                const items = groups[priority];
                if (items.length === 0) return null;
                return (
                    <div key={priority} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`rounded-full border px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                {cfg.label}
                            </span>
                            <span className="text-xs text-zinc-500 font-mono">{items.length} item{items.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-white/[0.14] transition-all"
                                >
                                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border ${cfg.border} ${cfg.bg} text-xs font-bold font-mono ${cfg.text}`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-100 mb-1">{item.title}</p>
                                        <p className="text-xs leading-relaxed text-zinc-400">{item.detail}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ─── TOPOLOGY TAB ────────────────────────────────────────────────────────────
const LAYER_COLORS: Record<string, string> = {
    application: "border-cyan-400/40 text-cyan-200 bg-cyan-500/10",
    service:     "border-emerald-400/40 text-emerald-200 bg-emerald-500/10",
    data:        "border-amber-400/40 text-amber-200 bg-amber-500/10",
    delivery:    "border-sky-400/40 text-sky-200 bg-sky-500/10",
    ml:          "border-violet-400/40 text-violet-200 bg-violet-500/10",
};

const TopologyTab = ({ data, selectedKind, onSelectKind }: { data: StackReport; selectedKind: string | null; onSelectKind: (k: string | null) => void }) => {
    const kinds = Array.from(new Set(data.architectureGraph.nodes.map(n => n.kind)));

    return (
        <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
                {/* Layer filter */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <button onClick={() => onSelectKind(null)} className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${selectedKind === null ? "bg-cyan-400 text-slate-950" : "bg-white/[0.05] text-zinc-400 hover:text-zinc-200"}`}>
                        All Layers
                    </button>
                    {kinds.map(k => (
                        <button key={k} onClick={() => onSelectKind(selectedKind === k ? null : k)} className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${selectedKind === k ? "bg-cyan-400 text-slate-950" : "bg-white/[0.05] text-zinc-400 hover:text-zinc-200"}`}>
                            {k}
                        </button>
                    ))}
                </div>

                {/* Interactive graph */}
                <DependencyGraph graph={data.architectureGraph} selectedKind={selectedKind} />

                {/* Node chips */}
                {data.architectureGraph.nodes.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-white/[0.06]">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Component Index</p>
                        <div className="flex flex-wrap gap-2">
                            {data.architectureGraph.nodes
                                .filter(n => selectedKind === null || n.kind === selectedKind)
                                .map(node => (
                                    <div key={node.id} className={`rounded-xl border px-3 py-2 ${LAYER_COLORS[node.kind] || "border-white/20 text-zinc-200 bg-white/5"}`}>
                                        <span className="block text-[8px] font-mono uppercase tracking-widest opacity-60 mb-0.5">{node.kind}</span>
                                        <span className="text-xs font-semibold">{node.label}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {data.architectureGraph.edges.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] px-5 py-3.5">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-400 mb-2">Observed Connections</p>
                        <p className="text-xs font-mono text-cyan-200/70">
                            {data.architectureGraph.edges.map(e => `${e.from} → ${e.to}`).join(" · ")}
                        </p>
                    </div>
                )}
            </div>

            <TechDebtHeatmap findings={data.findings} />
        </div>
    );
};

// ─── TRENDS TAB ──────────────────────────────────────────────────────────────
const TrendsTab = ({ data }: { data: StackReport }) => (
    <div className="space-y-5">
        <RiskTrendline repo={`${data.repo.owner}/${data.repo.name}`} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
                { label: "Score Percentile", value: `${Math.max(5, 100 - data.complexityScore)}th`, sub: "vs. avg repo", color: "text-cyan-300" },
                { label: "Risk Momentum", value: data.deliveryRisk === "low" ? "Stable ↗" : data.deliveryRisk === "medium" ? "Caution →" : "Drift ↘", sub: "trending direction", color: data.deliveryRisk === "low" ? "text-emerald-300" : data.deliveryRisk === "medium" ? "text-amber-300" : "text-rose-300" },
                { label: "Open Findings", value: `${data.findings.length}`, sub: `${data.findings.filter(f => ["critical","high"].includes(f.severity)).length} high priority`, color: "text-orange-300" },
            ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur-xl text-center">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">{stat.label}</p>
                    <p className={`text-3xl font-extrabold font-mono ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-zinc-500 mt-1.5 font-medium">{stat.sub}</p>
                </div>
            ))}
        </div>
    </div>
);
