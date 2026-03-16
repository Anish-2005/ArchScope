import { DetectRule, StackReport } from './types';
import { GitHubRepoData } from './github';
import { calculateComplexity } from './complexity';

const RULES: DetectRule[] = [
    // Frontend
    { name: 'Next.js', category: 'frontend', matchDependencies: ['next'], matchFiles: ['next.config.js', 'next.config.mjs'] },
    { name: 'React', category: 'frontend', matchDependencies: ['react'] },
    { name: 'Vue', category: 'frontend', matchDependencies: ['vue'] },
    { name: 'Svelte', category: 'frontend', matchDependencies: ['svelte'] },
    { name: 'Angular', category: 'frontend', matchDependencies: ['@angular/core'] },
    { name: 'TailwindCSS', category: 'frontend', matchDependencies: ['tailwindcss'], matchFiles: ['tailwind.config.js', 'tailwind.config.ts'] },
    { name: 'Framer Motion', category: 'frontend', matchDependencies: ['framer-motion'] },

    // Backend
    { name: 'Express', category: 'backend', matchDependencies: ['express'] },
    { name: 'NestJS', category: 'backend', matchDependencies: ['@nestjs/core'] },
    { name: 'Django', category: 'backend', matchDependencies: ['Django', 'django'] },
    { name: 'FastAPI', category: 'backend', matchDependencies: ['fastapi'] },
    { name: 'Flask', category: 'backend', matchDependencies: ['Flask', 'flask'] },
    { name: 'Spring Boot', category: 'backend', matchFiles: ['pom.xml', 'build.gradle'] },

    // Database & ORM
    { name: 'Prisma', category: 'database', matchDependencies: ['prisma', '@prisma/client'], matchFiles: ['prisma/schema.prisma'] },
    { name: 'Drizzle', category: 'database', matchDependencies: ['drizzle-orm'] },
    { name: 'Mongoose', category: 'database', matchDependencies: ['mongoose'] },
    { name: 'TypeORM', category: 'database', matchDependencies: ['typeorm'] },
    { name: 'PostgreSQL', category: 'database', matchDependencies: ['pg'] },
    { name: 'Redis', category: 'database', matchDependencies: ['redis', 'ioredis', '@upstash/redis'] },

    // Infrastructure
    { name: 'Docker', category: 'infrastructure', matchFiles: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml'] },
    { name: 'Vercel', category: 'infrastructure', matchFiles: ['vercel.json'] },
    { name: 'Netlify', category: 'infrastructure', matchFiles: ['netlify.toml'] },
    { name: 'AWS', category: 'infrastructure', matchDependencies: ['aws-sdk', '@aws-sdk/client-s3'] },
    { name: 'GitHub Actions', category: 'infrastructure', matchFiles: ['.github/workflows'] },
    { name: 'Kubernetes', category: 'infrastructure', matchFiles: ['k8s', 'kubernetes'] }, // simplistic

    // DevTools
    { name: 'TypeScript', category: 'devtools', matchDependencies: ['typescript'], matchFiles: ['tsconfig.json'] },
    { name: 'ESLint', category: 'devtools', matchDependencies: ['eslint'], matchFiles: ['.eslintrc.js', '.eslintrc.json'] },
    { name: 'Prettier', category: 'devtools', matchDependencies: ['prettier'], matchFiles: ['.prettierrc'] },
    { name: 'Jest', category: 'devtools', matchDependencies: ['jest'] },
    { name: 'Vitest', category: 'devtools', matchDependencies: ['vitest'] },
];

export function detectStack(repoData: GitHubRepoData, url: string): StackReport {
    const result: Partial<StackReport> = {
        languages: repoData.languages,
        frameworks: [],
        frontend: [],
        backend: [],
        database: [],
        infrastructure: [],
        devtools: [],
        repo: {
            name: repoData.metadata.name,
            owner: repoData.metadata.owner.login,
            url,
            description: repoData.metadata.description,
            stars: repoData.metadata.stargazers_count,
        }
    };

    const allDetected = new Set<string>();
    const depKeys = Object.keys(repoData.dependencies);

    // Quick file path matching
    const hasFileOrFolder = (pattern: string) => {
        return repoData.files.some(f => f.includes(pattern));
    };

    for (const rule of RULES) {
        let matched = false;

        // Check deps
        if (rule.matchDependencies) {
            if (rule.matchDependencies.some(d => depKeys.includes(d))) {
                matched = true;
            }
        }

        // Check files
        if (!matched && rule.matchFiles) {
            if (rule.matchFiles.some(f => hasFileOrFolder(f))) {
                matched = true;
            }
        }

        if (matched && !allDetected.has(rule.name)) {
            allDetected.add(rule.name);
            result[rule.category]!.push(rule.name);

            // Also shove frameworks into a combined array for simplicity if requested
            if (['frontend', 'backend'].includes(rule.category)) {
                result.frameworks!.push(rule.name);
            }
        }
    }

    // Calculate generic complexity based on found tool count


    const report = result as StackReport;
    report.complexityScore = calculateComplexity(report);

    return report;
}
