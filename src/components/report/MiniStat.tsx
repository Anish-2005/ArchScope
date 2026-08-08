interface MiniStatProps {
    label: string;
    value: string;
}

export const MiniStat = ({ label, value }: MiniStatProps) => (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 text-center">
        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
        <p className="text-lg font-extrabold font-mono text-zinc-100">{value}</p>
    </div>
);
