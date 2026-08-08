interface NumberFieldProps {
    label: string;
    value: number;
    max: number;
    onChange: (value: number) => void;
    helpText: string;
}

export const NumberField = ({ label, value, max, onChange, helpText }: NumberFieldProps) => (
    <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">{label}</span>
            <span className="text-sm font-extrabold font-mono text-cyan-300">{value}</span>
        </div>
        <input
            type="range"
            min="10"
            max={max}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
        />
        <p className="mt-2 text-[11px] text-zinc-400">{helpText}</p>
    </div>
);
