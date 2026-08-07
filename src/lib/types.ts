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
    repo: {
        name: string;
        owner: string;
        url: string;
        description: string | null;
        stars: number;
    };
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
