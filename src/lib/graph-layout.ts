export interface GraphNodeInput {
    id: string;
    label: string;
    kind: string;
}

export interface GraphNodeLayout extends GraphNodeInput {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export interface GraphEdgeInput {
    from: string;
    to: string;
}

const DAMPING = 0.8;
const BOUNDARY_MARGIN = 30;

/**
 * Runs a deterministic-ish force-directed simulation to position graph nodes.
 * Pure function — no DOM/React dependencies, unit-testable.
 */
export function computeForceLayout(
    graphNodes: GraphNodeInput[],
    edges: GraphEdgeInput[],
    width: number,
    height: number,
    iterations = 100
): GraphNodeLayout[] {
    let currentNodes: GraphNodeLayout[] = graphNodes.map((n) => ({
        ...n,
        x: width / 2 + (Math.random() - 0.5) * 100,
        y: height / 2 + (Math.random() - 0.5) * 100,
        vx: 0,
        vy: 0,
    }));

    const k = Math.sqrt((width * height) / Math.max(currentNodes.length, 1));
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

        // Attraction along edges
        edges.forEach((edge) => {
            const source = currentNodes.find((n) => n.id === edge.from);
            const target = currentNodes.find((n) => n.id === edge.to);
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
            const dx = width / 2 - currentNodes[i].x;
            const dy = height / 2 - currentNodes[i].y;
            currentNodes[i].vx += dx * 0.02;
            currentNodes[i].vy += dy * 0.02;
        }

        // Apply forces
        currentNodes = currentNodes.map((n) => ({
            ...n,
            x: Math.max(BOUNDARY_MARGIN, Math.min(width - BOUNDARY_MARGIN, n.x + n.vx * DAMPING)),
            y: Math.max(BOUNDARY_MARGIN, Math.min(height - BOUNDARY_MARGIN, n.y + n.vy * DAMPING)),
            vx: n.vx * DAMPING,
            vy: n.vy * DAMPING,
        }));
    }

    return currentNodes;
}
