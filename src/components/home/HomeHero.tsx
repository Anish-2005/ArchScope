"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const HomeHero = () => {
  return (
    <div className="z-10 w-full max-w-6xl flex flex-col text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
    </div>
  );
};
