"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const ScanForm = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isActive = url.trim().length > 0;

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Normalize input: allow owner/repo shorthand
        let input = url.trim();
        if (!input) {
            setError('Please enter a GitHub repository URL or owner/repo.');
            return;
        }

        // If user typed owner/repo, make it a GitHub URL
        if (!input.includes('github.com/') && input.includes('/')) {
            input = `https://github.com/${input.replace(/^\/+/, '')}`;
        }

        // Try to extract owner and repo to use a clean path: /report/owner/repo
        const match = input.match(/github\.com\/([^\/\s]+)\/([^\/\s]+?)(?:\.git)?(?:[\/\?#]|$)/i);
        const owner = match?.[1];
        const repo = match?.[2];

        // Basic validation
        if (!input.includes('github.com/')) {
            setError('Please enter a valid GitHub repository URL.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl: input }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to scan repository.');
            }

            if (owner && repo) {
                // Use readable path
                router.push(`/report/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
            } else {
                const encodedId = encodeURIComponent(btoa(input));
                router.push(`/report/legacy/${encodedId}`);
            }

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to scan repository.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            <form 
                onSubmit={handleScan} 
                className="relative group flex items-center justify-center"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }}
            >
                {/* Tactical Highlight Layer */}
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(34,211,238,0.08),transparent_40%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`absolute inset-0 rounded-2xl blur-xl pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100 bg-gradient-to-r from-cyan-400/35 via-sky-400/25 to-teal-300/35' : 'opacity-60 bg-gradient-to-r from-cyan-400/20 via-sky-400/10 to-teal-300/20'} group-hover:opacity-100`} />
                <div className={`relative flex w-full flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 rounded-2xl p-2 shadow-2xl transition-all backdrop-blur-xl ${isActive ? 'bg-slate-900/80 border border-cyan-400/30 ring-1 ring-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.15)]' : 'bg-zinc-900/60 border border-white/10'}`}>
                    <div className="pl-3 sm:pl-4 pr-1 flex items-center text-zinc-500 h-10 sm:h-auto group-focus-within:text-cyan-400 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste repository URL..."
                        required
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 font-mono text-sm sm:text-base py-3 sm:py-4 px-2 w-full min-w-0"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="w-full sm:w-auto justify-center bg-zinc-50 text-zinc-950 hover:bg-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                        ) : (
                            <>
                                <Logo size={16} className="brightness-0" />
                                <span>Analyze Core</span>
                            </>
                        )}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-zinc-950" />}
                    </button>
                </div>
            </form>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center justify-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest bg-rose-500/5 py-2 px-4 rounded-full border border-rose-500/10"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                </motion.div>
            )}

            <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-sm text-zinc-500 font-medium">
                <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em] w-full text-center mb-1">Quick Benchmarks</span>
                <button onClick={() => setUrl('https://github.com/vercel/next.js')} className="hover:text-cyan-400 transition-all bg-white/[0.03] hover:bg-white/[0.08] px-4 py-1.5 rounded-full border border-white/5 hover:border-cyan-400/30 font-mono text-[11px] shadow-lg">next.js</button>
                <button onClick={() => setUrl('https://github.com/facebook/react')} className="hover:text-cyan-400 transition-all bg-white/[0.03] hover:bg-white/[0.08] px-4 py-1.5 rounded-full border border-white/5 hover:border-cyan-400/30 font-mono text-[11px] shadow-lg">react</button>
                <button onClick={() => setUrl('https://github.com/tailwindlabs/tailwindcss')} className="hover:text-cyan-400 transition-all bg-white/[0.03] hover:bg-white/[0.08] px-4 py-1.5 rounded-full border border-white/5 hover:border-cyan-400/30 font-mono text-[11px] shadow-lg">tailwind</button>
            </div>
        </motion.div>
    );
};
