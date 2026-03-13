import React from 'react';
import { Info } from 'lucide-react';

export default function GettingStarted() {
  return (
    <div className="mx-auto w-full max-w-2xl mb-6">
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/40 border border-white/5">
        <div className="mt-1">
          <div className="h-8 w-8 rounded-md bg-white/5 flex items-center justify-center text-white">
            <Info className="w-4 h-4" />
          </div>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm text-zinc-300 font-semibold">Quick start</p>
          <p className="mt-1 text-xs text-zinc-400">Paste a GitHub repo URL or an owner/repo (e.g., <span className="font-mono">vercel/next.js</span>) and click Analyze. Try one of the samples below to get started instantly.</p>
        </div>
      </div>
    </div>
  );
}
