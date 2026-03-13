"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StackReport } from "@/lib/types";
import { ReportCard } from "@/components/ReportCard";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ReportPage() {
    const { id } = useParams();
    const router = useRouter();

    const [data, setData] = useState<StackReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let decodedUrl = "";
        try {
            decodedUrl = atob(decodeURIComponent(id as string));
        } catch {
            setError("Invalid report ID");
            setLoading(false);
            return;
        }

        const fetchScan = async () => {
            try {
                const res = await fetch("/api/scan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ repoUrl: decodedUrl }),
                });
                const result = await res.json();

                if (!res.ok) throw new Error(result.error || "Failed to scan");
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScan();
    }, [id]);

    return (
        <div className="min-h-screen bg-zinc-950 p-6 md:p-12 selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Search
                </button>

                {loading && (
                    <div className="flex flex-col items-center justify-center mt-32 space-y-6 text-zinc-400">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <p className="animate-pulse text-lg tracking-wide">Analyzing Repository Architecture...</p>
                    </div>
                )}

                {error && (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
                        <p>{error}</p>
                    </div>
                )}

                {data && !loading && !error && (
                    <ReportCard data={data} />
                )}
            </div>
        </div>
    );
}
