"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/constants/site";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsSection } from "@/components/docs/DocsSection";
import { DocsHero } from "@/components/docs/DocsHero";
import { DocsFooter } from "@/components/docs/DocsFooter";
import { PhilosophySection } from "@/components/docs/sections/PhilosophySection";
import { HeuristicsSection } from "@/components/docs/sections/HeuristicsSection";
import { ComplexitySection } from "@/components/docs/sections/ComplexitySection";
import { CliSection } from "@/components/docs/sections/CliSection";
import { RiskSection, ConfigSection } from "@/components/docs/sections/BriefSections";
import { useActiveSection } from "@/hooks/useActiveSection";

const DOCS_SECTIONS = Object.values(SITE_CONFIG.sections);

export default function DocsPage() {
  const activeSection = useActiveSection(DOCS_SECTIONS);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full flex flex-col items-center"
    >
      <div className="z-10 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 gap-10 min-h-screen">

        <DocsSidebar activeSection={activeSection} />

        <main className="flex-1 max-w-3xl space-y-20 pb-24">
          <DocsHero
            badge="Documentation v1.0"
            title="Engineering"
            highlight="Intelligence"
            description="ArchScope is a high-performance analysis engine designed to convert complex repository signals into executive-ready architectural narratives. It standardizes how platform teams and senior leadership evaluate technical debt and operational risks."
          />

          <DocsSection id={SITE_CONFIG.sections.philosophy} title="Core Philosophy" gradientFrom="from-cyan-400/20" accentColor="bg-cyan-400">
            <PhilosophySection />
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.heuristics} title="Stack Detection Heuristics" gradientFrom="from-teal-400/20" accentColor="bg-teal-400">
            <HeuristicsSection />
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.complexity} title="Architecture Index (Score)" gradientFrom="from-blue-400/20" accentColor="bg-blue-400">
            <ComplexitySection />
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.risk} title="Strategic Risk Assessment" gradientFrom="from-red-400/20" accentColor="bg-red-400">
            <RiskSection />
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.cli} title="Interface (CLI)" gradientFrom="from-zinc-400/20" accentColor="bg-zinc-400">
            <CliSection />
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.config} title="Configuration" gradientFrom="from-purple-400/20" accentColor="bg-purple-400">
            <ConfigSection />
          </DocsSection>

          <DocsFooter />
        </main>
      </div>
    </motion.div>
  );
}
