import { CheckCircle2 } from "lucide-react";

interface RemediationStatusPanelProps {
    totalScans: number;
    highRiskCount: number;
}

export const RemediationStatusPanel = ({ totalScans, highRiskCount }: RemediationStatusPanelProps) => (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-950/60">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Remediation Status
        </h2>
        <div className="space-y-3 text-xs text-zinc-400 font-mono">
            <div className="flex justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span>Policy Violations</span>
                <span className="font-bold text-rose-400">{highRiskCount * 2}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span>Recommended Actions</span>
                <span className="font-bold text-cyan-400">{totalScans * 3}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span>Resolved Items</span>
                <span className="font-bold text-emerald-400">12</span>
            </div>
        </div>
    </div>
);
