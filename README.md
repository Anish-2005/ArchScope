<div align="center">

<br />

```
 █████╗ ██████╗  ██████╗██╗  ██╗███████╗ ██████╗ ██████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝██║  ██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
███████║██████╔╝██║     ███████║███████╗██║     ██║   ██║██████╔╝█████╗  
██╔══██║██╔══██╗██║     ██╔══██║╚════██║██║     ██║   ██║██╔═══╝ ██╔══╝  
██║  ██║██║  ██║╚██████╗██║  ██║███████║╚██████╗╚██████╔╝██║     ███████╗
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚══════╝
```

### **Enterprise Engineering Intelligence Platform**

*Deep-scan any GitHub · GitLab · Bitbucket repository and receive a complete architectural intelligence report — technology stack fingerprinting, health scoring, risk analysis, CI/CD policy enforcement, and executive PDF briefs. All in seconds.*

<br />

![Build](https://img.shields.io/badge/build-passing-22d3ee?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Upstash](https://img.shields.io/badge/Upstash_Redis-green?style=for-the-badge&logo=redis&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)

<br />

</div>

---

## ⚡ What is ArchScope?

**ArchScope** is a full-stack engineering intelligence platform that performs deep static analysis on any public or private source code repository. It fingerprints the entire technology stack, scores engineering health and delivery risk, detects policy violations, and generates executive-grade architecture reports — all in a single API call or CLI command.

It is not a linter. It is not a SAST tool. It is a **strategic architecture intelligence layer** designed for engineering leaders, platform teams, and enterprise governance workflows.

```
  Repository URL
       │
       ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                      VCS ADAPTER LAYER                             │
  │     GitHub (public + private)  │  GitLab  │  Bitbucket             │
  └────────────────────┬────────────────────────────────────────────────┘
                       │  files · dependencies · source samples
                       ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                  STACK DETECTION ENGINE  (80+ rules)               │
  │   Languages · Frameworks · Databases · Infra · DevTools · ML/AI    │
  └────────────────────┬────────────────────────────────────────────────┘
                       │
                       ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │           INTELLIGENCE & SCORING  (Complexity · Health · Risk)     │
  │         Architecture Graph  │  Findings  │  Recommendations        │
  └────────────────────┬────────────────────────────────────────────────┘
                       │
          ┌────────────┴─────────────────┐
          ▼                              ▼
  ┌───────────────┐            ┌─────────────────────┐
  │ ReportCard UI │            │ JSON · CSV · PDF API │
  │  Heatmap      │            │  CI Gate  │  Webhook │
  │  Trendline    │            │  PR Bot   │  CLI     │
  │  Arch Graph   │            └─────────────────────┘
  └───────────────┘
```

---

## ✨ Feature Highlights

### 🔬 Stack Detection Engine
> **80+ detection rules** across 10 technology domains

| Domain | Examples |
|---|---|
| **Frontend** | Next.js, React, Vue, Svelte, Angular, Astro, Remix, Qwik, Solid.js, Three.js |
| **Backend (Node)** | Express, Fastify, NestJS, Hono, tRPC, GraphQL, Apollo |
| **Backend (Python)** | FastAPI, Django, Flask, Celery, Starlette, Pydantic, SQLAlchemy |
| **Backend (Java)** | Spring Boot, Quarkus, Micronaut |
| **Backend (.NET)** | ASP.NET Core, Blazor, Entity Framework |
| **Backend (Rust)** | Axum, Actix-Web, Diesel, SeaORM, Tokio |
| **Backend (Go)** | Gin, Echo, Chi, Fiber, GORM |
| **Database** | Prisma, Drizzle, TypeORM, Mongoose, PostgreSQL, MySQL, Redis, MongoDB, Supabase, Neon, PlanetScale, Turso, ClickHouse |
| **Infrastructure** | Docker, Kubernetes, Helm, Terraform, Pulumi, Ansible, GitHub Actions, GitLab CI, CircleCI, Vercel, Netlify, AWS, GCP, Azure, Cloudflare Workers |
| **AI / ML** | OpenAI, Langchain, TensorFlow.js, Hugging Face |
| **DevTools** | TypeScript, ESLint, Vitest, Playwright, Storybook, Vite, Turborepo, Nx, Biome |

---

### 📊 Intelligence & Scoring

Every scan produces a structured intelligence report with:

```typescript
interface StackReport {
  healthScore: number;          // 0-100 composite engineering health
  complexityScore: number;      // 0-100 operational complexity load
  mlReadiness: number;          // 0-100 AI/data pipeline readiness
  deliveryRisk: 'low' | 'medium' | 'high';
  
  signals: {
    fileCount: number;
    dependencyCount: number;
    workflowCount: number;
    testSignals: number;
    dockerSignals: number;
    secretScanSignals: number;
  };
  
  findings: Finding[];           // Risk findings with severity levels
  recommendations: Recommendation[];  // Prioritised action items: now / next / later
  architectureGraph: {
    nodes: ArchNode[];           // Component topology map
    edges: ArchEdge[];           // Inferred dependency edges
  };
}
```

---

### 🗺️ Visual Architecture Maps

Three interactive, real-time visualization components are embedded directly in every report:

| Component | Description |
|---|---|
| **`DependencyGraph.tsx`** | SVG force-directed graph simulating physics layout across architecture layers (application, service, data, delivery, ML). Filter by layer kind. |
| **`TechDebtHeatmap.tsx`** | 5×5 grid matrix of findings severity × domain category. Hover any cell for detailed violation list. |
| **`RiskTrendline.tsx`** | Animated multi-line sparkline chart plotting health score and complexity score history across scans. |

---

### 🛡️ Enterprise Workspaces & RBAC

```
Organization Namespace
└── archscope:org:{org}:*
    ├── members/           → userId · role (owner/admin/member/viewer)
    ├── scans/             → scan records keyed by repo + timestamp
    ├── policy             → CI/CD budgets (maxDependencies, maxComplexity, requireCi)
    ├── baseline           → Saved snapshot for drift comparison
    └── webhooks/          → Received event log
```

- **HMAC Session Tokens**: Stateless cookie-based sessions signed with `AUTH_SECRET`.
- **Role-Based Access**: 4 role levels — `owner`, `admin`, `member`, `viewer`.
- **Sliding-Window Rate Limiting**: Per-org request budgets (10 scans/minute by default).
- **Memory Fallback Store**: Full local dev operation without a Redis connection.

---

### ⚙️ CI/CD Integration

#### GitHub PR Bot
Automatically triggered via webhook on `pull_request.opened` / `synchronized` events:

```markdown
## ✅ ArchScope Architecture Analysis

**Repository:** `acme/backend` | **Delivery Risk:** 🟢 LOW

| Metric | Score |
|--------|-------|
| 🏥 Health Score   | **91/100** |
| 🔧 Complexity     | **34/100** |
| 🚨 Critical Issues| **0**      |

### Policy Evaluation
- ✅ CI workflow detected
- ✅ Test coverage baseline confirmed
- ✅ Dependency count within budget

📊 [View Full Architecture Report](https://archscope.dev/report/acme/backend)
```

#### CLI Tool
```bash
# Install globally
npm install -g archscope-cli

# Run a policy scan (exits 1 on violation)
archscope scan github.com/vercel/next.js

# Output full JSON analysis report
archscope report github.com/facebook/react

# Configure workspace
export ARCHSCOPE_ORG=acme-corp
export ARCHSCOPE_TOKEN=at_xxxxx
```

#### GitHub Actions
```yaml
name: Architecture Policy Check
on:
  pull_request:
    branches: [ main ]
jobs:
  archscope:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: ArchScope Policy Gate
        run: npx archscope-cli scan ${{ github.repository }}
        env:
          ARCHSCOPE_TOKEN: ${{ secrets.ARCHSCOPE_TOKEN }}
          ARCHSCOPE_ORG: "acme-corp"
```

---

### 📄 Executive Reporting

- **PDF Executive Brief**: Generated client-side with `jsPDF` — includes repo metadata, KPI dial summary, risk findings, and a prioritized action roadmap.
- **CSV Export**: Full data table covering languages, frameworks, dependencies, findings, and recommendations.
- **JSON Export**: Full raw report blob for downstream pipeline consumption.
- **Portfolio Dashboard** (`/executive`): Aggregate health index, compliance rate, remediation tracking, and governance matrix across all scanned repositories.

---

## 🏗️ Project Architecture

```
archscope/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── scan/          → Core VCS fetch + detection + cache
│   │   │   ├── ci/            → Policy gate endpoint for CI systems
│   │   │   ├── auth/          → HMAC session login/logout
│   │   │   ├── orgs/          → Organization CRUD and member management
│   │   │   ├── policy/        → Policy budget read/write per org
│   │   │   ├── queue/         → Async scan job queue + background worker
│   │   │   ├── reports/       → Scan history and trend data
│   │   │   ├── export/        → CSV/JSON server-side export
│   │   │   ├── sbom/          → Software Bill of Materials generation
│   │   │   └── webhooks/
│   │   │       ├── github/    → PR bot webhook handler (HMAC verified)
│   │   │       └── drift/     → Arch drift detector + Linear integration
│   │   ├── executive/         → Portfolio Risk Dashboard
│   │   ├── governance/        → Policy budget editor UI
│   │   ├── portfolio/         → Repository portfolio view
│   │   ├── docs/cli/          → CLI & GitHub Actions documentation
│   │   └── report/[owner]/[repo]/  → Dynamic report page
│   │
│   ├── components/
│   │   ├── ReportCard.tsx     → Full enterprise report visualizer
│   │   ├── ScanForm.tsx       → Multi-VCS scan input with real-time status
│   │   ├── DependencyGraph.tsx → SVG force-directed topology graph
│   │   ├── TechDebtHeatmap.tsx → Severity × domain debt heatmap
│   │   ├── RiskTrendline.tsx  → Animated historical drift sparkline
│   │   ├── Navbar.tsx         → Global navigation with scroll effects
│   │   ├── Logo.tsx           → SVG brand mark
│   │   └── AnimatedBackground.tsx → Dynamic ambient particle system
│   │
│   └── lib/
│       ├── vcs.ts             → Unified GitHub/GitLab/Bitbucket adapter
│       ├── detector.ts        → 80+ rule stack detection engine
│       ├── intelligence.ts    → Health scoring & findings generator
│       ├── complexity.ts      → Complexity calculation model
│       ├── auth.ts            → HMAC session management
│       ├── redis.ts           → Upstash Redis store + memory fallback
│       ├── observability.ts   → Structured JSON logging + metrics
│       ├── export.ts          → PDF (jsPDF) + CSV export generators
│       └── types.ts           → Core TypeScript type definitions
│
└── cli/
    ├── index.mjs              → archscope CLI binary
    └── package.json           → npm package manifest (bin: archscope)
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/archscope.git
cd archscope
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

```env
# Required for production caching — leave blank for in-memory fallback during dev
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# Required for private repo scanning and PR bot webhooks
GITHUB_TOKEN=ghp_xxx
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Required for production auth integrity
AUTH_SECRET=your_super_secret_key

# Optional: GitLab & Bitbucket private repository access
GITLAB_TOKEN=glpat-xxx
BITBUCKET_TOKEN=xxx

# Optional: Linear issue creation on architecture drift
LINEAR_API_KEY=lin_api_xxx
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production Build

```bash
npm run build   # Verified: exit code 0  ✓
npm run start
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scan` | Run full analysis on a repository URL |
| `POST` | `/api/ci` | Policy gate evaluation (used by CLI & GitHub Actions) |
| `GET`  | `/api/reports/history` | Fetch scan history for a repo |
| `POST` | `/api/auth` | Create HMAC session (login) |
| `GET`  | `/api/auth` | Validate current session |
| `GET`  | `/api/orgs` | List organizations |
| `POST` | `/api/orgs` | Create a new organization workspace |
| `GET/PUT` | `/api/policy` | Read/update org policy budgets |
| `POST` | `/api/queue` | Enqueue an async background scan job |
| `GET`  | `/api/queue` | Poll job status by `jobId` |
| `GET`  | `/api/export` | Download CSV/JSON report by scan ID |
| `GET`  | `/api/sbom` | Generate Software Bill of Materials |
| `POST` | `/api/webhooks/github` | GitHub webhook receiver (PR bot) |
| `POST` | `/api/webhooks/drift` | Architecture drift evaluation + alerting |

---

## 🧪 Supported Repository Types

| Type | Support |
|------|---------|
| GitHub Public | ✅ Full |
| GitHub Private | ✅ Token Auth |
| GitLab.com | ✅ Full |
| GitLab Private | ✅ `PRIVATE-TOKEN` Auth |
| Bitbucket Cloud | ✅ Full |
| Monorepos | ✅ Sub-manifest scanning (`packages/`, `apps/`, `services/`) |
| Docker/Kubernetes | ✅ Detected via `Dockerfile`, `Chart.yaml`, `k8s/` |
| Terraform/Pulumi | ✅ Detected via `.tf`, `Pulumi.yaml` |
| Python (`requirements.txt`, `pyproject.toml`, `Pipfile`) | ✅ Full |
| Go (`go.mod`) | ✅ Full |
| Rust (`Cargo.toml`) | ✅ Full |
| Java/Kotlin (`pom.xml`, `build.gradle`) | ✅ Full |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router · Turbopack) |
| **Runtime** | React 19 · Node.js 20 |
| **Language** | TypeScript 5 (strict) |
| **Styling** | TailwindCSS 4 · Lightning CSS |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Persistence** | Upstash Redis (with in-memory fallback) |
| **PDF Generation** | jsPDF 4 |
| **Observability** | OpenTelemetry · Sentry |
| **CI/CD** | GitHub Actions · Custom CLI |

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">

Built with precision for engineering leaders, platform teams, and architecture governance.

**[Live Demo](https://archscope.dev)** · **[Docs](https://archscope.dev/docs)** · **[Executive Dashboard](https://archscope.dev/executive)**

<br />

*ArchScope — Know your stack. Govern your architecture.*

</div>
