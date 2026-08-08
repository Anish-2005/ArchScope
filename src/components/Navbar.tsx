"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { NavLink } from './navbar/NavLink';
import { EngineStatusPill } from './navbar/EngineStatusPill';
import { GitHubCta } from './navbar/GitHubCta';
import { NAV_ITEMS } from '@/constants/navigation';

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
            <EngineStatusPill />
          </div>

          <nav className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={pathname === item.href}
                className={item.className}
              />
            ))}
            <GitHubCta />
          </nav>
        </div>
      </div>
    </header>
  );
};
