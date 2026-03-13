"use client";

import { ScanForm } from '@/components/ScanForm';
import GettingStarted from '@/components/GettingStarted';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Layers, Zap, ShieldCheck, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-6 sm:p-24 overflow-hidden bg-black selection:bg-white/20">
      <AnimatedBackground />

      <div className="z-10 w-full max-w-4xl flex flex-col text-center mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300 backdrop-blur-md transition-colors hover:bg-white/10">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            ArchScope Engine v2.0
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-semibold tracking-tight text-zinc-50 mb-6 drop-shadow-sm font-sans"
        >
          Analyze any repository <br />
          <span className="text-zinc-400">in milliseconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-zinc-300 max-w-2xl mx-auto mb-12 font-medium"
        >
          Enter a GitHub URL. ArchScope intelligently scans dependencies, files, and infrastructure to map out the entire architectural stack instantly.
        </motion.p>

        <GettingStarted />
        <ScanForm />

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto text-left">
          <FeatureCard
            icon={<Zap className="w-5 h-5 text-white" />}
            title="Edge Caching"
            desc="Globally distributed cache powered by Upstash delivers reports instantly without rate limits."
          />
          <FeatureCard
            icon={<Layers className="w-5 h-5 text-white" />}
            title="Heuristic Engine"
            desc="Matches hundreds of specific configurations and dependencies across languages."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5 text-white" />}
            title="Complexity Score"
            desc="Proprietary index to gauge the infrastructural and framework maintenance overhead."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative p-6 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm transition-all hover:bg-zinc-900/80 hover:border-white/10"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white mb-4 ring-1 ring-white/10 group-hover:bg-white/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
