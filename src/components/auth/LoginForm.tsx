"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { InputField } from "./InputField";

export const LoginForm = () => {
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
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-md relative group"
        >
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
                    <InputField
                        label="Organization Handle"
                        placeholder="e.g. acme-corp"
                        value={org}
                        icon={<ShieldCheck className="w-4 h-4" />}
                        required
                        onChange={setOrg}
                    />

                    <InputField
                        label="Passkey"
                        placeholder="Enter your access key"
                        type="password"
                        value={password}
                        icon={<KeyRound className="w-4 h-4" />}
                        required
                        onChange={setPassword}
                    />

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
    );
};
