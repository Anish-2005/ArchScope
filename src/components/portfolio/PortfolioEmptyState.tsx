import { ShieldCheck } from "lucide-react";

export const PortfolioEmptyState = () => (
    <div className="glass-card rounded-3xl p-12 text-center border-dashed border-white/15">
        <ShieldCheck className="mx-auto h-10 w-10 text-cyan-400 mb-3" />
        <h2 className="text-lg font-bold text-zinc-100">No matching scans found</h2>
        <p className="mt-1 text-xs text-zinc-400">Try adjusting your search filter or analyze a new repository URL.</p>
    </div>
);
