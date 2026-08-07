import { DetectRule, StackReport } from './types';
import { GitHubRepoData } from './vcs';
import { calculateComplexity } from './complexity';
import { buildIntelligence } from './intelligence';

const RULES: DetectRule[] = [
    // ─── Frontend ─────────────────────────────────────────────────────────────
    { name: 'Next.js', category: 'frontend', matchDependencies: ['next'], matchFiles: ['next.config.js', 'next.config.mjs', 'next.config.ts'] },
    { name: 'React', category: 'frontend', matchDependencies: ['react'] },
    { name: 'Vue', category: 'frontend', matchDependencies: ['vue', '@vue/core'] },
    { name: 'Nuxt', category: 'frontend', matchDependencies: ['nuxt'] },
    { name: 'Svelte', category: 'frontend', matchDependencies: ['svelte'] },
    { name: 'SvelteKit', category: 'frontend', matchDependencies: ['@sveltejs/kit'] },
    { name: 'Angular', category: 'frontend', matchDependencies: ['@angular/core'] },
    { name: 'Solid.js', category: 'frontend', matchDependencies: ['solid-js'] },
    { name: 'Qwik', category: 'frontend', matchDependencies: ['@builder.io/qwik'] },
    { name: 'Remix', category: 'frontend', matchDependencies: ['@remix-run/react'] },
    { name: 'Astro', category: 'frontend', matchDependencies: ['astro'], matchFiles: ['astro.config.mjs', 'astro.config.ts'] },
    { name: 'TailwindCSS', category: 'frontend', matchDependencies: ['tailwindcss'], matchFiles: ['tailwind.config.js', 'tailwind.config.ts'] },
    { name: 'Framer Motion', category: 'frontend', matchDependencies: ['framer-motion'] },
    { name: 'Radix UI', category: 'frontend', matchDependencies: ['@radix-ui/react-dialog'] },
    { name: 'shadcn/ui', category: 'frontend', matchFiles: ['components/ui', 'src/components/ui'] },
    { name: 'Three.js', category: 'frontend', matchDependencies: ['three', '@react-three/fiber'] },
    { name: 'D3.js', category: 'frontend', matchDependencies: ['d3'] },

    // ─── Backend (Node / Bun / Deno) ──────────────────────────────────────────
    { name: 'Express', category: 'backend', matchDependencies: ['express'] },
    { name: 'Fastify', category: 'backend', matchDependencies: ['fastify'] },
    { name: 'NestJS', category: 'backend', matchDependencies: ['@nestjs/core'] },
    { name: 'Hono', category: 'backend', matchDependencies: ['hono'] },
    { name: 'tRPC', category: 'backend', matchDependencies: ['@trpc/server'] },
    { name: 'GraphQL', category: 'backend', matchDependencies: ['graphql', '@apollo/server', 'apollo-server'] },

    // ─── Python Backend ────────────────────────────────────────────────────────
    { name: 'Django', category: 'backend', matchDependencies: ['django', 'Django'] },
    { name: 'FastAPI', category: 'backend', matchDependencies: ['fastapi'] },
    { name: 'Flask', category: 'backend', matchDependencies: ['flask', 'Flask'] },
    { name: 'Celery', category: 'backend', matchDependencies: ['celery'] },
    { name: 'Starlette', category: 'backend', matchDependencies: ['starlette'] },
    { name: 'Pydantic', category: 'backend', matchDependencies: ['pydantic'] },
    { name: 'SQLAlchemy', category: 'backend', matchDependencies: ['sqlalchemy', 'SQLAlchemy'] },

    // ─── Java / Kotlin ─────────────────────────────────────────────────────────
    { name: 'Spring Boot', category: 'backend', matchDependencies: ['spring-boot'], matchFiles: ['pom.xml', 'build.gradle', 'build.gradle.kts'] },
    { name: 'Quarkus', category: 'backend', matchFiles: ['quarkus'] },
    { name: 'Micronaut', category: 'backend', matchFiles: ['micronaut.yml', 'application.properties'] },

    // ─── .NET ──────────────────────────────────────────────────────────────────
    { name: 'ASP.NET Core', category: 'backend', matchFiles: ['.csproj', '.sln', 'Program.cs', 'Startup.cs'] },
    { name: 'Entity Framework', category: 'database', matchFiles: ['Migrations/', 'DbContext'] },
    { name: 'Blazor', category: 'frontend', matchFiles: ['.razor'] },

    // ─── Rust ──────────────────────────────────────────────────────────────────
    { name: 'Axum', category: 'backend', matchDependencies: ['axum'] },
    { name: 'Actix', category: 'backend', matchDependencies: ['actix-web'] },
    { name: 'Tokio', category: 'devtools', matchDependencies: ['tokio'] },
    { name: 'Serde', category: 'devtools', matchDependencies: ['serde'] },
    { name: 'Diesel', category: 'database', matchDependencies: ['diesel'] },
    { name: 'SeaORM', category: 'database', matchDependencies: ['sea-orm'] },

    // ─── Go ────────────────────────────────────────────────────────────────────
    { name: 'Gin', category: 'backend', matchDependencies: ['github.com/gin-gonic/gin'] },
    { name: 'Echo', category: 'backend', matchDependencies: ['github.com/labstack/echo'] },
    { name: 'Chi', category: 'backend', matchDependencies: ['github.com/go-chi/chi'] },
    { name: 'Fiber', category: 'backend', matchDependencies: ['github.com/gofiber/fiber'] },
    { name: 'GORM', category: 'database', matchDependencies: ['gorm.io/gorm'] },

    // ─── Database & ORM ────────────────────────────────────────────────────────
    { name: 'Prisma', category: 'database', matchDependencies: ['prisma', '@prisma/client'], matchFiles: ['prisma/schema.prisma'] },
    { name: 'Drizzle', category: 'database', matchDependencies: ['drizzle-orm'] },
    { name: 'Mongoose', category: 'database', matchDependencies: ['mongoose'] },
    { name: 'TypeORM', category: 'database', matchDependencies: ['typeorm'] },
    { name: 'PostgreSQL', category: 'database', matchDependencies: ['pg', 'postgres'] },
    { name: 'MySQL', category: 'database', matchDependencies: ['mysql2', 'mysql'] },
    { name: 'SQLite', category: 'database', matchDependencies: ['sqlite3', 'better-sqlite3', 'bun:sqlite'] },
    { name: 'MongoDB', category: 'database', matchDependencies: ['mongodb'] },
    { name: 'Redis', category: 'database', matchDependencies: ['redis', 'ioredis', '@upstash/redis'] },
    { name: 'Supabase', category: 'database', matchDependencies: ['@supabase/supabase-js'] },
    { name: 'PlanetScale', category: 'database', matchDependencies: ['@planetscale/database'] },
    { name: 'Neon', category: 'database', matchDependencies: ['@neondatabase/serverless'] },
    { name: 'Turso', category: 'database', matchDependencies: ['@libsql/client'] },
    { name: 'ClickHouse', category: 'database', matchDependencies: ['@clickhouse/client'] },

    // ─── Infrastructure ────────────────────────────────────────────────────────
    { name: 'Docker', category: 'infrastructure', matchFiles: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml', '.dockerignore'] },
    { name: 'Kubernetes', category: 'infrastructure', matchFiles: ['k8s/', 'kubernetes/', 'Chart.yaml', 'values.yaml'] },
    { name: 'Helm', category: 'infrastructure', matchFiles: ['Chart.yaml', 'helm/'] },
    { name: 'Terraform', category: 'infrastructure', matchFiles: ['.tf', 'terraform/', 'main.tf', 'variables.tf'] },
    { name: 'Pulumi', category: 'infrastructure', matchFiles: ['Pulumi.yaml', 'pulumi/'] },
    { name: 'Ansible', category: 'infrastructure', matchFiles: ['playbook.yml', 'ansible/'] },
    { name: 'GitHub Actions', category: 'infrastructure', matchFiles: ['.github/workflows'] },
    { name: 'GitLab CI', category: 'infrastructure', matchFiles: ['.gitlab-ci.yml'] },
    { name: 'CircleCI', category: 'infrastructure', matchFiles: ['.circleci/config.yml'] },
    { name: 'Vercel', category: 'infrastructure', matchFiles: ['vercel.json'] },
    { name: 'Netlify', category: 'infrastructure', matchFiles: ['netlify.toml'] },
    { name: 'Railway', category: 'infrastructure', matchFiles: ['railway.json', 'railway.toml'] },
    { name: 'AWS', category: 'infrastructure', matchDependencies: ['aws-sdk', '@aws-sdk/client-s3', 'aws-cdk-lib'] },
    { name: 'GCP', category: 'infrastructure', matchDependencies: ['@google-cloud/storage'] },
    { name: 'Azure', category: 'infrastructure', matchDependencies: ['@azure/storage-blob'] },
    { name: 'Cloudflare Workers', category: 'infrastructure', matchDependencies: ['@cloudflare/workers-types'], matchFiles: ['wrangler.toml'] },

    // ─── ML / AI ───────────────────────────────────────────────────────────────
    { name: 'OpenAI', category: 'backend', matchDependencies: ['openai', '@openai/api'] },
    { name: 'Langchain', category: 'backend', matchDependencies: ['langchain', '@langchain/core'] },
    { name: 'TensorFlow.js', category: 'backend', matchDependencies: ['@tensorflow/tfjs'] },
    { name: 'Hugging Face', category: 'backend', matchDependencies: ['@huggingface/inference'] },

    // ─── DevTools ─────────────────────────────────────────────────────────────
    { name: 'TypeScript', category: 'devtools', matchDependencies: ['typescript'], matchFiles: ['tsconfig.json'] },
    { name: 'ESLint', category: 'devtools', matchDependencies: ['eslint'], matchFiles: ['.eslintrc.js', '.eslintrc.json', 'eslint.config.js'] },
    { name: 'Prettier', category: 'devtools', matchDependencies: ['prettier'], matchFiles: ['.prettierrc'] },
    { name: 'Jest', category: 'devtools', matchDependencies: ['jest'] },
    { name: 'Vitest', category: 'devtools', matchDependencies: ['vitest'] },
    { name: 'Playwright', category: 'devtools', matchDependencies: ['@playwright/test'] },
    { name: 'Cypress', category: 'devtools', matchDependencies: ['cypress'] },
    { name: 'Storybook', category: 'devtools', matchDependencies: ['@storybook/react', 'storybook'], matchFiles: ['.storybook/'] },
    { name: 'Vite', category: 'devtools', matchDependencies: ['vite'], matchFiles: ['vite.config.ts', 'vite.config.js'] },
    { name: 'Webpack', category: 'devtools', matchDependencies: ['webpack'] },
    { name: 'Turborepo', category: 'devtools', matchDependencies: ['turbo'], matchFiles: ['turbo.json'] },
    { name: 'Nx', category: 'devtools', matchDependencies: ['nx'] },
    { name: 'Biome', category: 'devtools', matchDependencies: ['@biomejs/biome'], matchFiles: ['biome.json'] },
    { name: 'Husky', category: 'devtools', matchDependencies: ['husky'] },
    { name: 'Changesets', category: 'devtools', matchDependencies: ['@changesets/cli'] },
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
    const depKeys = Object.keys(repoData.dependencies).map((k) => k.toLowerCase());
    const lowerFiles = repoData.files.map((f) => f.toLowerCase());

    const hasFile = (pattern: string) => lowerFiles.some((f) => f.includes(pattern.toLowerCase()));
    const hasDep = (dep: string) => depKeys.includes(dep.toLowerCase()) || depKeys.some((d) => d.startsWith(dep.toLowerCase()));

    for (const rule of RULES) {
        let matched = false;

        if (rule.matchDependencies) {
            if (rule.matchDependencies.some((d) => hasDep(d))) matched = true;
        }

        if (!matched && rule.matchFiles) {
            if (rule.matchFiles.some((f) => hasFile(f))) matched = true;
        }

        if (matched && !allDetected.has(rule.name)) {
            allDetected.add(rule.name);
            result[rule.category]!.push(rule.name);

            if (['frontend', 'backend'].includes(rule.category)) {
                result.frameworks!.push(rule.name);
            }
        }
    }

    const report = result as StackReport;
    report.complexityScore = calculateComplexity(report);
    Object.assign(report, buildIntelligence(report, repoData));

    return report;
}
