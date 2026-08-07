"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Plus, Users, Crown, Settings, LogOut, Building2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Org {
    name: string;
    plan: string;
    createdAt: string;
}

export default function OrgsPage() {
    const [orgs, setOrgs] = useState<Org[]>([]);
    const [session, setSession] = useState<{ org: string; role: string; userId: string } | null>(null);
    const [newOrgName, setNewOrgName] = useState("");
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchState = async () => {
            const [authRes, orgsRes] = await Promise.all([
                fetch("/api/auth"),
                fetch("/api/orgs")
            ]);
            
            const authData = await authRes.json();
            if (!authData.session) {
                router.push("/login");
                return;
            }
            setSession(authData.session);

            if (orgsRes.ok) {
                const orgsData = await orgsRes.json();
                setOrgs(orgsData.orgs || []);
            }
            setLoading(false);
        };
        fetchState();
    }, [router]);

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOrgName) return;
        setCreating(true);
        try {
            const res = await fetch("/api/orgs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newOrgName, plan: "team" })
            });
            if (res.ok) {
                const data = await res.json();
                setOrgs([...orgs, data.org]);
                setNewOrgName("");
            }
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" });
        router.push("/login");
    };

    const handleSwitchOrg = async (orgName: string) => {
        // In a real app, this would re-auth and get a new token for the org
        // For this demo, we'll just log out so they can log back in.
        handleLogout();
    };

    if (loading) return null;

    return (
        <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                        <Building2 className="h-3.5 w-3.5" /> Workspace Management
                    </div>
                    <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-50">Organizations</h1>
                    <p className="mt-2.5 max-w-xl text-zinc-300 text-sm sm:text-base font-medium">
                        Manage your enterprise workspaces, access controls, and team members.
                    </p>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-rose-400 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Session Context */}
                    <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-inner shrink-0">
                                <Shield className="w-8 h-8 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Active Context</h2>
                                <p className="text-2xl font-extrabold text-zinc-100 flex items-center gap-3">
                                    {session?.org}
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        <CheckCircle2 className="w-3 h-3 inline mr-1" /> Active
                                    </span>
                                </p>
                                <p className="mt-1 text-xs text-zinc-400 font-mono">Role: {session?.role.toUpperCase()} · User: {session?.userId}</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mt-10 mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-violet-400"/> Available Workspaces</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {orgs.map((org) => (
                            <div key={org.name} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-violet-400/40 transition-all flex flex-col h-full group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-zinc-100">{org.name}</h3>
                                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{org.plan}</span>
                                </div>
                                <p className="text-xs text-zinc-400 font-mono mb-6">Created {new Date(org.createdAt).toLocaleDateString()}</p>
                                <div className="mt-auto flex gap-2">
                                    {session?.org !== org.name && (
                                        <button onClick={() => handleSwitchOrg(org.name)} className="flex-1 bg-white/[0.04] hover:bg-white/10 py-2 rounded-xl text-xs font-bold text-zinc-300 transition-colors border border-white/5">
                                            Switch Context
                                        </button>
                                    )}
                                    <button className="flex-1 bg-white/[0.04] hover:bg-white/10 py-2 rounded-xl text-xs font-bold text-zinc-300 transition-colors border border-white/5 flex items-center justify-center gap-1">
                                        <Settings className="w-3.5 h-3.5" /> Manage
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/60">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2 mb-4"><Plus className="w-4 h-4 text-cyan-400"/> New Workspace</h3>
                        <form onSubmit={handleCreateOrg}>
                            <input
                                type="text"
                                placeholder="Organization Name"
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-zinc-100 mb-4 outline-none focus:border-cyan-400/50"
                            />
                            <button 
                                type="submit"
                                disabled={!newOrgName || creating}
                                className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all disabled:opacity-50"
                            >
                                {creating ? "Provisioning..." : "Create Workspace"}
                            </button>
                        </form>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/60">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2 mb-4"><Users className="w-4 h-4 text-amber-400"/> Access Control</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                            Members are scoped to organizations. Admin access is required to modify roles or generate access tokens.
                        </p>
                        <button disabled className="w-full bg-white/[0.04] text-zinc-500 font-bold text-xs uppercase tracking-wider py-3 rounded-xl border border-white/5 opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
                            <Crown className="w-4 h-4" /> Team Management (Soon)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
