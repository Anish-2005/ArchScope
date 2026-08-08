import { motion } from "framer-motion";

interface SignalBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
    invert?: boolean;
}

const BAR_COLORS: Record<string, string> = {
    cyan: "bg-cyan-400", emerald: "bg-emerald-400", violet: "bg-violet-400", amber: "bg-amber-400",
};

export const SignalBar = ({ label, value, max, color, invert }: SignalBarProps) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const good = invert ? pct < 50 : pct > 60;
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium text-zinc-400">{label}</span>
                <span className={`text-[10px] font-bold font-mono ${good ? "text-emerald-400" : pct > 30 ? "text-amber-400" : "text-rose-400"}`}>
                    {Math.round(pct)}%
                </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.05]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-1.5 rounded-full ${BAR_COLORS[color]}`}
                />
            </div>
        </div>
    );
};
