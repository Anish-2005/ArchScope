"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, Sliders, Check, AlertCircle } from "lucide-react";
import { ArchitecturePolicy } from "@/lib/types";

const initial: ArchitecturePolicy = { organization: "personal", requireCi: true, requireTestEvidence: true, maxDependencies: 80, maxComplexity: 70 };

export default function GovernancePage() {
    const [policy, setPolicy] = useState<ArchitecturePolicy>(initial);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/policy?organization=personal")
            .then((response) => response.json())
            .then((data) => {
                if (data && typeof data === "object") {
                    setPolicy((prev) => ({ ...prev, ...data }));
                }
            })
            .catch(() => undefined);
    }, []);

    const save = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const response = await fetch("/api/policy", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(policy)
            });
            if (!response.ok) throw new Error();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            // handle err
        } finally {
            setSaving(false);
        }
    };

    // Calculate Policy Strictness score
    const strictnessScore = Math.round(
        (policy.requireCi ? 25 : 0) +
        (policy.requireTestEvidence ? 25 : 0) +
        (Math.max(0, 100 - policy.maxDependencies) * 0.25) +
        (Math.max(0, 100 - policy.maxComplexity) * 0.25)
    );

    return (
        <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                        <ShieldCheck className="h-3.5 w-3.5" /> Governance Guardrails Baseline
                    </div>
                    <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-50">Architecture Policy</h1>
                    <p className="mt-2.5 max-w-xl text-zinc-300 text-sm sm:text-base font-medium">
                        Every scan is evaluated against these guardrails. Breaches surface automatically in executive briefs and CLI exit codes.
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/10 shrink-0">
                    <Sliders className="w-6 h-6 text-cyan-400" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Strictness Score</p>
                        <p className="text-xl font-extrabold font-mono text-cyan-300">{strictnessScore} / 100</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-white/10 glass-panel p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Workspace Identifier</label>
                    <input
                        value={policy.organization}
                        disabled
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm font-mono text-zinc-400 shadow-inner"
                    />
                </div>

                <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-300">Policy Rules & Rulesets</h3>

                    <Toggle
                        label="Require Continuous Integration (CI)"
                        description="Flag repositories without detectable GitHub Actions CI workflow triggers."
                        checked={policy.requireCi}
                        onChange={(requireCi) => setPolicy({ ...policy, requireCi })}
                    />

                    <Toggle
                        label="Require Automated Test Evidence"
                        description="Flag repositories lacking test paths, jest/vitest/pytest markers, or spec files."
                        checked={policy.requireTestEvidence}
                        onChange={(requireTestEvidence) => setPolicy({ ...policy, requireTestEvidence })}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-white/5">
                    <NumberField
                        label="Dependency Budget Ceiling"
                        value={policy.maxDependencies}
                        max={500}
                        onChange={(maxDependencies) => setPolicy({ ...policy, maxDependencies })}
                        helpText="Repositories exceeding this count trigger high dependency debt alerts."
                    />

                    <NumberField
                        label="Complexity Score Budget"
                        value={policy.maxComplexity}
                        max={100}
                        onChange={(maxComplexity) => setPolicy({ ...policy, maxComplexity })}
                        helpText="Maximum complexity score before triggering architecture review warnings."
                    />
                </div>

                <div className="pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5">
                    <button
                        onClick={save}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all px-6 py-3.5 text-xs font-bold text-slate-950 disabled:opacity-60 shadow-[0_0_25px_rgba(34,211,238,0.3)]"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin text-slate-950" /> : saved ? <Check className="h-4 w-4" /> : null}
                        {saved ? "Policy Baseline Saved" : "Save Policy Baseline"}
                    </button>

                    {saved && (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" /> Policy saved successfully
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-5 transition-all">
            <div>
                <span className="block text-sm font-semibold text-zinc-100">{label}</span>
                <span className="mt-1 block text-xs text-zinc-400 font-medium">{description}</span>
            </div>
            <div className="relative inline-flex items-center shrink-0">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-200 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400 peer-checked:after:bg-slate-950 border border-white/10"></div>
            </div>
        </label>
    );
}

function NumberField({ label, value, max, onChange, helpText }: { label: string; value: number; max: number; onChange: (value: number) => void; helpText: string }) {
    return (
        <div className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">{label}</span>
                <span className="text-sm font-extrabold font-mono text-cyan-300">{value}</span>
            </div>
            <input
                type="range"
                min="10"
                max={max}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
            />
            <p className="mt-2 text-[11px] text-zinc-400">{helpText}</p>
        </div>
    );
}

