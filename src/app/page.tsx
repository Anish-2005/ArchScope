"use client";

import { motion } from 'framer-motion';
import { ScanForm } from '@/components/ScanForm';
import GettingStarted from '@/components/GettingStarted';
import { HomeHero } from '@/components/home/HomeHero';
import { StatsSection } from '@/components/home/StatsSection';
import { CapabilitiesSection } from '@/components/home/CapabilitiesSection';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-1 flex-col items-center justify-start px-4 py-8 sm:px-8 sm:py-14 lg:px-10 lg:py-16 selection:bg-cyan-300/30"
    >
      <HomeHero />

      <div className="mx-auto w-full max-w-5xl glass-panel rounded-3xl p-4 sm:p-6 mb-12 z-10">
        <GettingStarted />
        <ScanForm />
      </div>

      {/* Product Values / StatsSection & Capabilities */}
      <div className="mb-20 sm:mb-24 flex flex-col items-center w-full z-10">
        <StatsSection />
        <CapabilitiesSection />
      </div>
    </motion.div>
  );
}
