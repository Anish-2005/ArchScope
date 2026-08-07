import React, { useEffect, useRef, useState } from "react";
import { ArchitectureGraph } from "@/lib/types";

export const DependencyGraph = ({ graph, selectedKind }: { graph: ArchitectureGraph; selectedKind: string | null }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<{ id: string; label: string; kind: string; x: number; y: number; vx: number; vy: number }[]>([]);
    
    // Simple force-directed graph physics
    useEffect(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Initialize positions randomly in the center
        let currentNodes = graph.nodes.map(n => ({
            ...n,
            x: width / 2 + (Math.random() - 0.5) * 100,
            y: height / 2 + (Math.random() - 0.5) * 100,
            vx: 0,
            vy: 0
        }));

        const iterations = 100;
        const k = Math.sqrt((width * height) / currentNodes.length);
        const attraction = 0.05;
        const repulsion = k * k * 5;

        for (let iter = 0; iter < iterations; iter++) {
            // Repulsion
            for (let i = 0; i < currentNodes.length; i++) {
                for (let j = 0; j < currentNodes.length; j++) {
                    if (i === j) continue;
                    const dx = currentNodes[i].x - currentNodes[j].x;
                    const dy = currentNodes[i].y - currentNodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    if (dist < 200) {
                        const force = repulsion / dist;
                        currentNodes[i].vx += (dx / dist) * force;
                        currentNodes[i].vy += (dy / dist) * force;
                    }
                }
            }

            // Attraction
            graph.edges.forEach(edge => {
                const source = currentNodes.find(n => n.id === edge.from);
                const target = currentNodes.find(n => n.id === edge.to);
                if (source && target) {
                    const dx = target.x - source.x;
                    const dy = target.y - source.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = dist * attraction;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    source.vx += fx;
                    source.vy += fy;
                    target.vx -= fx;
                    target.vy -= fy;
                }
            });

            // Center gravity
            for (let i = 0; i < currentNodes.length; i++) {
                const dx = (width / 2) - currentNodes[i].x;
                const dy = (height / 2) - currentNodes[i].y;
                currentNodes[i].vx += dx * 0.02;
                currentNodes[i].vy += dy * 0.02;
            }

            // Apply forces
            currentNodes = currentNodes.map(n => {
                const damping = 0.8;
                return {
                    ...n,
                    x: Math.max(30, Math.min(width - 30, n.x + n.vx * damping)),
                    y: Math.max(30, Math.min(height - 30, n.y + n.vy * damping)),
                    vx: n.vx * damping,
                    vy: n.vy * damping
                };
            });
        }
        
        setNodes(currentNodes);
    }, [graph]);

    const colors: Record<string, string> = {
        application: "fill-cyan-500/20 stroke-cyan-400 text-cyan-200",
        service: "fill-emerald-500/20 stroke-emerald-400 text-emerald-200",
        data: "fill-amber-500/20 stroke-amber-400 text-amber-200",
        delivery: "fill-sky-500/20 stroke-sky-400 text-sky-200",
        ml: "fill-violet-500/20 stroke-violet-400 text-violet-200"
    };

    return (
        <div ref={containerRef} className="w-full h-80 relative overflow-hidden bg-slate-950/40 rounded-xl border border-white/5">
            <svg className="w-full h-full">
                {/* Edges */}
                {graph.edges.map((edge, i) => {
                    const source = nodes.find(n => n.id === edge.from);
                    const target = nodes.find(n => n.id === edge.to);
                    if (!source || !target) return null;
                    const isFaded = selectedKind && source.kind !== selectedKind && target.kind !== selectedKind;
                    return (
                        <g key={`edge-${i}`} className={`transition-opacity duration-300 ${isFaded ? 'opacity-10' : 'opacity-60'}`}>
                            <line 
                                x1={source.x} y1={source.y} 
                                x2={target.x} y2={target.y} 
                                stroke="url(#edge-grad)" strokeWidth="1.5" strokeDasharray="4 2"
                            />
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map(node => {
                    const isFaded = selectedKind && node.kind !== selectedKind;
                    const style = colors[node.kind] || "fill-white/10 stroke-white/30 text-white";
                    return (
                        <g key={node.id} className={`transition-all duration-300 ${isFaded ? 'opacity-20 saturate-0' : 'opacity-100 hover:scale-110'}`} style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
                            <circle cx={node.x} cy={node.y} r="18" className={style} strokeWidth="2" />
                            <text x={node.x} y={node.y + 30} textAnchor="middle" className="text-[9px] font-mono fill-zinc-300 tracking-wider">
                                {node.label}
                            </text>
                        </g>
                    );
                })}

                <defs>
                    <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34,211,238,0.4)" />
                        <stop offset="100%" stopColor="rgba(34,211,238,0.1)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};
