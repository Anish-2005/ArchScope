"use client";

import React from 'react';

interface DocsSectionProps {
  id: string;
  title: string;
  gradientFrom: string;
  accentColor: string;
  children: React.ReactNode;
}

export const DocsSection = ({ id, title, gradientFrom, accentColor, children }: DocsSectionProps) => {
  return (
    <section id={id} className="space-y-6 scroll-mt-28">
      <div className={`h-px w-full bg-gradient-to-r ${gradientFrom} to-transparent mb-12`} />
      <h2 className="text-2xl font-semibold text-zinc-50 flex items-center gap-3">
        <div className={`h-8 w-1 ${accentColor} rounded-full`} />
        {title}
      </h2>
      {children}
    </section>
  );
};
