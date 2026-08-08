interface InputFieldProps {
    label: string;
    placeholder: string;
    type?: string;
    value: string;
    icon: React.ReactNode;
    required?: boolean;
    onChange: (value: string) => void;
}

export const InputField = ({ label, placeholder, type = "text", value, icon, required, onChange }: InputFieldProps) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500">{icon}</div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all shadow-inner"
            />
        </div>
    </div>
);
