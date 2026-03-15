import { Logo } from './Logo';

export default function GettingStarted() {
  return (
    <div className="mx-auto w-full max-w-2xl mb-6">
      <div className="relative overflow-hidden flex items-start gap-4 p-5 rounded-3xl bg-zinc-900/45 border border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl opacity-50" />
        <div className="mt-0.5">
          <Logo size={28} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm text-zinc-200 font-semibold tracking-wide">Quick start</p>
          <p className="mt-1 text-xs text-zinc-400">Paste a GitHub repo URL or an owner/repo (e.g., <span className="font-mono text-zinc-300">vercel/next.js</span>) and click Analyze. Try one of the samples below to get started instantly.</p>
        </div>
      </div>
    </div>
  );
}
