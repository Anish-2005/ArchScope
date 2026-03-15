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
    <header className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-background/50 backdrop-blur-xl border-b border-white/[0.03] py-2.5' : 'bg-transparent py-4'
    }`}>
      <div className="mx-auto max-w-7xl px-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Logo size={22} showText />
          </Link>

          <nav className="flex items-center gap-6 sm:gap-10">
            <Link 
              href="/" 
              className={`text-[12px] sm:text-[13px] font-medium tracking-wide transition-colors ${
                pathname === '/' ? 'text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Engine
            </Link>
            <Link 
              href="/docs" 
              className={`text-[12px] sm:text-[13px] font-medium tracking-wide transition-colors ${
                pathname === '/docs' ? 'text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Docs
            </Link>
            <a 
              href="https://github.com/Anish-2005/ArchScope" 
              target="_blank" 
              rel="noreferrer"
              className="text-[12px] sm:text-[13px] font-medium tracking-wide text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
