import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Layers } from 'lucide-react';
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen text-zinc-50 selection:bg-cyan-300/30 flex flex-col antialiased`}>
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-200 to-teal-200 text-slate-900 shadow-[0_8px_18px_rgba(34,211,238,0.25)]">
                <Layers className="h-4 w-4" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-wide text-zinc-100">ArchScope</span>
                <span className="text-[11px] text-zinc-400 hidden sm:block">Architecture intelligence</span>
              </div>
            </div>
            <nav className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-zinc-300 shrink-0">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 hover:bg-white/10 hover:text-white transition-colors">Docs</a>
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
