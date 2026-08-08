"use client";

import { motion } from "framer-motion";
import { StackReport } from "@/lib/types";
import { TABS, TabId } from "./config";

interface TabNavigationProps {
    data: StackReport;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

export const TabNavigation = ({ data, activeTab, onTabChange }: TabNavigationProps) => (
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
                            onClick={() => onTabChange(tab.id)}
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
);
