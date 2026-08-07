"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const HomeHero = () => {
  return (
    <div className="z-10 w-full max-w-5xl flex flex-col text-center relative pt-8 pb-12 sm:pt-14 sm:pb-16">
      {/* Dynamic Ambient Glow Spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 soft-grid opacity-[0.25] pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="mb-6 mx-auto flex flex-wrap items-center justify-center gap-3"
      >
        <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300 bg-cyan-500/10 border border-cyan-400/25 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
          </span>
          Architectural Intelligence v1.2 Active
        </div>
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-mono font-medium text-zinc-400 bg-white/[0.04] border border-white/10">
          <span>AST Parsing + Heuristic Engine</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="hero-title text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-50 mb-6 drop-shadow-[0_16px_36px_rgba(0,0,0,0.6)] tracking-tight leading-[1.1]"
      >
        Mapping the hidden
        <br />
        <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-300 bg-clip-text text-transparent italic font-serif font-normal">
          anatomy of codebases.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="text-base sm:text-lg lg:text-xl text-zinc-300/90 max-w-2xl mx-auto mb-8 font-medium leading-relaxed tracking-normal"
      >
        ArchScope converts raw repository signals into executive architectural narratives. Standardize technical oversight, technical debt metrics, and governance guardrails.
      </motion.p>
    </div>
  );
};
