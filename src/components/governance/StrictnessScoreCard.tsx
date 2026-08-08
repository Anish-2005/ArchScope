import { Sliders } from "lucide-react";

interface StrictnessScoreCardProps {
    score: number;
}

export const StrictnessScoreCard = ({ score }: StrictnessScoreCardProps) => (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/10 shrink-0">
        <Sliders className="w-6 h-6 text-cyan-400" />
        <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Strictness Score</p>
            <p className="text-xl font-extrabold font-mono text-cyan-300">{score} / 100</p>
        </div>
    </div>
);
