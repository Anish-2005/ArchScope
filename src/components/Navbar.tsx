"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { Github, BookText, Cpu, Command, Search, Menu, X, LucideIcon } from 'lucide-react';

const NavLink = ({ href, children, icon: Icon, active }: { href: string; children: React.ReactNode; icon: LucideIcon; active: boolean }) => (
  <Link 
    href={href}
    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all group ${
      active ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="nav-active"
        className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-400 font-bold'}`} />
    <span>{children}</span>
  </Link>
);

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-[100] w-full transition-all duration-500 ${
      isScrolled 
      ? 'py-3 bg-slate-950/65 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
      : 'py-5 bg-transparent border-b border-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 transition-transform hover:opacity-90 active:scale-95">
            <Logo size={32} showText />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/5 p-1 rounded-xl backdrop-blur-sm shadow-inner group-hover:border-white/10 transition-colors">
            <NavLink href="/" icon={Cpu} active={pathname === '/'}>Engine</NavLink>
            <NavLink href="/docs" icon={BookText} active={pathname === '/docs'}>Documentation</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Command Trigger (Visual only) */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-white/10 text-zinc-500 cursor-text hover:border-cyan-500/30 transition-all hover:bg-zinc-900/80"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Search patterns...</span>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 border border-white/5">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </motion.div>

            <motion.a 
              whileHover={{ y: -1 }}
              whileTap={{ y: 0, scale: 0.98 }}
              href="https://github.com/Anish-2005/ArchScope" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 bg-gradient-to-b from-white to-zinc-200 text-zinc-950 px-4 py-2 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </motion.a>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-3xl border-b border-white/10 overflow-hidden md:hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              <Link 
                href="/" 
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/' ? 'bg-white/10 text-white' : 'bg-white/5 text-zinc-400'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Engine Dashboard
              </Link>
              <Link 
                href="/docs" 
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/docs' ? 'bg-white/10 text-white' : 'bg-white/5 text-zinc-400'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
