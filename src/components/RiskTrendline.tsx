import React, { useEffect, useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface TrendPoint {
    date: string;
    health: number;
    complexity: number;
}

export const RiskTrendline = ({ repo, org = "personal" }: { repo: string; org?: string }) => {
    const [data, setData] = useState<TrendPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/reports/history?repo=${encodeURIComponent(repo)}&org=${encodeURIComponent(org)}&mode=trend&limit=10`)
            .then(r => r.json())
            .then(res => {
                if (res.trend) setData(res.trend);
            })
            .finally(() => setLoading(false));
    }, [repo, org]);

    // If we don't have at least 2 points to draw a trend, mock it slightly (deterministically
    // per repo) to show the capability
    const points = useMemo(() => {
        if (data.length > 1) return data;
        const seed = [...`${repo}:${org}`].reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const noise = (i: number) => {
            const x = Math.sin(seed * 7 + i * 13) * 10000;
            return x - Math.floor(x);
        };
        return Array.from({ length: 10 }).map((_, i) => ({
            date: new Date(Date.UTC(2026, 0, 1) + (i - 9) * 86400000).toISOString(),
            health: data[0]?.health || Math.round(83 + noise(i) * 10),
            complexity: data[0]?.complexity || Math.round(42 + noise(i + 0.5) * 10),
        }));
    }, [data, org, repo]);

    if (loading) return <div className="h-40 animate-pulse bg-slate-900/50 rounded-2xl" />;

    const w = 400;
    const h = 120;
    const padding = 20;
    
    const maxVal = 100;
    const minVal = 0;
    
    const getX = (index: number) => padding + (index * (w - padding * 2) / (points.length - 1));
    const getY = (val: number) => h - padding - ((val - minVal) / (maxVal - minVal)) * (h - padding * 2);

    const makePath = (key: "health" | "complexity") => {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p[key])}`).join(" ");
    };

    return (
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">Drift Trajectory (Last 10 Scans)</h2>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-wider font-bold">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-emerald-400" /> Health</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-rose-400" /> Complexity</span>
                </div>
            </div>

            <div className="w-full h-32 relative">
                <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1={padding} y1={getY(50)} x2={w-padding} y2={getY(50)} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" strokeWidth="1" />
                    <line x1={padding} y1={getY(80)} x2={w-padding} y2={getY(80)} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" strokeWidth="1" />

                    {/* Complexity Path */}
                    <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }} 
                        animate={{ pathLength: 1, opacity: 1 }} 
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={makePath("complexity")} 
                        fill="none" 
                        stroke="rgba(244,63,94,0.6)" 
                        strokeWidth="2" 
                    />
                    
                    {/* Health Path */}
                    <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }} 
                        animate={{ pathLength: 1, opacity: 1 }} 
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        d={makePath("health")} 
                        fill="none" 
                        stroke="rgba(52,211,153,0.8)" 
                        strokeWidth="2.5" 
                    />
                    
                    {/* Data Points */}
                    {points.map((p, i) => (
                        <g key={i} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <circle cx={getX(i)} cy={getY(p.health)} r="3" fill="#34d399" />
                            <circle cx={getX(i)} cy={getY(p.complexity)} r="3" fill="#f43f5e" />
                        </g>
                    ))}
                </svg>
            </div>
            {data.length < 2 && (
                <div className="absolute inset-x-0 bottom-6 text-center">
                    <span className="text-[9px] bg-slate-900/80 px-2 py-1 rounded text-zinc-500 font-mono">Simulated history (insufficient scans)</span>
                </div>
            )}
        </div>
    );
};
