import { GraphNodeLayout } from "@/lib/graph-layout";

interface GraphEdgeProps {
    edge: { from: string; to: string };
    nodes: GraphNodeLayout[];
    faded: boolean;
}

export const GraphEdge = ({ edge, nodes, faded }: GraphEdgeProps) => {
    const source = nodes.find((n) => n.id === edge.from);
    const target = nodes.find((n) => n.id === edge.to);
    if (!source || !target) return null;

    return (
        <g className={`transition-opacity duration-300 ${faded ? "opacity-10" : "opacity-60"}`}>
            <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="url(#edge-grad)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
            />
        </g>
    );
};
