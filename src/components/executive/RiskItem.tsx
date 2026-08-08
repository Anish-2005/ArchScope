interface RiskItemProps {
    title: string;
    count: number;
    severity: string;
}

export const RiskItem = ({ title, count, severity }: RiskItemProps) => (
    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
        <div>
            <p className="text-xs font-semibold text-zinc-200">{title}</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{count} repos impacted</p>
        </div>
        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${severity === 'high' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
            {count > 0 ? `${count} REPOS` : 'CLEAR'}
        </span>
    </div>
);
