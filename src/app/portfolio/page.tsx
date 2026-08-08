"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { ScanRecord } from "@/lib/types";
import { PortfolioSearchBar } from "@/components/portfolio/PortfolioSearchBar";
import { PortfolioScanCard } from "@/components/portfolio/PortfolioScanCard";
import { PortfolioEmptyState } from "@/components/portfolio/PortfolioEmptyState";

export default function PortfolioPage() {
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRisk, setFilterRisk] = useState<string>("all");

    useEffect(() => {
        fetch("/api/reports?organization=personal")
            .then((response) => response.json())
            .then((data) => setScans(data.scans || []))
            .finally(() => setLoading(false));
    }, []);

    const filteredScans = scans.filter((scan) => {
        const matchesSearch = scan.repository.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRisk = filterRisk === "all" || scan.report.deliveryRisk.toLowerCase() === filterRisk.toLowerCase();
        return matchesSearch && matchesRisk;
    });

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-10">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Building2 className="h-3.5 w-3.5" /> Workspace Executive Hub
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-50">Engineering Portfolio</h1>
                    <p className="mt-2.5 max-w-xl text-zinc-300 text-sm sm:text-base font-medium">A durable repository history of architectural posture, policy compliance, and delivery risk.</p>
                </div>
                <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all px-5 py-3 text-xs font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                    New Analysis <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            <PortfolioSearchBar
                searchQuery={searchQuery}
                filterRisk={filterRisk}
                onSearchChange={setSearchQuery}
                onFilterChange={setFilterRisk}
            />

            <div className="grid gap-4">
                {loading && (
                    <div className="glass-card rounded-3xl p-12 text-center text-sm font-mono text-cyan-300 animate-pulse">
                        Fetching engineering portfolio records...
                    </div>
                )}

                {!loading && filteredScans.length === 0 && <PortfolioEmptyState />}

                {filteredScans.map((scan) => (
                    <PortfolioScanCard key={scan.id} scan={scan} />
                ))}
            </div>
        </div>
    );
}
