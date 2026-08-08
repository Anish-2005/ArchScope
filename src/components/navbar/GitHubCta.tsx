export const GitHubCta = () => (
    <a
        href="https://github.com/Anish-2005/ArchScope"
        target="_blank"
        rel="noreferrer"
        className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/10 hover:border-cyan-400/40 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all text-zinc-100 shadow-xl flex items-center gap-2 group/gh"
    >
        <span className="hidden sm:inline">GitHub Repository</span>
        <span className="sm:hidden">GitHub</span>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover/gh:scale-125 transition-transform" />
    </a>
);
