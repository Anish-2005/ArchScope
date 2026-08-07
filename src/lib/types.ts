export interface StackReport {
    languages: string[];
    frameworks: string[];
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
    devtools: string[];
    complexityScore: number;
    healthScore: number;
    deliveryRisk: "low" | "medium" | "high";
    mlReadiness: number;
    signals: {
        fileCount: number;
        dependencyCount: number;
        workflowCount: number;
        testSignals: number;
        documentationScore: number;
        architecturePatterns: string[];
    };
    findings: Finding[];
    recommendations: Recommendation[];
    architectureGraph: ArchitectureGraph;
    scanId?: string;
    scannedAt?: string;
    repo: {
        name: string;
        owner: string;
        url: string;
        description: string | null;
        stars: number;
    };
}

export interface ArchitectureGraph {
    nodes: { id: string; label: string; kind: "application" | "service" | "data" | "delivery" | "ml" }[];
    edges: { from: string; to: string; label: string }[];
}

export interface ScanRecord {
    id: string;
    organization: string;
    repository: string;
    scannedAt: string;
    report: StackReport;
}

export interface ArchitecturePolicy {
    organization: string;
    requireCi: boolean;
    requireTestEvidence: boolean;
    maxDependencies: number;
    maxComplexity: number;
}

export interface Finding {
    id: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    title: string;
    detail: string;
    category: "security" | "delivery" | "architecture" | "data" | "ml";
}

export interface Recommendation {
    title: string;
    detail: string;
    priority: "now" | "next" | "later";
}

export interface DetectRule {
    name: string;
    category: 'frameworks' | 'frontend' | 'backend' | 'database' | 'infrastructure' | 'devtools';
    matchDependencies?: string[];
    matchFiles?: string[];
}
