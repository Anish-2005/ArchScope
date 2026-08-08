import Link from "next/link";
import { Github } from "lucide-react";
import { ScanRecord } from "@/lib/types";
import { Metric } from "./Metric";

const RISK_BADGE: Record<string, string> = {
    high: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    moderate: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

interface PortfolioScanCardProps {
    scan: ScanRecord;
}

export const PortfolioScanCard = ({ scan }: PortfolioScanCardProps) => {
    const risk = scan.report.deliveryRisk.toLowerCase();

    return (
        <Link
            href={`/report/${encodeURIComponent(scan.report.repo.owner)}/${encodeURIComponent(scan.report.repo.name)}`}
            className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-900/80 shadow-xl"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-slate-950 border border-white/10 group-hover:border-cyan-400/40 text-cyan-400 transition-colors">
                        <Github className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-zinc-100 group-hover:text-cyan-300 transition-colors">
                            {scan.repository}
                        </h3>
                        <p className="mt-1 text-xs font-mono text-zinc-400">
                            Scanned on {new Date(scan.scannedAt).toLocaleDateString()} at {new Date(scan.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                    <Metric label="Health Index" value={`${scan.report.healthScore}/100`} />
                    <Metric label="Complexity" value={`${scan.report.complexityScore}/100`} />
                    <span className={`rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${RISK_BADGE[risk] || RISK_BADGE.low}`}>
                        {scan.report.deliveryRisk} risk
                    </span>
                </div>
            </div>
        </Link>
    );
};
