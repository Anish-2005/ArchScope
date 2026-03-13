"use client";

import { ScanForm } from '@/components/ScanForm';
import GettingStarted from '@/components/GettingStarted';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Layers, Zap, ShieldCheck, Gauge, Workflow, Shield, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-start px-6 py-10 sm:px-10 sm:py-16 overflow-hidden bg-black selection:bg-white/20">
      <AnimatedBackground />

      <div className="z-10 w-full max-w-6xl flex flex-col text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300 backdrop-blur-md transition-colors hover:bg-white/10">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
            Trusted by platform and architecture teams
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hero-title text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-50 mb-6 drop-shadow-sm font-sans"
        >
          Engineering intelligence for
          <br />
          <span className="text-zinc-300">organizational architecture decisions.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-zinc-300 max-w-3xl mx-auto mb-10 font-medium leading-relaxed"
        >
          ArchScope analyzes repositories into executive-ready architecture reports: stack composition, operational complexity, and implementation risks. Use it to standardize technical reviews across teams.
        </motion.p>

        <div className="mx-auto w-full max-w-5xl glass-panel rounded-3xl p-4 sm:p-6 mb-12">
          <GettingStarted />
          <ScanForm />
        </div>

        <div className="mb-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
          <StatChip icon={<Timer className="w-4 h-4 text-cyan-300" />} label="Scan Turnaround" value="~2s Typical" />
          <StatChip icon={<Layers className="w-4 h-4 text-emerald-300" />} label="Stack Dimensions" value="7+ Categories" />
          <StatChip icon={<Workflow className="w-4 h-4 text-amber-300" />} label="Decision Output" value="Actionable" />
          <StatChip icon={<Shield className="w-4 h-4 text-zinc-200" />} label="Use Case" value="Org Governance" />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto text-left">
          <FeatureCard
            icon={<Zap className="w-5 h-5 text-white" />}
            title="Executive-Ready Summaries"
            desc="Convert low-level project signals into concise architecture narratives suitable for leads, architects, and EMs."
          />
          <FeatureCard
            icon={<Layers className="w-5 h-5 text-white" />}
            title="Reliable Stack Detection"
            desc="Detect frameworks, data stores, infrastructure, and tooling with robust heuristics and config-aware matching."
          />
          <FeatureCard
            icon={<Gauge className="w-5 h-5 text-white" />}
            title="Operational Complexity Index"
            desc="Prioritize modernization and platform investments using a single complexity signal across repositories."
          />
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="kpi-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-zinc-200 text-xs font-medium uppercase tracking-wide mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm sm:text-base text-zinc-100 font-semibold">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative p-6 rounded-2xl bg-zinc-900/45 border border-white/10 backdrop-blur-sm transition-all hover:bg-zinc-900/80 hover:border-white/20"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white mb-4 ring-1 ring-white/10 group-hover:bg-white/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
