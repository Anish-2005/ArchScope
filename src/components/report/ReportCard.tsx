"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackReport } from "@/lib/types";
import { ReportHero } from "./ReportHero";
import { TabNavigation } from "./TabNavigation";
import { OverviewTab } from "./tabs/OverviewTab";
import { StackTab } from "./tabs/StackTab";
import { FindingsTab } from "./tabs/FindingsTab";
import { RoadmapTab } from "./tabs/RoadmapTab";
import { TopologyTab } from "./tabs/TopologyTab";
import { TrendsTab } from "./tabs/TrendsTab";
import { TabId } from "./config";

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

    return (
        <motion.div
            ref={topRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-0"
        >
            <ReportHero data={data} copied={copied} onCopy={handleCopy} onExportJson={exportJson} />

            <TabNavigation data={data} activeTab={activeTab} onTabChange={setActiveTab} />

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
