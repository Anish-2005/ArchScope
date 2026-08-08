"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Finding } from "@/lib/types";
import { CATEGORY_ICONS, SEVERITY_CONFIG } from "./config";

interface FindingCardProps {
    finding: Finding;
    compact?: boolean;
}

export const FindingCard = ({ finding, compact }: FindingCardProps) => {
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
