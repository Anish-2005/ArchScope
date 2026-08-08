"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, Check } from "lucide-react";
import { ArchitecturePolicy } from "@/lib/types";
import { StrictnessScoreCard } from "@/components/governance/StrictnessScoreCard";
import { Toggle } from "@/components/governance/Toggle";
import { NumberField } from "@/components/governance/NumberField";

const initial: ArchitecturePolicy = { organization: "personal", requireCi: true, requireTestEvidence: true, maxDependencies: 80, maxComplexity: 70 };

const calculateStrictness = (policy: ArchitecturePolicy): number =>
    Math.round(
        (policy.requireCi ? 25 : 0) +
        (policy.requireTestEvidence ? 25 : 0) +
        (Math.max(0, 100 - policy.maxDependencies) * 0.25) +
        (Math.max(0, 100 - policy.maxComplexity) * 0.25)
    );

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

    const update = <K extends keyof ArchitecturePolicy>(key: K, value: ArchitecturePolicy[K]) =>
        setPolicy((prev) => ({ ...prev, [key]: value }));

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

                <StrictnessScoreCard score={calculateStrictness(policy)} />
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
                        onChange={(requireCi) => update("requireCi", requireCi)}
                    />

                    <Toggle
                        label="Require Automated Test Evidence"
                        description="Flag repositories lacking test paths, jest/vitest/pytest markers, or spec files."
                        checked={policy.requireTestEvidence}
                        onChange={(requireTestEvidence) => update("requireTestEvidence", requireTestEvidence)}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-white/5">
                    <NumberField
                        label="Dependency Budget Ceiling"
                        value={policy.maxDependencies}
                        max={500}
                        onChange={(maxDependencies) => update("maxDependencies", maxDependencies)}
                        helpText="Repositories exceeding this count trigger high dependency debt alerts."
                    />

                    <NumberField
                        label="Complexity Score Budget"
                        value={policy.maxComplexity}
                        max={100}
                        onChange={(maxComplexity) => update("maxComplexity", maxComplexity)}
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
