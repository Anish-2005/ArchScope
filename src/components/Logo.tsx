"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 32, showText = false }) => {
  const uniqueId = React.useId().replace(/:/g, "");
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]"
      >
        <defs>
          <linearGradient id={`grad-cyan-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id={`grad-teal-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        
        {/* Procedural Hexagon */}
        <path
          d="M50 5L89.5 27.5V72.5L50 95L10.5 72.5V27.5L50 5Z"
          stroke={`url(#grad-cyan-${uniqueId})`}
          strokeWidth="5"
          strokeLinejoin="round"
          className="opacity-90"
        />
        
        {/* Inner Precision Ring */}
        <circle 
          cx="50" cy="50" r="22" 
          stroke={`url(#grad-teal-${uniqueId})`} 
          strokeWidth="2" 
          strokeDasharray="4 4" 
          className="opacity-60"
        />
        
        {/* Crosshair Elements */}
        <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-cyan-400">
          <path d="M50 15V30" />
          <path d="M50 70V85" />
          <path d="M15 50H30" />
          <path d="M70 50H85" />
        </g>
        
        {/* Core "A" Prism */}
        <path 
          d="M32 72L50 35L68 72" 
          stroke={`url(#grad-cyan-${uniqueId})`} 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M40 60H60" 
          stroke={`url(#grad-teal-${uniqueId})`} 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        
        {/* Glint effect */}
        <circle cx="35" cy="35" r="2" fill="white" className="animate-pulse" />
      </svg>
      {showText && (
        <span className="font-bold tracking-tight text-white select-none whitespace-nowrap" style={{ fontSize: size * 0.75 }}>
          Arch<span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">Scope</span>
        </span>
      )}
    </div>
  );
};
