"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { 
  BookOpen, 
  Terminal, 
  Code2, 
  Settings, 
  Cpu, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Command,
  FileCode,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const NavItem = ({ icon: Icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) => (
  <a 
    href={href}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
      active 
      ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
    }`}
  >
    <Icon className={`w-4 h-4 transition-colors ${active ? 'text-cyan-300' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
    <span className="text-sm font-medium">{label}</span>
  </a>
);

export default function DocsPage() {
  return (
    <div className="relative flex-1 flex flex-col items-center">
      <AnimatedBackground />
      
      {/* Decorative Brand Mark */}
      <div className="absolute top-20 right-[-10%] opacity-[0.02] pointer-events-none select-none">
          <Logo size={800} />
      </div>

      <div className="z-10 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 gap-10">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 space-y-8 hidden md:block sticky top-28 self-start">
        <div className="space-y-1">
          <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">Introduction</p>
          <NavItem icon={BookOpen} label="Abstract" href="#abstract" active />
          <NavItem icon={Sparkles} label="Core Philosophy" href="#philosophy" />
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">Technical Core</p>
          <NavItem icon={Code2} label="Stack Heuristics" href="#heuristics" />
          <NavItem icon={Cpu} label="Complexity Signal" href="#complexity" />
          <NavItem icon={ShieldCheck} label="Risk Assessment" href="#risk" />
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">Advanced</p>
          <NavItem icon={Terminal} label="CLI Usage" href="#cli" />
          <NavItem icon={Settings} label="Configuration" href="#config" />
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="glass-panel p-4 rounded-2xl bg-gradient-to-br from-cyan-400/5 to-teal-400/5">
            <h4 className="text-xs font-semibold text-zinc-100 mb-2 flex items-center gap-2">
              <Logo size={14} />
              Open Source
            </h4>
            <p className="text-[12px] text-zinc-400 leading-relaxed mb-3">
              ArchScope is built by engineers for engineers.
            </p>
            <a href="https://github.com/Anish-2005/ArchScope" className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl space-y-20 pb-24">
        
        {/* Section: Abstract */}
        <section id="abstract" className="space-y-6 scroll-mt-28">
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

        {/* Section: Philosophy */}
        <section id="philosophy" className="space-y-6 scroll-mt-28">
           <div className="h-px w-full bg-gradient-to-r from-cyan-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-cyan-400 rounded-full" />
             Core Philosophy
           </h2>
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
        </section>

        {/* Section: Heuristics */}
        <section id="heuristics" className="space-y-6 scroll-mt-28">
           <div className="h-px w-full bg-gradient-to-r from-teal-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-teal-400 rounded-full" />
             Stack Detection Heuristics
           </h2>
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
        </section>

        {/* Section: Complexity Score */}
        <section id="complexity" className="space-y-6 scroll-mt-28">
           <div className="h-px w-full bg-gradient-to-r from-blue-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-blue-400 rounded-full" />
             Architecture Index (Score)
           </h2>
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
        </section>

        {/* Section: Risk Assessment */}
        <section id="risk" className="space-y-6 scroll-mt-28">
           <div className="h-px w-full bg-gradient-to-r from-red-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-red-400 rounded-full" />
             Strategic Risk Assessment
           </h2>
           <p className="text-zinc-300 leading-relaxed">
             We flag high-risk patterns like technology fragmentation and unmaintained infrastructure layers.
           </p>
        </section>

        {/* Section: CLI */}
        <section id="cli" className="space-y-6 scroll-mt-28">
           <div className="h-px w-full bg-gradient-to-r from-zinc-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-zinc-400 rounded-full" />
             CLI Integration
           </h2>
           <div className="relative p-6 rounded-2xl bg-black border border-white/10 font-mono text-sm overflow-hidden">
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="text-zinc-500"># Analyze a repository</p>
                  <p className="text-cyan-300">$ npx @archscope/cli scan v1</p>
                </div>
           </div>
        </section>

        {/* Section: Configuration */}
        <section id="config" className="space-y-6 scroll-mt-28 pb-10">
           <div className="h-px w-full bg-gradient-to-r from-purple-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-purple-400 rounded-full" />
             Configuration
           </h2>
           <p className="text-zinc-300 leading-relaxed text-sm">
             Customize detection rules by adding an <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300">archscope.config.json</code> file to your repository root.
           </p>
        </section>

        {/* Footer */}
        <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo size={24} />
            <p className="text-xs text-zinc-500 font-medium tracking-tight">© 2026 ArchScope Engine. Part of the Platform initiative.</p>
          </div>
          <div className="flex gap-6">
             <a href="https://github.com/Anish-2005/ArchScope" className="text-xs text-zinc-400 hover:text-white transition-colors font-mono">v1.2.4-stable</a>
          </div>
        </div>
      </main>
    </div>
  </div>
  );
}
