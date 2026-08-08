import { FileCode, Settings } from "lucide-react";

export const HeuristicsSection = () => (
    <>
        <p className="text-zinc-300 leading-relaxed">
            Our engine performs recursive scanning to identify primary and secondary layers of the technical stack.
        </p>
        <div className="glass-panel p-6 rounded-3xl bg-slate-900/40 space-y-4">
            <div className="flex gap-4">
                <FileCode className="w-5 h-5 text-cyan-300 mt-1" />
                <div>
                    <h4 className="text-sm font-semibold text-zinc-100">Manifest Resolution</h4>
                    <p className="text-xs text-zinc-400">Deep validation of lock files to distinguish between transitive and primary dependencies.</p>
                </div>
            </div>
            <div className="flex gap-4 border-t border-white/5 pt-4">
                <Settings className="w-5 h-5 text-emerald-300 mt-1" />
                <div>
                    <h4 className="text-sm font-semibold text-zinc-100">Config Signatures</h4>
                    <p className="text-xs text-zinc-400">Detection of cloud providers (AWS, GCP, Vercel) through specialized configuration markers.</p>
                </div>
            </div>
        </div>
    </>
);
