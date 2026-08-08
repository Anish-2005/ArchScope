import { Activity } from "lucide-react";

interface MetricProps {
    label: string;
    value: string;
}

export const Metric = ({ label, value }: MetricProps) => (
    <div className="text-right">
        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-zinc-100 font-mono flex items-center justify-end gap-1">
            <Activity className="h-3 w-3 text-cyan-400" />
            {value}
        </p>
    </div>
);
