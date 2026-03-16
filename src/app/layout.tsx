import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Logo } from '@/components/Logo';
import { Spotlight } from '@/components/Spotlight';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'ArchScope | Engineering Intelligence',
  description: 'Instant technology stack and architecture analysis for GitHub repositories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen text-zinc-50 selection:bg-cyan-300/30 flex flex-col antialiased overflow-x-hidden`}>
        <Spotlight />
        <AnimatedBackground />
        
        {/* Persistent Brand Mark */}
        <div className="fixed top-[-10%] sm:top-[-5%] right-[-10%] pointer-events-none select-none opacity-[0.05] z-0">
          <Logo size={600} />
        </div>

        <Navbar />

        <main className="flex-1 flex flex-col relative z-10">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>

        <footer className="border-t border-white/5 bg-slate-950/20 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center sm:items-start gap-4">
              <Logo size={24} showText />
              <p className="text-[11px] text-zinc-500 font-medium tracking-wide text-center sm:text-left">
                Engineering intelligence for modern platform teams.<br />
                © 2026 ArchScope Engine. Built for architectural scale.
              </p>
            </div>
            
            <div className="flex items-center gap-8 sm:gap-12 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              <Link href="/docs" className="hover:text-cyan-400 transition-colors">Documentation</Link>
              <a href="https://github.com/Anish-2005/ArchScope" className="hover:text-cyan-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-zinc-200 transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
