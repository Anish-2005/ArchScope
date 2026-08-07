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
      isScrolled ? 'bg-slate-950/70 backdrop-blur-2xl border-b border-white/[0.08] py-2.5 shadow-2xl' : 'bg-transparent py-4 sm:py-5'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0 group">
              <Logo size={22} showText />
            </Link>

            {/* Live Engine Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.15em]">Engine v1.2 Active</span>
            </div>
          </div>

          <nav className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
            <Link 
              href="/" 
              className={`relative py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all ${
                pathname === '/' ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Engine Core
              {pathname === '/' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />}
            </Link>
            <Link 
              href="/docs" 
              className={`relative py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all ${
                pathname === '/docs' ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Docs
              {pathname === '/docs' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />}
            </Link>
            <Link 
              href="/portfolio" 
              className={`relative py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all hidden sm:inline ${
                pathname === '/portfolio' ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Portfolio
              {pathname === '/portfolio' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />}
            </Link>
            <Link 
              href="/executive" 
              className={`relative py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all hidden sm:inline ${
                pathname === '/executive' ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Executive
              {pathname === '/executive' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />}
            </Link>
            <Link 
              href="/governance" 
              className={`relative py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest transition-all hidden lg:inline ${
                pathname === '/governance' ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Governance
              {pathname === '/governance' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />}
            </Link>
            <a 
              href="https://github.com/Anish-2005/ArchScope" 
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/10 hover:border-cyan-400/40 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all text-zinc-100 shadow-xl flex items-center gap-2 group/gh"
            >
              <span className="hidden sm:inline">GitHub Repository</span>
              <span className="sm:hidden">GitHub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover/gh:scale-125 transition-transform" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

