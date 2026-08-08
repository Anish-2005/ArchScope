import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function CliDocsPage() {
    return (
        <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 lg:py-16">
            <Link href="/docs" className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider mb-8">
                <ArrowLeft className="w-4 h-4" /> Back to Documentation
            </Link>

            <div className="mb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] mb-4">
                    <Terminal className="h-3.5 w-3.5" /> CI/CD Automation & CLI
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-50">ArchScope CLI Guide</h1>
                <p className="mt-3 text-zinc-300 text-sm sm:text-base font-medium">
                    Run policy scans, gate pull requests, and enforce architectural budgets directly in your local environment or CI pipelines.
                </p>
            </div>

            <div className="space-y-8">
                <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/60">
                    <h2 className="text-lg font-bold text-zinc-100 mb-3">Installation</h2>
                    <p className="text-xs text-zinc-400 mb-4">
                        The ArchScope CLI can be run on-demand via `npx` or installed globally in your build images:
                    </p>
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 font-mono text-xs text-cyan-300 flex items-center justify-between">
                        <code>npm install -g archscope-cli</code>
                    </div>
                </section>

                <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/60">
                    <h2 className="text-lg font-bold text-zinc-100 mb-3">GitHub Actions Integration</h2>
                    <p className="text-xs text-zinc-400 mb-4">
                        Add policy enforcement to your GitHub Actions workflows to automatically comment on pull requests and block non-compliant code:
                    </p>
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
                        <pre>{`name: Architecture Policy Check

on:
  pull_request:
    branches: [ main ]

jobs:
  archscope:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run ArchScope Policy Scan
        run: |
          npx archscope-cli scan \${{ github.repository }}
        env:
          ARCHSCOPE_TOKEN: \${{ secrets.ARCHSCOPE_TOKEN }}
          ARCHSCOPE_ORG: "acme-corp"`}</pre>
                    </div>
                </section>

                <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-950/60">
                    <h2 className="text-lg font-bold text-zinc-100 mb-3">CLI Command Reference</h2>
                    <div className="space-y-4 text-xs font-mono">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-cyan-400 font-bold">archscope scan &lt;repo_url&gt;</span>
                            <p className="text-zinc-400 font-sans text-[11px] mt-1">Evaluates the target repository against organization policy guardrails. Returns non-zero exit code on policy violation.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-cyan-400 font-bold">archscope report &lt;repo_url&gt;</span>
                            <p className="text-zinc-400 font-sans text-[11px] mt-1">Outputs complete JSON architecture analysis report to stdout for downstream script consumption.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
