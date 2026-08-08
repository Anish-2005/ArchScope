"use client";

import { StackReport } from "@/lib/types";
import { DependencyGraph } from "@/components/DependencyGraph";
import { TechDebtHeatmap } from "@/components/TechDebtHeatmap";
import { LAYER_COLORS } from "../config";

interface TopologyTabProps {
    data: StackReport;
    selectedKind: string | null;
    onSelectKind: (k: string | null) => void;
}

export const TopologyTab = ({ data, selectedKind, onSelectKind }: TopologyTabProps) => {
    const kinds = Array.from(new Set(data.architectureGraph.nodes.map((n) => n.kind)));

    return (
        <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <button onClick={() => onSelectKind(null)} className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${selectedKind === null ? "bg-cyan-400 text-slate-950" : "bg-white/[0.05] text-zinc-400 hover:text-zinc-200"}`}>
                        All Layers
                    </button>
                    {kinds.map((k) => (
                        <button key={k} onClick={() => onSelectKind(selectedKind === k ? null : k)} className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${selectedKind === k ? "bg-cyan-400 text-slate-950" : "bg-white/[0.05] text-zinc-400 hover:text-zinc-200"}`}>
                            {k}
                        </button>
                    ))}
                </div>

                <DependencyGraph graph={data.architectureGraph} selectedKind={selectedKind} />

                {data.architectureGraph.nodes.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-white/[0.06]">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Component Index</p>
                        <div className="flex flex-wrap gap-2">
                            {data.architectureGraph.nodes
                                .filter((n) => selectedKind === null || n.kind === selectedKind)
                                .map((node) => (
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
                            {data.architectureGraph.edges.map((e) => `${e.from} → ${e.to}`).join(" · ")}
                        </p>
                    </div>
                )}
            </div>

            <TechDebtHeatmap findings={data.findings} />
        </div>
    );
};
