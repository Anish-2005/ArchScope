const BENCHMARKS = [
    { label: "next.js", url: "https://github.com/vercel/next.js", dot: "bg-cyan-400" },
    { label: "react", url: "https://github.com/facebook/react", dot: "bg-teal-400" },
    { label: "tailwind", url: "https://github.com/tailwindlabs/tailwindcss", dot: "bg-sky-400" },
];

interface BenchmarkLinksProps {
    onSelect: (url: string) => void;
}

export const BenchmarkLinks = ({ onSelect }: BenchmarkLinksProps) => (
    <div className="mt-8 flex flex-wrap justify-center items-center gap-2.5 text-sm text-zinc-500 font-medium">
        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] w-full text-center mb-1">Featured Architecture Benchmarks</span>
        {BENCHMARKS.map((benchmark) => (
            <button key={benchmark.label} onClick={() => onSelect(benchmark.url)} className="hover:text-cyan-300 hover:border-cyan-400/40 transition-all bg-white/[0.04] hover:bg-white/[0.08] px-4 py-1.5 rounded-full border border-white/10 font-mono text-[11px] shadow-lg flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${benchmark.dot}`} /> {benchmark.label}
            </button>
        ))}
    </div>
);
