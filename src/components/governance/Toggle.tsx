interface ToggleProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}

export const Toggle = ({ label, description, checked, onChange }: ToggleProps) => (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-5 transition-all">
        <div>
            <span className="block text-sm font-semibold text-zinc-100">{label}</span>
            <span className="mt-1 block text-xs text-zinc-400 font-medium">{description}</span>
        </div>
        <div className="relative inline-flex items-center shrink-0">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-200 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400 peer-checked:after:bg-slate-950 border border-white/10"></div>
        </div>
    </label>
);
