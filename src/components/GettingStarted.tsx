import { Logo } from './Logo';
import { Search, Cpu, BarChart3 } from 'lucide-react';

export default function GettingStarted() {
  return (
    <div className="mx-auto w-full max-w-4xl mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 text-left border border-white/10 hover:border-cyan-400/30 transition-all">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Step 1</p>
            <p className="text-xs font-semibold text-zinc-200">Input Repo URL</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 text-left border border-white/10 hover:border-teal-400/30 transition-all">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4 text-teal-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Step 2</p>
            <p className="text-xs font-semibold text-zinc-200">AST & Stack Detection</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 text-left border border-white/10 hover:border-indigo-400/30 transition-all">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Step 3</p>
            <p className="text-xs font-semibold text-zinc-200">Executive Brief & Map</p>
          </div>
        </div>
      </div>
    </div>
  );
}

