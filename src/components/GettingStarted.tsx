import { Logo } from './Logo';

export default function GettingStarted() {
  return (
    <div className="mx-auto w-full max-w-2xl mb-6">
      <div 
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
        className="relative overflow-hidden flex items-start gap-5 p-6 rounded-[2rem] bg-slate-900/40 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl group transition-all duration-500 hover:border-cyan-500/30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(34,211,238,0.05),transparent_40%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="mt-1 flex-shrink-0">
          <div className="p-2 rounded-xl bg-zinc-950/50 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Logo size={24} />
          </div>
        </div>
        <div className="flex-1 text-left">
          <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-1">Quick start guide</p>
          <p className="text-sm text-zinc-300 font-medium leading-relaxed">
            Enter a GitHub repository URL or shorthand <span className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-200">owner/repo</span> and launch the analyzer. Use samples below for an instant demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
