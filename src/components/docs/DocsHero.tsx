interface DocsHeroProps {
    badge: string;
    title: string;
    highlight: string;
    description: string;
}

export const DocsHero = ({ badge, title, highlight, description }: DocsHeroProps) => (
    <section className="space-y-6 scroll-mt-28">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-bold uppercase tracking-widest text-cyan-100 mb-4">
                {badge}
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-zinc-50 tracking-tight">
                {title} <span className="text-cyan-400">{highlight}</span>
            </h1>
        </div>
        <p className="text-lg text-zinc-300 leading-relaxed font-medium">{description}</p>
    </section>
);
