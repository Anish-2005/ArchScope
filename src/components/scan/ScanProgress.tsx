import { motion } from "framer-motion";

interface ScanProgressProps {
    step: number;
    stepCount: number;
    message: string;
}

export const ScanProgress = ({ step, stepCount, message }: ScanProgressProps) => {
    const percent = Math.round(((step + 1) / stepCount) * 100);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 mb-2">
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    {message}
                </span>
                <span className="font-bold">{percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
                    initial={{ width: "10%" }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </motion.div>
    );
};
