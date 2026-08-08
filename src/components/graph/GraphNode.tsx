import { GraphNodeLayout } from "@/lib/graph-layout";
import { NODE_KIND_STYLES, DEFAULT_NODE_STYLE } from "@/constants/graph";

interface GraphNodeProps {
    node: GraphNodeLayout;
    faded: boolean;
}

export const GraphNode = ({ node, faded }: GraphNodeProps) => {
    const style = NODE_KIND_STYLES[node.kind] || DEFAULT_NODE_STYLE;

    return (
        <g
            className={`transition-all duration-300 ${faded ? "opacity-20 saturate-0" : "opacity-100 hover:scale-110"}`}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        >
            <circle cx={node.x} cy={node.y} r="18" className={style} strokeWidth="2" />
            <text x={node.x} y={node.y + 30} textAnchor="middle" className="text-[9px] font-mono fill-zinc-300 tracking-wider">
                {node.label}
            </text>
        </g>
    );
};
