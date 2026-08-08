import { Settings } from "lucide-react";

export interface Org {
    name: string;
    plan: string;
    createdAt: string;
}

interface OrgCardProps {
    org: Org;
    active: boolean;
    onSwitch: (orgName: string) => void;
}

export const OrgCard = ({ org, active, onSwitch }: OrgCardProps) => (
    <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-violet-400/40 transition-all flex flex-col h-full group">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-zinc-100">{org.name}</h3>
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{org.plan}</span>
        </div>
        <p className="text-xs text-zinc-400 font-mono mb-6">Created {new Date(org.createdAt).toLocaleDateString()}</p>
        <div className="mt-auto flex gap-2">
            {!active && (
                <button onClick={() => onSwitch(org.name)} className="flex-1 bg-white/[0.04] hover:bg-white/10 py-2 rounded-xl text-xs font-bold text-zinc-300 transition-colors border border-white/5">
                    Switch Context
                </button>
            )}
            <button className="flex-1 bg-white/[0.04] hover:bg-white/10 py-2 rounded-xl text-xs font-bold text-zinc-300 transition-colors border border-white/5 flex items-center justify-center gap-1">
                <Settings className="w-3.5 h-3.5" /> Manage
            </button>
        </div>
    </div>
);
