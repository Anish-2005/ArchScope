import { AlertTriangle } from "lucide-react";
import { ScanRecord } from "@/lib/types";
import { RiskItem } from "./RiskItem";

interface PortfolioRisksPanelProps {
    scans: ScanRecord[];
}

export const PortfolioRisksPanel = ({ scans }: PortfolioRisksPanelProps) => (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-950/60">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Key Portfolio Risks
        </h2>
        <div className="space-y-3">
            <RiskItem title="Missing Automated Test Baseline" count={scans.filter(s => s.report.signals.testSignals === 0).length} severity="high" />
            <RiskItem title="No CI Workflows Configured" count={scans.filter(s => s.report.signals.workflowCount === 0).length} severity="high" />
            <RiskItem title="High Dependency Surface (>80)" count={scans.filter(s => s.report.signals.dependencyCount > 80).length} severity="medium" />
        </div>
    </div>
);
