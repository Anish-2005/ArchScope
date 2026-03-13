import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Layers } from 'lucide-react';
import './globals.css';
// Initialize Sentry for client-side instrumentation
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../../sentry.client.config');
} catch (e) {
  // ignore in environments where Sentry isn't configured
}

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
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen bg-black text-zinc-50 selection:bg-white/20 flex flex-col antialiased`}>
        {/* Premium App Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-wide">ArchScope</span>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Documentation</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
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
