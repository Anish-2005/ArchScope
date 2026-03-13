"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ScanForm = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate GitHub URL format roughly
        if (!url.includes('github.com/')) {
            setError('Please enter a valid GitHub repository URL.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl: url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to scan repository.');
            }

            const encodedId = encodeURIComponent(btoa(url));
            router.push(`/report/${encodedId}`);

        } catch (err: any) {
            setError(err.message);
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
            <form onSubmit={handleScan} className="relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative flex w-full items-center bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-2xl transition-all group-focus-within:border-white/30 group-focus-within:bg-zinc-900/80">
                    <div className="pl-4 flex items-center text-zinc-500 font-mono text-sm">
                        github.com/
                    </div>
                    <input
                        type="text"
                        value={url.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                        onChange={(e) => setUrl(`https://github.com/${e.target.value}`)}
                        placeholder="vercel/next.js"
                        required
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 font-mono text-lg py-3 px-2 w-full min-w-0"
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="bg-white text-zinc-950 hover:bg-zinc-200 px-5 py-3 rounded-xl font-medium transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
                        {!isLoading && <ArrowRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />}
                    </button>
                </div>
            </form>

            {error && (
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-400 mt-4 text-center text-sm font-medium"
                >
                    {error}
                </motion.p>
            )}

            <div className="mt-6 flex justify-center items-center gap-3 text-sm text-zinc-500 font-medium">
                <span className="text-zinc-600 hidden sm:inline-block">Try these:</span>
                <button onClick={() => setUrl('https://github.com/vercel/next.js')} className="hover:text-white transition-colors bg-white/5 px-3 py-1 rounded-md border border-white/5 hover:border-white/10 font-mono text-xs shadow-sm">vercel/next.js</button>
                <button onClick={() => setUrl('https://github.com/facebook/react')} className="hover:text-white transition-colors bg-white/5 px-3 py-1 rounded-md border border-white/5 hover:border-white/10 font-mono text-xs shadow-sm">facebook/react</button>
                <button onClick={() => setUrl('https://github.com/tailwindlabs/tailwindcss')} className="hover:text-white transition-colors bg-white/5 px-3 py-1 rounded-md border border-white/5 hover:border-white/10 font-mono text-xs shadow-sm hidden sm:inline-block">tailwindlabs/tailwindcss</button>
            </div>
        </motion.div>
    );
};
