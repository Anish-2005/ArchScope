"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, Building2, ShieldCheck } from "lucide-react";
import { ScanRecord } from "@/lib/types";

export default function PortfolioPage() {
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/reports?organization=personal").then((response) => response.json()).then((data) => setScans(data.scans || [])).finally(() => setLoading(false));
    }, []);

    return <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-18">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300"><Building2 className="h-3.5 w-3.5" /> Personal workspace</div><h1 className="text-4xl font-bold tracking-tight text-zinc-50">Engineering portfolio</h1><p className="mt-3 max-w-xl text-zinc-400">A durable history of repository posture, policy signals, and architectural risk.</p></div>
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-slate-950">New analysis <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-4">
            {loading && <p className="rounded-2xl border border-white/10 p-8 text-sm text-zinc-500">Loading scan history…</p>}
            {!loading && scans.length === 0 && <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center"><ShieldCheck className="mx-auto h-7 w-7 text-cyan-300" /><h2 className="mt-4 font-semibold text-zinc-100">No scans recorded yet</h2><p className="mt-2 text-sm text-zinc-500">Analyze a repository to begin building your engineering portfolio.</p></div>}
            {scans.map((scan) => <Link key={scan.id} href={`/report/${encodeURIComponent(scan.report.repo.owner)}/${encodeURIComponent(scan.report.repo.name)}`} className="group rounded-2xl border border-white/10 bg-slate-900/35 p-5 transition hover:border-cyan-400/30 hover:bg-slate-900/60"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-semibold text-zinc-100">{scan.repository}</p><p className="mt-1 text-xs text-zinc-500">Scanned {new Date(scan.scannedAt).toLocaleString()}</p></div><div className="flex items-center gap-5"><Metric label="Health" value={`${scan.report.healthScore}/100`} /><Metric label="Complexity" value={`${scan.report.complexityScore}/100`} /><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200">{scan.report.deliveryRisk} risk</span></div></div></Link>)}
        </div>
    </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="hidden text-right sm:block"><p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">{label}</p><p className="mt-1 text-sm font-bold text-zinc-200"><Activity className="mr-1 inline h-3 w-3 text-cyan-300" />{value}</p></div>; }
