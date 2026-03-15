"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const HomeHero = () => {
  return (
    <div className="z-10 w-full max-w-6xl flex flex-col text-center relative py-12">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 soft-grid opacity-[0.2] pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="mb-8 mx-auto"
      >
        <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400 bg-cyan-400/5 border border-cyan-400/20 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
          </span>
          V1.2 Protocol Active
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="hero-title text-4xl sm:text-6xl lg:text-8xl font-bold text-zinc-50 mb-6 drop-shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
      >
        Mapping the hidden
        <br />
        <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-teal-300 bg-clip-text text-transparent italic">anatomy of codebases.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="text-base sm:text-xl text-zinc-300/90 max-w-2xl mx-auto mb-10 font-medium leading-relaxed tracking-tight"
      >
        ArchScope converts unstructured repository signals into premium architectural narratives. Standardize technical oversight with industry-leading stack detection.
      </motion.p>
    </div>
  );
};
