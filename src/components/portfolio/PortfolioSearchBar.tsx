import { Search, Filter } from "lucide-react";

const RISK_OPTIONS = ["all", "low", "moderate", "high"] as const;

interface PortfolioSearchBarProps {
    searchQuery: string;
    filterRisk: string;
    onSearchChange: (value: string) => void;
    onFilterChange: (value: string) => void;
}

export const PortfolioSearchBar = ({ searchQuery, filterRisk, onSearchChange, onFilterChange }: PortfolioSearchBarProps) => (
    <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
                type="text"
                placeholder="Search repository..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-cyan-400/50"
            />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
            {RISK_OPTIONS.map((risk) => (
                <button
                    key={risk}
                    onClick={() => onFilterChange(risk)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                        filterRisk === risk
                            ? "bg-cyan-400 text-slate-950 font-extrabold shadow-md"
                            : "bg-white/[0.04] text-zinc-400 hover:text-zinc-200 hover:bg-white/10"
                    }`}
                >
                    {risk === "all" ? "All Risks" : `${risk} Risk`}
                </button>
            ))}
        </div>
    </div>
);
