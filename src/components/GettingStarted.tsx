import React from 'react';
import { Info } from 'lucide-react';

export default function GettingStarted() {
  return (
    <div className="mx-auto w-full max-w-2xl mb-6">
      <div className="relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/45 border border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="mt-1">
          <div className="h-8 w-8 rounded-md bg-white/10 ring-1 ring-white/20 flex items-center justify-center text-white">
            <Info className="w-4 h-4" />
          </div>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm text-zinc-200 font-semibold tracking-wide">Quick start</p>
          <p className="mt-1 text-xs text-zinc-400">Paste a GitHub repo URL or an owner/repo (e.g., <span className="font-mono text-zinc-300">vercel/next.js</span>) and click Analyze. Try one of the samples below to get started instantly.</p>
        </div>
      </div>
    </div>
  );
}
