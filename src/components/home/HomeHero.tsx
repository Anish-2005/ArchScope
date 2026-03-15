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
    </div>
  );
};
