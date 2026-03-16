<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="ArchScope Logo">
</p>

# ▲ ArchScope Engine

[![MIT License](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-red?logo=redis)](https://upstash.com/)

**ArchScope** is an elite architectural intelligence engine designed to convert complex repository signals into executive-ready narratives. It standardizes how platform teams and senior leadership evaluate technical debt, technology fragmentation, and operational risks.

---

## ✨ Features

- 🔍 **Deep Stack Detection**: Recursive heuristics to identify primary and secondary technologies.
- 📊 **Architecture Index**: A unified complexity score (0-100) based on cognitive overhead and dependency weight.
- 🛡️ **Risk Assessment**: Identify high-risk patterns and unmaintained infrastructure layers.
- 🚀 **CLI First**: Powerful command-line interface for CI/CD integration.
- 💎 **Premium UI**: Modern, glassmorphic dashboard for visual report exploration.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Framer Motion |
| **Styling** | Tailwind CSS (Glassmorphism design system) |
| **Runtime** | Node.js / TypeScript |
| **Database** | Redis (via Upstash) for report caching |
| **Analytics** | Custom Structural Heuristics Engine |

---

## 💻 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Anish-2005/ArchScope.git
cd ArchScope
npm install
```

### 2. Environment Setup

Create a `.env.local` file with your credentials:

```env
GITHUB_TOKEN=your_github_pat
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the ArchScope Dashboard.

---

## ⌨️ CLI Usage

ArchScope includes a dedicated CLI for tactical scans.

```bash
# Analyze a repository directly from your terminal
npx archscope scan facebook/react --output text
```

---

## 🗺️ Roadmap & Future Plans

-   [ ] **Chrome Extension**: We are building a browser extension that integrates directly into `github.com`. Preview architectural scores and tech stacks while browsing repositories.
-   [ ] **Dependency Graphing**: Interactive 3D visualization of repository internals.
-   [ ] **Drift Detection**: Automated PR comments when architectural standards are violated.
-   [ ] **Multi-provider Support**: Expanding heuristics to GitLab and Bitbucket.

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the ArchScope Team<br>
  <i>Standardizing Architecture Intelligence for the Modern Web</i>
</p>
