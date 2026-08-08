interface QuickKpiProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueColor?: string;
}

export const QuickKpi = ({ icon, label, value, valueColor = "text-zinc-100" }: QuickKpiProps) => (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
        <div className="shrink-0">{icon}</div>
        <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">{label}</p>
            <p className={`text-sm font-extrabold font-mono ${valueColor}`}>{value}</p>
        </div>
    </div>
);
