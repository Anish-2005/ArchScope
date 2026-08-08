import Link from "next/link";
import { ScanRecord } from "@/lib/types";

interface GovernanceMatrixProps {
    scans: ScanRecord[];
    loading: boolean;
}

export const GovernanceMatrix = ({ scans, loading }: GovernanceMatrixProps) => (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-200 mb-6 flex items-center justify-between">
            <span>Portfolio Governance Matrix</span>
            <span className="text-[10px] font-mono text-zinc-400 font-normal">Sorted by Risk</span>
        </h2>

        {loading ? (
            <div className="p-12 text-center text-xs font-mono text-cyan-300 animate-pulse">Loading executive portfolio metrics...</div>
        ) : scans.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-zinc-400 text-xs font-mono">No repository records available in workspace.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {scans.map((scan) => (
                    <div key={scan.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <Link href={`/report/${encodeURIComponent(scan.report.repo.owner)}/${encodeURIComponent(scan.report.repo.name)}`} className="font-bold text-sm text-zinc-100 hover:text-cyan-300 transition-colors">
                                {scan.repository}
                            </Link>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                                {scan.report.signals.fileCount} files · {scan.report.signals.dependencyCount} deps · {scan.report.signals.workflowCount} workflows
                            </p>
                        </div>

                        <div className="flex items-center gap-6 self-end sm:self-center">
                            <div className="text-right">
                                <p className="text-[9px] uppercase font-bold text-zinc-500">Health</p>
                                <p className="text-xs font-mono font-bold text-emerald-400">{scan.report.healthScore}/100</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] uppercase font-bold text-zinc-500">Complexity</p>
                                <p className="text-xs font-mono font-bold text-amber-400">{scan.report.complexityScore}/100</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                scan.report.deliveryRisk === 'high' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            }`}>
                                {scan.report.deliveryRisk}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
