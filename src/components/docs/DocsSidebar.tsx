"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  BookOpen, 
  Terminal, 
  Code2, 
  Settings, 
  Cpu, 
  ShieldCheck, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { SITE_CONFIG } from '@/constants/site';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, href, active = false }: NavItemProps) => (
  <a 
    href={href}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
      active 
      ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
    }`}
  >
    <Icon className={`w-4 h-4 transition-colors ${active ? 'text-cyan-300' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
    <span className="text-sm font-medium">{label}</span>
  </a>
);

interface DocsSidebarProps {
  activeSection: string;
}

export const DocsSidebar = ({ activeSection }: DocsSidebarProps) => {
  return (
    <aside className="w-full md:w-64 shrink-0 space-y-8 hidden md:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-hide">
      <div className="space-y-1">
        <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">Introduction</p>
        <NavItem icon={BookOpen} label="Abstract" href="#abstract" active={activeSection === 'abstract'} />
        <NavItem icon={Sparkles} label="Core Philosophy" href="#philosophy" active={activeSection === 'philosophy'} />
      </div>

      <div className="space-y-1">
        <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">Technical Core</p>
        <NavItem icon={Code2} label="Stack Heuristics" href="#heuristics" active={activeSection === 'heuristics'} />
        <NavItem icon={Cpu} label="Complexity Signal" href="#complexity" active={activeSection === 'complexity'} />
        <NavItem icon={ShieldCheck} label="Risk Assessment" href="#risk" active={activeSection === 'risk'} />
      </div>

      <div className="space-y-1">
        <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">Advanced</p>
        <NavItem icon={Terminal} label="CLI Usage" href="#cli" active={activeSection === 'cli'} />
        <NavItem icon={Settings} label="Configuration" href="#config" active={activeSection === 'config'} />
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
          <a href={SITE_CONFIG.links.github} className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5">
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
