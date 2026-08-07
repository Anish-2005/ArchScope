"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';


export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? 'bg-slate-950/60 backdrop-blur-2xl border-b border-white/[0.05] py-2' : 'bg-transparent py-4'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-10">
            <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <Logo size={18} showText />
            </Link>

            {/* Premium Status Pill - Hidden on Mobile */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-[0.1em]">Engine Live</span>
            </div>
          </div>

          <nav className="flex items-center gap-4 sm:gap-12 flex-shrink-0">
            <Link 
              href="/" 
              className={`text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all ${
                pathname === '/' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <span className="hidden xs:inline">Engine</span>
              <span className="xs:hidden">Core</span>
            </Link>
            <Link 
              href="/docs" 
              className={`text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all ${
                pathname === '/docs' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              Docs
            </Link>
            <Link href="/portfolio" className={`hidden sm:inline text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all ${pathname === '/portfolio' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-200'}`}>
              Portfolio
            </Link>
            <Link href="/governance" className={`hidden lg:inline text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all ${pathname === '/governance' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-200'}`}>
              Governance
            </Link>
            <Link 
              href="https://github.com/Anish-2005/ArchScope" 
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-zinc-100 shadow-2xl"
            >
              <span className="hidden sm:inline">Launch Core</span>
              <span className="sm:hidden">GitHub</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
