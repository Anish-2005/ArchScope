import { Shield, CheckCircle2 } from "lucide-react";

interface ActiveContextCardProps {
    org: string;
    role: string;
    userId: string;
}

export const ActiveContextCard = ({ org, role, userId }: ActiveContextCardProps) => (
    <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-inner shrink-0">
                <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Active Context</h2>
                <p className="text-2xl font-extrabold text-zinc-100 flex items-center gap-3">
                    {org}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" /> Active
                    </span>
                </p>
                <p className="mt-1 text-xs text-zinc-400 font-mono">Role: {role?.toUpperCase()} · User: {userId}</p>
            </div>
        </div>
    </div>
);
