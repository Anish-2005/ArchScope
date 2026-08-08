interface TerminalLine {
    comment?: string;
    command?: React.ReactNode;
    prompt?: boolean;
}

interface CodeTerminalProps {
    lines: TerminalLine[];
}

export const CodeTerminal = ({ lines }: CodeTerminalProps) => (
    <div className="relative p-6 rounded-2xl bg-slate-950 border border-white/10 font-mono text-sm overflow-hidden group">
        <div className="absolute top-3 right-4 flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-red-500/40 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-amber-500/40 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-emerald-500/40 transition-colors" />
        </div>
        <div className="space-y-4 text-[13px]">
            {lines.map((line, i) => (
                <div key={i} className="space-y-1">
                    {line.comment && <p className="text-zinc-500 text-xs italic">{line.comment}</p>}
                    {line.command && (
                        <p className="text-zinc-100 flex gap-2">
                            {line.prompt && <span className="text-emerald-400">$</span>}
                            <span>{line.command}</span>
                        </p>
                    )}
                </div>
            ))}
        </div>
    </div>
);
