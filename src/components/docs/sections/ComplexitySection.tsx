const BANDS = [
    { range: "0-40", label: "Lean", border: "border-emerald-400/20", bg: "bg-emerald-400/5", text: "text-emerald-400" },
    { range: "41-70", label: "Standard", border: "border-amber-400/20", bg: "bg-amber-400/5", text: "text-amber-400" },
    { range: "71-100", label: "Complex", border: "border-red-400/20", bg: "bg-red-400/5", text: "text-red-400" },
];

export const ComplexitySection = () => (
    <>
        <p className="text-zinc-300 leading-relaxed">
            The Complexity Score (0-100) evaluates the cognitive overhead and maintenance difficulty of a project.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BANDS.map((band) => (
                <div key={band.range} className={`text-center p-4 rounded-2xl border ${band.bg} ${band.border}`}>
                    <p className={`text-2xl font-bold font-mono ${band.text}`}>{band.range}</p>
                    <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1 tracking-widest">{band.label}</p>
                </div>
            ))}
        </div>
    </>
);
