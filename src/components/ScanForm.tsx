"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { ScanProgress } from './scan/ScanProgress';
import { ErrorBanner } from './scan/ErrorBanner';
import { BenchmarkLinks } from './scan/BenchmarkLinks';
import { normalizeGithubInput, parseGithubUrl } from '@/lib/repo-url';

const SCAN_STEP_MESSAGES = [
    "Fetching repository metadata...",
    "Parsing AST & manifest lockfiles...",
    "Evaluating tech stack & dependencies...",
    "Calculating complexity & health scores...",
    "Finalizing architectural report...",
];

export const ScanForm = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isActive = url.trim().length > 0;

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const input = url.trim();
        if (!input) {
            setError('Please enter a GitHub repository URL or owner/repo.');
            return;
        }

        const normalized = normalizeGithubInput(input);
        if (!normalized) {
            setError('Please enter a valid GitHub repository URL.');
            return;
        }

        setIsLoading(true);
        setScanStep(0);

        const stepInterval = setInterval(() => {
            setScanStep((prev) => (prev < SCAN_STEP_MESSAGES.length - 1 ? prev + 1 : prev));
        }, 1200);

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl: normalized }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to scan repository.');
            }

            const parsed = parseGithubUrl(normalized);
            if (parsed) {
                router.push(`/report/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`);
            } else {
                const encodedId = encodeURIComponent(btoa(normalized));
                router.push(`/report/legacy/${encodedId}`);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to scan repository.');
        } finally {
            clearInterval(stepInterval);
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
                className="relative group flex flex-col items-center justify-center"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }}
            >
                <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(34,211,238,0.12),transparent_45%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className={`absolute inset-0 rounded-3xl blur-2xl pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-100 bg-gradient-to-r from-cyan-500/25 via-teal-400/20 to-indigo-500/25' : 'opacity-40 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-teal-500/10'} group-hover:opacity-100`} />

                <div className={`relative flex w-full flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 rounded-2xl p-2.5 transition-all backdrop-blur-2xl ${isActive ? 'bg-slate-950/90 border border-cyan-400/40 ring-1 ring-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.2)]' : 'bg-slate-950/70 border border-white/12 shadow-2xl'}`}>
                    <div className="pl-3.5 pr-2 flex items-center text-zinc-500 h-10 sm:h-auto group-focus-within:text-cyan-400 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste repository URL or owner/repo (e.g. vercel/next.js)..."
                        required
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-zinc-100 placeholder:text-zinc-500 font-mono text-xs sm:text-sm py-3.5 px-2 w-full min-w-0"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="w-full sm:w-auto justify-center bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none group/btn overflow-hidden relative"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Logo size={16} className="brightness-0" />
                                <span>Analyze Core</span>
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-slate-950" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {isLoading && (
                <ScanProgress step={scanStep} stepCount={SCAN_STEP_MESSAGES.length} message={SCAN_STEP_MESSAGES[scanStep]} />
            )}

            {error && <ErrorBanner message={error} />}

            <BenchmarkLinks onSelect={setUrl} />
        </motion.div>
    );
};
