"use client";

import { motion } from "framer-motion";
import { StackReport } from "@/lib/types";
import { STACK_SECTIONS, TAG_ACCENT } from "../config";

interface StackTabProps {
    data: StackReport;
}

export const StackTab = ({ data }: StackTabProps) => (
    <div className="space-y-4">
        {STACK_SECTIONS.filter((s) => data[s.key].length > 0).map((section, si) => (
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
