import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
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
        <Navbar />

        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
