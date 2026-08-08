"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StackReport } from "@/lib/types";
import { ShieldCheck } from "lucide-react";
import { FindingCard } from "../FindingCard";

interface FindingsTabProps {
    data: StackReport;
}

const SEVERITIES = ["all", "critical", "high", "medium", "low", "info"] as const;

export const FindingsTab = ({ data }: FindingsTabProps) => {
    const [filter, setFilter] = useState<string>("all");
    const filtered = filter === "all" ? data.findings : data.findings.filter((f) => f.severity === filter);
    const counts = SEVERITIES.reduce((acc, s) => {
        acc[s] = s === "all" ? data.findings.length : data.findings.filter((f) => f.severity === s).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur-xl">
                {SEVERITIES.map((s) => (
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
