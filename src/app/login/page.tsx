"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
    const [org, setOrg] = useState("personal");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ org, password }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Authentication failed");
            }
            
            router.push("/portfolio");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-5">
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md relative group"
            >
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-[3rem] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-950/80">
                    <div className="flex justify-center mb-8">
                        <Logo size={48} />
                    </div>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight">Workspace Login</h1>
                        <p className="mt-2 text-sm text-zinc-400 font-medium">Access your enterprise architecture portfolio.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Organization Handle</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                                <input
                                    type="text"
                                    value={org}
                                    onChange={(e) => setOrg(e.target.value)}
                                    placeholder="e.g. acme-corp"
                                    required
                                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Passkey</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your access key"
                                    required
                                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-center font-semibold">
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full justify-center bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2.5 mt-4 disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <ArrowRight className="w-4 h-4" />}
                            {loading ? "Authenticating..." : "Sign In to Workspace"}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-[10px] text-zinc-500 font-medium">Use <span className="font-mono text-cyan-400/70">personal</span> / <span className="font-mono text-cyan-400/70">personal</span> to test the default environment.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
