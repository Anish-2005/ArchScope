"use client";

import { motion } from "framer-motion";
import { StackReport } from "@/lib/types";
import { PRIORITY_CONFIG } from "../config";

interface RoadmapTabProps {
    data: StackReport;
}

export const RoadmapTab = ({ data }: RoadmapTabProps) => {
    const groups: Record<string, typeof data.recommendations> = {
        now:   data.recommendations.filter((r) => r.priority === "now"),
        next:  data.recommendations.filter((r) => r.priority === "next"),
        later: data.recommendations.filter((r) => r.priority === "later"),
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
