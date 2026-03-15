"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Search, Command as CommandIcon } from 'lucide-react';

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
      <div className="mx-auto max-w-7xl px-6 sm:px-12">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <Logo size={20} showText />
            </Link>

            {/* Premium Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-[0.1em]">Engine Live</span>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="group relative flex items-center">
              <div className="absolute left-3 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <Search className="w-3.5 h-3.5" />
              </div>
              <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-1.5 pl-9 pr-3 text-[12px] text-zinc-400 font-medium group-hover:bg-white/[0.05] group-hover:border-white/[0.15] transition-all cursor-pointer flex items-center justify-between">
                <span>Search architecture...</span>
                <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <CommandIcon className="w-2.5 h-2.5" />
                  <span className="text-[10px] font-bold">K</span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
            <Link 
              href="/" 
              className={`text-[12px] font-bold uppercase tracking-widest transition-all ${
                pathname === '/' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              Engine
            </Link>
            <Link 
              href="/docs" 
              className={`text-[12px] font-bold uppercase tracking-widest transition-all ${
                pathname === '/docs' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              Docs
            </Link>
            <Link 
              href="https://github.com/Anish-2005/ArchScope" 
              className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-zinc-100"
            >
              Launch Core
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
