"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Layers, Gauge } from 'lucide-react';

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="group relative p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-slate-900/60 hover:border-cyan-500/50 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(34,211,238,0.12),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 border border-white/10 text-white mb-6 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-zinc-50 mb-3 tracking-tight group-hover:text-cyan-100 transition-colors">{title}</h3>
        <p className="text-sm text-zinc-400/90 leading-relaxed font-medium transition-colors group-hover:text-zinc-300">{desc}</p>
      </div>
      
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]" />
      </div>
    </motion.div>
  );
};

export const CapabilitiesSection = () => {
  return (
    <div className="mt-24 sm:mt-32 w-full max-w-6xl">
      <div className="flex flex-col items-center mb-12 sm:mb-16">
        <span className="text-cyan-400 font-bold uppercase tracking-[0.25em] text-[10px] mb-4">Core Platform Capabilities</span>
        <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight text-center">Engineered for architectural oversight.</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <FeatureCard
          icon={<Zap className="w-6 h-6 text-white" />}
          title="Executive-Ready Summaries"
          desc="Convert low-level project signals into concise architecture narratives suitable for leads, architects, and EMs."
        />
        <FeatureCard
          icon={<Layers className="w-6 h-6 text-white" />}
          title="Reliable Stack Detection"
          desc="Detect frameworks, data stores, infrastructure, and tooling with robust heuristics and config-aware matching."
        />
        <FeatureCard
          icon={<Gauge className="w-6 h-6 text-white" />}
          title="Operational Complexity Index"
          desc="Prioritize modernization and platform investments using a single complexity signal across repositories."
        />
      </div>
    </div>
  );
};
