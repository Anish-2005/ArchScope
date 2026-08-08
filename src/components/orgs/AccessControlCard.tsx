import { Users, Crown } from "lucide-react";

export const AccessControlCard = () => (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2 mb-4"><Users className="w-4 h-4 text-amber-400"/> Access Control</h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Members are scoped to organizations. Admin access is required to modify roles or generate access tokens.
        </p>
        <button disabled className="w-full bg-white/[0.04] text-zinc-500 font-bold text-xs uppercase tracking-wider py-3 rounded-xl border border-white/5 opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
            <Crown className="w-4 h-4" /> Team Management (Soon)
        </button>
    </div>
);
