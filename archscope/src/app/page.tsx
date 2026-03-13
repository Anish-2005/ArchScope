"use client";

import { ScanForm } from '@/components/ScanForm';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Layers, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 overflow-hidden">
      <AnimatedBackground />

      <div className="z-10 w-full max-w-5xl flex flex-col items-center text-center mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md inline-flex items-center gap-3"
        >
          <div className="bg-indigo-500 text-white p-2 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <span className="pr-3 text-sm font-medium tracking-wide text-zinc-300">
            ArchScope Engine v1.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500 mb-6 drop-shadow-sm"
        >
          Instant Tech Stack Analysis.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed"
        >
          Paste any public GitHub repository URL and instantly uncover its technology stack, frameworks, infrastructure, and architectural complexity.
        </motion.p>

        <ScanForm />

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl text-left border-t border-white/10 pt-16">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Lightning Fast"
            desc="Powered by Edge caching, delivering stack reports in under a second."
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6 text-indigo-400" />}
            title="Deep Detection"
            desc="Analyzes package files, dependencies, and repo structure dynamically."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6 text-green-400" />}
            title="Complexity Scoring"
            desc="Objectively measures architectural footprint to gauge maintenance effort."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
    >
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
