import { Zap, Command } from "lucide-react";

export const PhilosophySection = () => (
    <>
        <p className="text-zinc-300 leading-relaxed">
            We believe that architecture is not just what is documented, but what is actually implemented in the codebase. ArchScope bridges the gap between intended design and technical reality.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <Zap className="w-5 h-5 text-amber-400 mb-3" />
                <h4 className="text-sm font-semibold text-zinc-100 mb-1">Evidence-Based</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Analysis is derived from actual file markers and configuration signatures, not manual tags.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <Command className="w-5 h-5 text-blue-400 mb-3" />
                <h4 className="text-sm font-semibold text-zinc-100 mb-1">Standardized Metrics</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Unified complexity signals that allow comparison across heterogeneous technology stacks.</p>
            </div>
        </div>
    </>
);
