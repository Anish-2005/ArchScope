export interface StackReport {
    languages: string[];
    frameworks: string[];
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
    devtools: string[];
    complexityScore: number;
    repo: {
        name: string;
        owner: string;
        url: string;
        description: string | null;
        stars: number;
    };
}

export interface DetectRule {
    name: string;
    category: 'frameworks' | 'frontend' | 'backend' | 'database' | 'infrastructure' | 'devtools';
    matchDependencies?: string[];
    matchFiles?: string[];
}
