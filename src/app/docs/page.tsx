"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { 
  Zap,
  Command,
  FileCode,
  Settings
} from 'lucide-react';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsSection } from '@/components/docs/DocsSection';
import { useActiveSection } from '@/hooks/useActiveSection';
import { SITE_CONFIG } from '@/constants/site';

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

        {/* Main Content Area */}
        <main className="flex-1 max-w-3xl space-y-20 pb-24">
          
          {/* Section: Abstract */}
          <section id={SITE_CONFIG.sections.abstract} className="space-y-6 scroll-mt-28">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-bold uppercase tracking-widest text-cyan-100 mb-4">
                Documentation v1.0
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold text-zinc-50 tracking-tight">
                Engineering <span className="text-cyan-400">Intelligence</span>
              </h1>
            </div>
            
            <p className="text-lg text-zinc-300 leading-relaxed font-medium">
              ArchScope is a high-performance analysis engine designed to convert complex repository signals into executive-ready architectural narratives. It standardizes how platform teams and senior leadership evaluate technical debt and operational risks.
            </p>
          </section>

          <DocsSection id={SITE_CONFIG.sections.philosophy} title="Core Philosophy" gradientFrom="from-cyan-400/20" accentColor="bg-cyan-400">
             <p className="text-zinc-300 leading-relaxed">
               We believe that architecture is not just what is documented, but what is actually implemented in the codebase. ArchScope bridges the gap between intended design and technical reality.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <Zap className="w-5 h-5 text-amber-400 mb-3" />
                  <h4 className="text-sm font-semibold text-zinc-100 mb-1">Evidence-Based</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Analysis is derived from actual file markers and configuration signatures, not manual tags.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <Command className="w-5 h-5 text-blue-400 mb-3" />
                  <h4 className="text-sm font-semibold text-zinc-100 mb-1">Standardized Metrics</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Unified complexity signals that allow comparison across heterogeneous technology stacks.</p>
                </div>
             </div>
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.heuristics} title="Stack Detection Heuristics" gradientFrom="from-teal-400/20" accentColor="bg-teal-400">
             <p className="text-zinc-300 leading-relaxed">
               Our engine performs recursive scanning to identify primary and secondary layers of the technical stack.
             </p>
             <div className="glass-panel p-6 rounded-3xl bg-slate-900/40 space-y-4">
                <div className="flex gap-4">
                  <FileCode className="w-5 h-5 text-cyan-300 mt-1" />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">Manifest Resolution</h4>
                    <p className="text-xs text-zinc-400">Deep validation of lock files to distinguish between transitive and primary dependencies.</p>
                  </div>
                </div>
                <div className="flex gap-4 border-t border-white/5 pt-4">
                  <Settings className="w-5 h-5 text-emerald-300 mt-1" />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">Config Signatures</h4>
                    <p className="text-xs text-zinc-400">Detection of cloud providers (AWS, GCP, Vercel) through specialized configuration markers.</p>
                  </div>
                </div>
             </div>
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.complexity} title="Architecture Index (Score)" gradientFrom="from-blue-400/20" accentColor="bg-blue-400">
             <p className="text-zinc-300 leading-relaxed">
               The Complexity Score (0-100) evaluates the cognitive overhead and maintenance difficulty of a project.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-2xl bg-emerald-400/5 border border-emerald-400/20">
                  <p className="text-2xl font-bold font-mono text-emerald-400">0-40</p>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1 tracking-widest">Lean</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20">
                  <p className="text-2xl font-bold font-mono text-amber-400">41-70</p>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1 tracking-widest">Standard</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-red-400/5 border border-red-400/20">
                  <p className="text-2xl font-bold font-mono text-red-400">71-100</p>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1 tracking-widest">Complex</p>
                </div>
             </div>
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.risk} title="Strategic Risk Assessment" gradientFrom="from-red-400/20" accentColor="bg-red-400">
             <p className="text-zinc-300 leading-relaxed">
               We flag high-risk patterns like technology fragmentation and unmaintained infrastructure layers.
             </p>
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.cli} title="Interface (CLI)" gradientFrom="from-zinc-400/20" accentColor="bg-zinc-400">
             <p className="text-zinc-300 leading-relaxed text-sm mb-6">
               The ArchScope CLI allows you to trigger deep architectural scans directly from your terminal or CI/CD pipelines.
             </p>
             <div className="relative p-6 rounded-2xl bg-slate-950 border border-white/10 font-mono text-sm overflow-hidden group">
                  <div className="absolute top-3 right-4 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-red-500/40 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-amber-500/40 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-emerald-500/40 transition-colors" />
                  </div>
                  <div className="space-y-4 text-[13px]">
                    <div className="space-y-1">
                      <p className="text-zinc-500 text-xs italic">{"// Install global binary"}</p>
                      <p className="text-cyan-400">npm install -g @archscope/cli</p>
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="text-zinc-500 text-xs italic">{"// Run a tactical scan"}</p>
                      <p className="text-zinc-100 flex gap-2">
                        <span className="text-emerald-400">$</span>
                        <span>archscope scan <span className="text-amber-400">facebook/react</span> --output <span className="text-cyan-400">json</span></span>
                      </p>
                    </div>
                  </div>
             </div>
          </DocsSection>

          <DocsSection id={SITE_CONFIG.sections.config} title="Configuration" gradientFrom="from-purple-400/20" accentColor="bg-purple-400">
             <p className="text-zinc-300 leading-relaxed text-sm">
               Customize detection rules by adding an <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">archscope.config.json</code> file to your repository root.
             </p>
          </DocsSection>

          {/* Footer */}
          <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Logo size={24} />
              <p className="text-xs text-zinc-500 font-medium tracking-tight">© 2026 {SITE_CONFIG.name} Engine. Part of the Platform initiative.</p>
            </div>
            <div className="flex gap-6">
               <a href={SITE_CONFIG.links.github} className="text-xs text-zinc-400 hover:text-white transition-colors font-mono">v1.2.4-stable</a>
            </div>
          </div>

        </main>
      </div>
    </motion.div>
  );
}
