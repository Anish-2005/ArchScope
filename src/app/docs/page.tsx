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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

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
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
  </a>
);

export default function DocsPage() {
  return (
    <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 gap-10">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 space-y-8 hidden md:block">
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
              ArchScope is built by engineers for engineers. Contribute on GitHub.
            </p>
            <a href="https://github.com" className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5">
              Source Code <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl space-y-16 pb-24">
        
        {/* Intro Section */}
        <section id="abstract" className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-bold uppercase tracking-widest text-cyan-100 mb-4">
              Documentation v1.0
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-zinc-50 tracking-tight">
              Engineering Intelligence <span className="text-cyan-400">ArchScope</span>
            </h1>
          </div>
          
          <p className="text-lg text-zinc-300 leading-relaxed font-medium">
            ArchScope is a high-performance analysis engine designed to convert complex repository signals into executive-ready architectural narratives. It standardizes how platform teams and senior leadership evaluate technical debt, stack composition, and operational risks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors group">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                Stack Recognition
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Deterministic detection of frameworks, databases, and infrastructure through multi-layer file analysis.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-400/30 transition-colors group">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                Complexity Profiling
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A proprietary scoring algorithm that evaluates mental overhead and maintenance risk at organizational scale.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Heuristics */}
        <section id="heuristics" className="space-y-6 scroll-mt-24">
           <div className="h-px w-full bg-gradient-to-r from-cyan-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-cyan-400 rounded-full" />
             Stack Detection Heuristics
           </h2>
           <p className="text-zinc-300 leading-relaxed">
             ArchScope doesn't just look at <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-200">package.json</code>. Our engine performs a deep recursive scan to identify hidden dependencies and platform configurations that define your real architecture.
           </p>

           <div className="space-y-4">
             <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
               <ul className="space-y-4">
                 <li className="flex gap-4">
                   <div className="h-6 w-6 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0 mt-1">
                     <span className="text-[10px] font-bold text-cyan-300">01</span>
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-zinc-100 mb-1">Manifest Analysis</p>
                     <p className="text-xs text-zinc-400 leading-relaxed">Validation of primary dependencies across Npm, Cargo, GoMod, and PyProject manifests.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="h-6 w-6 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0 mt-1">
                     <span className="text-[10px] font-bold text-cyan-300">02</span>
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-zinc-100 mb-1">Configuration Signatures</p>
                     <p className="text-xs text-zinc-400 leading-relaxed">Detecting infrastructure-as-code patterns via Terraform, Kubernetes, and serverless configs.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="h-6 w-6 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0 mt-1">
                     <span className="text-[10px] font-bold text-cyan-300">03</span>
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-zinc-100 mb-1">Implementation Heuristics</p>
                     <p className="text-xs text-zinc-400 leading-relaxed">Looking for specific code patterns that indicate the use of unlisted internally-developed frameworks.</p>
                   </div>
                 </li>
               </ul>
             </div>
           </div>
        </section>

        {/* Section: Risk Assessment */}
        <section id="risk" className="space-y-6 scroll-mt-24">
           <div className="h-px w-full bg-gradient-to-r from-red-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-red-400 rounded-full" />
             Strategic Risk Assessment
           </h2>
           <p className="text-zinc-300 leading-relaxed">
             ArchScope categorizes risk into three primary vectors: **Maintenance Velocity**, **Security Surface**, and **Knowledge Silos**. Our engine flags repositories that exceed governance thresholds.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-red-300 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  High Risk Vector
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Fragmentation: Using multiple frameworks for the same layer (e.g., Next.js and Remix in one repo).
                </p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-red-400" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Low Risk Vector
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Standardization: Pure-type repositories with unified build tooling (e.g., Turborepo + Go).
                </p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-emerald-400" />
                </div>
              </div>
           </div>
        </section>

        {/* Section: CLI */}
        <section id="cli" className="space-y-6 scroll-mt-24">
           <div className="h-px w-full bg-gradient-to-r from-zinc-400/20 to-transparent mb-12" />
           <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
             <div className="h-8 w-1 bg-zinc-400 rounded-full" />
             CLI & Continuous Integration
           </h2>
           <p className="text-zinc-300 leading-relaxed text-sm">
             Integrate ArchScope into your CI/CD pipeline to block PRs that significantly increase architectural complexity.
           </p>

           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative p-6 rounded-2xl bg-black border border-white/10 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
                <div className="space-y-2">
                  <p className="text-zinc-500"># Install the ArchScope CLI</p>
                  <p className="text-cyan-300">$ npm install -g @archscope/cli</p>
                  <p className="text-zinc-500 mt-4"># Analyze a local directory</p>
                  <p className="text-cyan-300">$ archscope scan ./src --output json</p>
                  <p className="text-zinc-500 mt-4"># Enforce complexity limits in CI</p>
                  <p className="text-cyan-300">$ archscope check --max-complexity 65</p>
                </div>
              </div>
           </div>
        </section>

        {/* Footer */}
        <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo size={24} />
            <p className="text-xs text-zinc-500 font-medium">© 2026 ArchScope Engine. Part of the Modern Platform initiative.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">Terms</a>
            <a href="https://github.com" className="text-xs text-zinc-400 hover:text-white transition-colors font-mono">v1.2.4-stable</a>
          </div>
        </div>
      </main>
    </div>
  );
}
