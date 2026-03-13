"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Github } from 'lucide-react';
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

            // Instead of going to a specific report id right away, we could just encode 
            // the URL or use a report storage system, but here I'll pass it in the query 
            // or to /report since we don't have a DB for historic reports.
            // Wait, let's navigate to /report with the repoUrl so it fetches it again (or caches it).
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
            <form onSubmit={handleScan} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-zinc-900 ring-1 ring-white/10 rounded-2xl p-2 shadow-2xl">
                    <div className="pl-4 pr-3 text-zinc-400">
                        <Github className="w-6 h-6" />
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://github.com/vercel/next.js"
                        required
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 text-lg py-4 w-full"
                        autoComplete="off"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="bg-white text-zinc-950 hover:bg-zinc-200 px-6 py-4 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        {isLoading ? 'Scanning...' : 'Analyze Stack'}
                    </button>
                </div>
            </form>

            {error && (
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-400 mt-4 text-center font-medium"
                >
                    {error}
                </motion.p>
            )}

            <div className="mt-8 flex justify-center gap-4 text-sm text-zinc-500">
                <p>Try examples:</p>
                <button onClick={() => setUrl('https://github.com/vercel/next.js')} className="hover:text-zinc-300 transition-colors bg-zinc-800/50 px-3 py-1 rounded-full border border-white/5">vercel/next.js</button>
                <button onClick={() => setUrl('https://github.com/facebook/react')} className="hover:text-zinc-300 transition-colors bg-zinc-800/50 px-3 py-1 rounded-full border border-white/5">facebook/react</button>
            </div>
        </motion.div>
    );
};
