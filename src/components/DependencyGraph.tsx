"use client";

import { useEffect, useRef, useState } from "react";
import { ArchitectureGraph } from "@/lib/types";
import { GraphNodeLayout, computeForceLayout } from "@/lib/graph-layout";
import { GraphNode } from "./graph/GraphNode";
import { GraphEdge } from "./graph/GraphEdge";

interface DependencyGraphProps {
    graph: ArchitectureGraph;
    selectedKind: string | null;
}

export const DependencyGraph = ({ graph, selectedKind }: DependencyGraphProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<GraphNodeLayout[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setNodes(computeForceLayout(graph.nodes, graph.edges, width, height));
    }, [graph]);

    return (
        <div ref={containerRef} className="w-full h-80 relative overflow-hidden bg-slate-950/40 rounded-xl border border-white/5">
            <svg className="w-full h-full">
                {graph.edges.map((edge, i) => (
                    <GraphEdge
                        key={`edge-${i}`}
                        edge={edge}
                        nodes={nodes}
                        faded={!!selectedKind && nodes.find((n) => n.id === edge.from)?.kind !== selectedKind && nodes.find((n) => n.id === edge.to)?.kind !== selectedKind}
                    />
                ))}

                {nodes.map((node) => (
                    <GraphNode key={node.id} node={node} faded={!!selectedKind && node.kind !== selectedKind} />
                ))}

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
