import {
    Eye, Layers, AlertTriangle, ClipboardList, Map, TrendingUp,
    ShieldCheck, GitPullRequest, GitBranch, Database, BrainCircuit,
    Code2, Box, Server, Cloud, Wrench,
} from "lucide-react";
import type { StackReport } from "@/lib/types";

// ─── Severity Config ────────────────────────────────────────────────────────
export const SEVERITY_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    critical: { bg: "bg-rose-500/15", text: "text-rose-200", border: "border-rose-500/40", dot: "bg-rose-400" },
    high:     { bg: "bg-orange-500/15", text: "text-orange-200", border: "border-orange-500/40", dot: "bg-orange-400" },
    medium:   { bg: "bg-amber-500/15", text: "text-amber-200", border: "border-amber-500/40", dot: "bg-amber-400" },
    low:      { bg: "bg-cyan-500/10", text: "text-cyan-200", border: "border-cyan-500/30", dot: "bg-cyan-400" },
    info:     { bg: "bg-zinc-500/10", text: "text-zinc-300", border: "border-zinc-500/20", dot: "bg-zinc-400" },
};

export const PRIORITY_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
    now:  { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30", label: "Act Now" },
    next: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30", label: "This Sprint" },
    later:{ bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/20", label: "Backlog" },
};

// ─── Tab Definitions ────────────────────────────────────────────────────────
export const TABS = [
    { id: "overview",  label: "Overview",     icon: Eye },
    { id: "stack",     label: "Stack",        icon: Layers },
    { id: "findings",  label: "Findings",     icon: AlertTriangle },
    { id: "roadmap",   label: "Roadmap",      icon: ClipboardList },
    { id: "topology",  label: "Topology",     icon: Map },
    { id: "trends",    label: "Trends",       icon: TrendingUp },
] as const;

export type TabId = (typeof TABS)[number]["id"];

// ─── Score Dial ─────────────────────────────────────────────────────────────
export const DIAL_COLORS: Record<string, { ring: string; text: string; glow: string; track: string }> = {
    emerald: { ring: "stroke-emerald-400", text: "text-emerald-300", glow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]", track: "stroke-emerald-900/50" },
    amber:   { ring: "stroke-amber-400", text: "text-amber-300", glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]", track: "stroke-amber-900/50" },
    rose:    { ring: "stroke-rose-400", text: "text-rose-300", glow: "shadow-[0_0_30px_rgba(244,63,94,0.3)]", track: "stroke-rose-900/50" },
    violet:  { ring: "stroke-violet-400", text: "text-violet-300", glow: "shadow-[0_0_30px_rgba(167,139,250,0.3)]", track: "stroke-violet-900/50" },
    cyan:    { ring: "stroke-cyan-400", text: "text-cyan-300", glow: "shadow-[0_0_30px_rgba(34,211,238,0.3)]", track: "stroke-cyan-900/50" },
    zinc:    { ring: "stroke-zinc-400", text: "text-zinc-300", glow: "", track: "stroke-zinc-800" },
};

// ─── Stack Sections ─────────────────────────────────────────────────────────
type StackSectionKey = "languages" | "frameworks" | "frontend" | "backend" | "database" | "infrastructure" | "devtools";

export const STACK_SECTIONS: { key: StackSectionKey; label: string; icon: React.ReactNode; accent: string }[] = [
    { key: "languages",       label: "Languages",        icon: <Code2 className="h-4 w-4 text-cyan-400" />,       accent: "cyan"    },
    { key: "frameworks",      label: "Frameworks",       icon: <Layers className="h-4 w-4 text-sky-400" />,       accent: "sky"     },
    { key: "frontend",        label: "Frontend",         icon: <Box className="h-4 w-4 text-violet-400" />,       accent: "violet"  },
    { key: "backend",         label: "Backend",          icon: <Server className="h-4 w-4 text-emerald-400" />,  accent: "emerald" },
    { key: "database",        label: "Data & Storage",   icon: <Database className="h-4 w-4 text-amber-400" />,   accent: "amber"   },
    { key: "infrastructure",  label: "Infrastructure",   icon: <Cloud className="h-4 w-4 text-indigo-400" />,    accent: "indigo"  },
    { key: "devtools",        label: "DevTools",         icon: <Wrench className="h-4 w-4 text-zinc-400" />,     accent: "zinc"    },
];

export const TAG_ACCENT: Record<string, string> = {
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 hover:border-cyan-400/50",
    sky: "border-sky-400/25 bg-sky-400/10 text-sky-200 hover:border-sky-400/50",
    violet: "border-violet-400/25 bg-violet-400/10 text-violet-200 hover:border-violet-400/50",
    emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200 hover:border-emerald-400/50",
    amber: "border-amber-400/25 bg-amber-400/10 text-amber-200 hover:border-amber-400/50",
    indigo: "border-indigo-400/25 bg-indigo-400/10 text-indigo-200 hover:border-indigo-400/50",
    zinc: "border-zinc-500/25 bg-zinc-500/10 text-zinc-300 hover:border-zinc-400/50",
};

// ─── Findings Category Icons ────────────────────────────────────────────────
export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    security:     <ShieldCheck className="h-3.5 w-3.5" />,
    delivery:     <GitPullRequest className="h-3.5 w-3.5" />,
    architecture: <GitBranch className="h-3.5 w-3.5" />,
    data:         <Database className="h-3.5 w-3.5" />,
    ml:           <BrainCircuit className="h-3.5 w-3.5" />,
};

// ─── Topology Layers ────────────────────────────────────────────────────────
export const LAYER_COLORS: Record<string, string> = {
    application: "border-cyan-400/40 text-cyan-200 bg-cyan-500/10",
    service:     "border-emerald-400/40 text-emerald-200 bg-emerald-500/10",
    data:        "border-amber-400/40 text-amber-200 bg-amber-500/10",
    delivery:    "border-sky-400/40 text-sky-200 bg-sky-500/10",
    ml:          "border-violet-400/40 text-violet-200 bg-violet-500/10",
};

export function getTotalSignals(data: StackReport): number {
    return data.languages.length + data.frameworks.length + data.frontend.length + data.backend.length
        + data.database.length + data.infrastructure.length + data.devtools.length;
}

export function getCriticalCount(data: StackReport): number {
    return data.findings.filter((f) => f.severity === "critical" || f.severity === "high").length;
}
