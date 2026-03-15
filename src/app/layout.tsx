import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Logo } from '@/components/Logo';
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
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen text-zinc-50 selection:bg-cyan-300/30 flex flex-col antialiased`}>
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-3">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Logo size={28} showText />
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-zinc-300 shrink-0">
              <Link href="/docs" className="rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 hover:bg-white/10 hover:text-white transition-colors">Docs</Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-cyan-200/25 bg-cyan-200/10 px-2.5 sm:px-3 py-1.5 text-cyan-100 hover:bg-cyan-200/20 transition-colors">GitHub</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
