import { motion } from "framer-motion";
import { DIAL_COLORS } from "./config";

interface ScoreDialProps {
    label: string;
    score: number;
    icon: React.ReactNode;
    color: string;
    invert?: boolean;
}

export const ScoreDial = ({ label, score, icon, color, invert }: ScoreDialProps) => {
    const c = DIAL_COLORS[color] || DIAL_COLORS.zinc;
    const r = 34;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(100, Math.max(0, score));
    const dash = (pct / 100) * circ;

    return (
        <div className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-slate-950/80 px-6 py-5 shadow-xl backdrop-blur-xl ${c.glow}`}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
            <div className="relative">
                <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
                    <circle cx="45" cy="45" r={r} fill="none" strokeWidth="6" className={c.track} />
                    <motion.circle
                        cx="45" cy="45" r={r} fill="none" strokeWidth="6"
                        strokeLinecap="round"
                        className={c.ring}
                        strokeDasharray={circ}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: circ - dash }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className={`text-xl font-extrabold font-mono ${c.text}`}>
                        {score}
                    </motion.span>
                </div>
            </div>
            <div className={`flex items-center gap-1 text-[9px] font-semibold ${c.text}`}>
                {icon} {invert ? (score > 70 ? "High Load" : score > 40 ? "Moderate" : "Lean") : (score > 70 ? "Excellent" : score > 45 ? "Fair" : "Needs Work")}
            </div>
        </div>
    );
};
