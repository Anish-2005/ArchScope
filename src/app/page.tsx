"use client";

import { ScanForm } from '@/components/ScanForm';
import GettingStarted from '@/components/GettingStarted';
import { Layers, Zap, Gauge, Workflow, Shield, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-1 flex-col items-center justify-start px-4 py-8 sm:px-8 sm:py-14 lg:px-10 lg:py-16 selection:bg-cyan-300/30"
    >


      <div className="z-10 w-full max-w-6xl flex flex-col text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 mx-auto"
        >
          <div className="eyebrow-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-zinc-100 backdrop-blur-md transition-colors hover:bg-white/15">
            <span className="flex h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(125,211,252,0.95)]"></span>
            Trusted by platform and architecture teams
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hero-title text-3xl sm:text-5xl lg:text-7xl font-semibold text-zinc-50 mb-5 drop-shadow-[0_8px_24px_rgba(9,16,25,0.45)]"
        >
          Understand codebases
          <br />
          <span className="bg-gradient-to-r from-cyan-100 via-sky-100 to-teal-100 bg-clip-text text-transparent">for better architecture decisions.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base lg:text-lg text-zinc-200/90 max-w-3xl mx-auto mb-8 sm:mb-10 font-medium leading-relaxed"
        >
          ArchScope analyzes repositories into executive-ready architecture reports: stack composition, operational complexity, and implementation risks. Use it to standardize technical reviews across teams.
        </motion.p>

        <div className="mx-auto w-full max-w-5xl glass-panel rounded-3xl p-4 sm:p-6 mb-12">
          <GettingStarted />
          <ScanForm />
        </div>

        {/* Product Values / Stats Section */}
        <div className="mb-20 sm:mb-24 flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
            <StatChip icon={<Timer className="w-4 h-4 text-cyan-300" />} label="Scan Turnaround" value="~2s Typical" />
            <StatChip icon={<Layers className="w-4 h-4 text-emerald-300" />} label="Stack Dimensions" value="7+ Categories" />
            <StatChip icon={<Workflow className="w-4 h-4 text-amber-300" />} label="Decision Output" value="Actionable" />
            <StatChip icon={<Shield className="w-4 h-4 text-zinc-200" />} label="Use Case" value="Org Governance" />
          </div>

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
        </div>
      </div>
    </motion.div>
  );
}

function StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="group relative p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-slate-900/60 hover:border-cyan-500/50 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
    >
      {/* Dynamic Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(34,211,238,0.12),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 border border-white/10 text-white mb-6 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-zinc-50 mb-3 tracking-tight group-hover:text-cyan-100 transition-colors">{title}</h3>
        <p className="text-sm text-zinc-400/90 leading-relaxed font-medium transition-colors group-hover:text-zinc-300">{desc}</p>
      </div>
      
      {/* Decorative Corner Element */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]" />
      </div>
    </motion.div>
  );
}
