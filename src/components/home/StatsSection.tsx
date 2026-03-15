"use client";

import React from 'react';
import { Timer, Layers, Workflow, Shield } from 'lucide-react';

const StatChip = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  return (
    <div className="kpi-card relative group rounded-2xl p-4 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(34,211,238,0.1)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-2.5 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-2.5">
        <div className="p-1.5 rounded-lg bg-zinc-900/50 border border-white/5 shadow-inner">
          {icon}
        </div>
        <span>{label}</span>
      </div>
      <p className="text-base sm:text-lg text-zinc-100 font-bold tracking-tight">{value}</p>
    </div>
  );
};

export const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl mb-20">
      <StatChip icon={<Timer className="w-4 h-4 text-cyan-300" />} label="Scan Turnaround" value="~2s Typical" />
      <StatChip icon={<Layers className="w-4 h-4 text-emerald-300" />} label="Stack Dimensions" value="7+ Categories" />
      <StatChip icon={<Workflow className="w-4 h-4 text-amber-300" />} label="Decision Output" value="Actionable" />
      <StatChip icon={<Shield className="w-4 h-4 text-zinc-200" />} label="Use Case" value="Org Governance" />
    </div>
  );
};
