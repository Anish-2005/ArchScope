"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StackReport } from "@/lib/types";
import { ReportCard } from "@/components/ReportCard";
import { ArrowLeft, Loader2 } from "lucide-react";

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
        <div className="flex-1 bg-black p-6 md:p-12 pb-24 selection:bg-white/20">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 font-medium text-sm group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Search
                </button>

                {loading && (
                    <div className="flex flex-col items-center justify-center mt-32 space-y-6">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                        <p className="animate-pulse text-sm font-mono tracking-wide text-zinc-500 uppercase">Mapping Architecture...</p>
                    </div>
                )}

                {error && (
                    <div className="p-8 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl flex flex-col items-center max-w-xl mx-auto mt-20">
                        <h2 className="text-xl font-semibold mb-3 text-red-400">Analysis Failed</h2>
                        <p className="text-sm text-red-300 text-center">{error}</p>
                    </div>
                )}

                {data && !loading && !error && (
                    <ReportCard data={data} />
                )}
            </div>
        </div>
    );
}
