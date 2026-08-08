interface KpiCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext: string;
}

export const KpiCard = ({ icon, label, value, subtext }: KpiCardProps) => (
    <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-3">
            {icon} {label}
        </div>
        <p className="text-3xl font-extrabold font-mono text-zinc-50">{value}</p>
        <p className="text-xs text-zinc-400 mt-1 font-medium">{subtext}</p>
    </div>
);
