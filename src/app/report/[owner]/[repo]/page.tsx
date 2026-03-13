"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StackReport } from "@/lib/types";
import { ReportCard } from "@/components/ReportCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function ReportByOwnerRepo() {
    const params = useParams();
    const router = useRouter();

    const owner = params?.owner as string | undefined;
    const repo = params?.repo as string | undefined;

    const [data, setData] = useState<StackReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!owner || !repo) return;

        const repoUrl = `https://github.com/${owner}/${repo}`;

        const fetchScan = async () => {
            try {
                const res = await fetch("/api/scan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ repoUrl }),
                });
                const result = await res.json();

                if (!res.ok) throw new Error(result.error || "Failed to scan");
                setData(result);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to scan");
            } finally {
                setLoading(false);
            }
        };

        fetchScan();
    }, [owner, repo]);

    return (
        <div className="relative flex-1 p-4 sm:p-6 md:p-10 lg:p-12 pb-20 sm:pb-24 selection:bg-cyan-300/30 overflow-hidden">
            <AnimatedBackground />

            <div className="relative z-10 max-w-5xl mx-auto">
                <button
                    onClick={() => router.push("/")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 sm:px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors mb-6 sm:mb-8 font-medium text-xs sm:text-sm group backdrop-blur-md"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Search
                </button>

                {loading && (
                    <div className="flex flex-col items-center justify-center mt-16 sm:mt-24 space-y-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-12">
                        <Loader2 className="w-8 h-8 text-cyan-200 animate-spin" />
                        <p className="animate-pulse text-xs sm:text-sm font-mono tracking-wide text-zinc-300 uppercase text-center">Mapping Architecture...</p>
                    </div>
                )}

                {error && (
                    <div className="p-6 sm:p-8 bg-rose-300/10 border border-rose-200/25 rounded-3xl flex flex-col items-center max-w-xl mx-auto mt-14 sm:mt-20 backdrop-blur-xl">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-rose-100">Analysis Failed</h2>
                        <p className="text-sm text-rose-100/85 text-center break-words">{error}</p>
                    </div>
                )}

                {data && !loading && !error && (
                    <ReportCard data={data} />
                )}
            </div>
        </div>
    );
}
