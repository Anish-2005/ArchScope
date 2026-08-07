import React from "react";
import { Finding } from "@/lib/types";
import { Info } from "lucide-react";

export const TechDebtHeatmap = ({ findings }: { findings: Finding[] }) => {
    const categories = ["security", "delivery", "architecture", "data", "ml"] as const;
    const severities = ["critical", "high", "medium", "low", "info"] as const;

    const grid = categories.map(cat => 
        severities.map(sev => ({
            cat,
            sev,
            items: findings.filter(f => f.category === cat && f.severity === sev)
        }))
    );

    const getIntensityClass = (count: number, severity: string) => {
        if (count === 0) return "bg-white/[0.02] border-white/5";
        if (severity === "critical" || severity === "high") return "bg-rose-500/20 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
        if (severity === "medium") return "bg-amber-500/20 border-amber-500/40";
        if (severity === "low") return "bg-cyan-500/20 border-cyan-500/40";
        return "bg-emerald-500/10 border-emerald-500/20";
    };

    return (
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
                <Info className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200">Tech Debt Heatmap</h2>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="min-w-[500px]">
                    <div className="grid grid-cols-6 gap-2 mb-2">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right pr-4">Severity</div>
                        {categories.map(c => <div key={c} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">{c}</div>)}
                    </div>
                    
                    {severities.map((sev, y) => (
                        <div key={sev} className="grid grid-cols-6 gap-2 mb-2">
                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right pr-4 self-center">{sev}</div>
                            {categories.map((cat, x) => {
                                const cell = grid[x][y];
                                return (
                                    <div 
                                        key={`${cat}-${sev}`} 
                                        className={`h-10 rounded-lg border flex items-center justify-center transition-all group relative cursor-default ${getIntensityClass(cell.items.length, sev)}`}
                                    >
                                        <span className={`text-xs font-mono font-bold ${cell.items.length > 0 ? 'text-white' : 'text-zinc-600'}`}>
                                            {cell.items.length}
                                        </span>
                                        {cell.items.length > 0 && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-white/10 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                                                {cell.items.map((i, idx) => (
                                                    <p key={idx} className="text-[10px] text-zinc-300 leading-tight mb-1 last:mb-0 truncate">{i.title}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
