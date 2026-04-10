<div align="center">

<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />

<br /><br />

# 📰 PDP News

**A production-grade news application with a complete CI/CD pipeline**

[![CI](https://github.com/Dream2140/pdp/actions/workflows/ci.yml/badge.svg)](https://github.com/Dream2140/pdp/actions/workflows/ci.yml)
[![Deploy](https://github.com/Dream2140/pdp/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dream2140/pdp/actions/workflows/deploy.yml)
[![Monitoring](https://github.com/Dream2140/pdp/actions/workflows/monitoring.yml/badge.svg)](https://github.com/Dream2140/pdp/actions/workflows/monitoring.yml)
[![CodeQL](https://github.com/Dream2140/pdp/actions/workflows/codeql.yml/badge.svg)](https://github.com/Dream2140/pdp/actions/workflows/codeql.yml)
[![Release](https://github.com/Dream2140/pdp/actions/workflows/release.yml/badge.svg)](https://github.com/Dream2140/pdp/actions/workflows/release.yml)

[**Live Demo**](https://pdp-news-prod.fly.dev) ·
[**Staging**](https://pdp-news-staging.fly.dev) ·
[**Healthcheck**](https://pdp-news-prod.fly.dev/api/healthcheck) ·
[**Metrics**](https://pdp-news-prod.fly.dev/api/metrics)

</div>

---

## ✨ Features

| Category             | Details                                                          |
| -------------------- | ---------------------------------------------------------------- |
| 🌐 **App**           | Next.js 16 news site with SSR, Tailwind CSS, dynamic routes      |
| 🗄️ **Database**      | PostgreSQL (Neon) + Prisma ORM with migrations & seed            |
| 🧪 **Testing**       | Jest unit tests + Playwright E2E + Lighthouse CI audits          |
| 🔄 **CI/CD**         | GitHub Actions — lint, test, e2e, Docker build, auto-deploy      |
| 🐳 **Docker**        | Multi-stage Dockerfile, docker-compose for local & prod          |
| 🚀 **Deploy**        | Fly.io with staging/production environments + auto-rollback      |
| 📊 **Monitoring**    | Prometheus metrics, Sentry error tracking, Pino logging          |
| 🔔 **Notifications** | Telegram bot for CI/CD status + 15-min production health checks  |
| 🏗️ **IaC**           | Terraform configs + docker-compose.prod.yml                      |
| 🔒 **Security**      | CodeQL SAST scanning, branch protection, Dependabot auto-updates |
| 📦 **Bundle**        | JS bundle size analysis posted as PR comment                     |
| 🏷️ **Automation**    | PR size labels, Release Please with auto-changelog               |

---

## 🏗️ Architecture

```
                         ┌─────────────────┐
                         │   Developer PC  │
                         └────────┬────────┘
                                  │ git push
                                  ▼
┌──────────────────────────────────────────────────────────┐
│                     GitHub Actions                        │
│                                                          │
│  ┌────────┐ ┌──────────┐ ┌───────┐ ┌──────────────────┐ │
│  │  Lint  │ │Test+Covr.│ │  E2E  │ │ Lighthouse/Bundle│ │
│  └───┬────┘ └────┬─────┘ └──┬────┘ └────────┬─────────┘ │
│      └───────────┼──────────┘                │           │
│                  ▼                            │           │
│  ┌──────────────────────┐  ┌───────────────┐ │           │
│  │ Docker Build → GHCR  │  │ CodeQL / SAST │ │           │
│  └──────────┬───────────┘  └───────────────┘ │           │
│             ▼                                │           │
│  ┌──────────────────────┐  ┌──────────────┐  │           │
│  │  Deploy to Fly.io    │  │   Telegram   │  │           │
│  │  + Healthcheck verify│→ │   🟢 / 🔴    │  │           │
│  └──────────────────────┘  └──────────────┘  │           │
│                                              │           │
│  ┌──────────────────────┐  ┌──────────────┐  │           │
│  │ Monitoring (15 min)  │  │ PR Labels    │  │           │
│  │ Playwright on prod   │  │ XS/S/M/L/XL │  │           │
│  └──────────────────────┘  └──────────────┘  │           │
└──────────────────────────────────────────────────────────┘
                                  │
               ┌──────────────────┼──────────────────┐
               ▼                  ▼                   ▼
      ┌────────────┐    ┌────────────────┐   ┌────────────┐
      │  Staging   │    │  Production    │   │  Neon DB   │
      │  Fly.io    │    │  Fly.io        │   │ PostgreSQL │
      └────────────┘    └────────────────┘   └────────────┘
                               │
                     ┌─────────┼─────────┐
                     ▼         ▼         ▼
                📊 Metrics  🐛 Sentry  📝 Pino Logs
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker (optional, for local DB)

### Local Development

```bash
# Clone & install
git clone https://github.com/Dream2140/pdp.git
cd pdp
npm install

# Start PostgreSQL (optional — app works with fallback data)
docker compose up db -d

# Apply migrations & seed
npx prisma migrate deploy
npm run db:seed

# Start dev server
npm run dev
# → http://localhost:3000
```

### Run Tests

```bash
npm test          # Unit tests (Jest)
npm run test:e2e  # E2E tests (Playwright)
npm run lint      # ESLint
npm run format    # Prettier check
```

---

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Home — news list
│   │   ├── news/[id]/page.tsx  # Article page
│   │   └── api/
│   │       ├── healthcheck/    # GET → {status: "ok"}
│   │       ├── metrics/        # GET → Prometheus metrics
│   │       └── sentry-test/    # GET → test error
│   ├── data/news.ts            # Data layer (Prisma + fallback)
│   ├── lib/
│   │   ├── prisma.ts           # DB client singleton
│   │   ├── logger.ts           # Pino structured logging
│   │   └── metrics.ts          # Prometheus counters & histograms
│   └── __tests__/              # Jest unit tests
├── e2e/                        # Playwright E2E tests
├── prisma/
│   ├── schema.prisma           # DB schema
│   ├── migrations/             # SQL migrations
│   └── seed.ts                 # Seed script (6 articles)
├── terraform/                  # Fly.io IaC
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Lint → Test (coverage) → E2E → Docker
│   │   ├── deploy.yml          # Fly.io staging/prod + rollback + Telegram
│   │   ├── monitoring.yml      # Playwright E2E on prod every 15 min
│   │   ├── lighthouse.yml      # Performance/A11y/SEO audit on PR
│   │   ├── codeql.yml          # Security scanning (SAST)
│   │   ├── bundle-analysis.yml # JS bundle size report on PR
│   │   ├── pr-size.yml         # Auto XS/S/M/L/XL labels
│   │   ├── release.yml         # Release Please (auto changelog)
│   │   ├── notify.yml          # Telegram CI notifications
│   │   └── dependabot-automerge.yml
│   └── dependabot.yml          # Weekly dependency updates
├── Dockerfile                  # Multi-stage production build
├── docker-compose.yml          # Local: app + PostgreSQL
└── docker-compose.prod.yml     # Production: GHCR image + DB
```

---

## 🔄 CI/CD Pipeline

### Branch Strategy

```
feature/* ──PR──→ develop (staging) ──PR──→ main (production)
```

Both `main` and `develop` are protected — direct push is blocked, CI must pass.

### Workflow Overview

| Workflow            | Trigger              | What it does                                         |
| ------------------- | -------------------- | ---------------------------------------------------- |
| **CI**              | Push / PR            | Lint, test + coverage, E2E, Docker build + GHCR push |
| **Deploy**          | Push to main/develop | Deploy Fly.io + healthcheck verify + Telegram        |
| **Monitoring**      | Every 15 min         | Playwright E2E on production → Telegram report       |
| **Lighthouse**      | PR                   | Performance, A11y, SEO audit → PR comment            |
| **CodeQL**          | Push / PR / Weekly   | Security scanning (XSS, injection, etc.)             |
| **Bundle Analysis** | PR                   | JS bundle size report → PR comment                   |
| **PR Size**         | PR                   | Auto-label XS / S / M / L / XL                       |
| **Release Please**  | Push to main         | Auto-create release PR with changelog                |
| **Dependabot**      | Weekly (Mon)         | Auto-update deps, auto-merge patch/minor             |

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

### Frontend

- ⚡ Next.js 16
- ⚛️ React 18
- 🎨 Tailwind CSS 3
- 📝 TypeScript 5

</td>
<td>

### Backend

- 🗄️ PostgreSQL 16 (Neon)
- 🔷 Prisma ORM
- 📊 Prometheus
- 📝 Pino Logger

</td>
<td>

### DevOps

- 🐳 Docker
- ✈️ Fly.io
- 🔄 GitHub Actions
- 🏗️ Terraform

</td>
<td>

### Quality & Security

- 🧪 Jest + Playwright
- 🔍 ESLint 9 + Prettier
- 🚦 Lighthouse CI
- 🐛 Sentry
- 🛡️ CodeQL SAST
- 📦 Bundle Analyzer

</td>
</tr>
</table>

---

## 📊 Monitoring & Observability

| Tool             | Purpose                           | Endpoint                                                            |
| ---------------- | --------------------------------- | ------------------------------------------------------------------- |
| **Prometheus**   | Metrics (CPU, memory, HTTP stats) | [`/api/metrics`](https://pdp-news-prod.fly.dev/api/metrics)         |
| **Sentry**       | Error tracking & alerting         | [`/api/sentry-test`](https://pdp-news-prod.fly.dev/api/sentry-test) |
| **Pino**         | Structured JSON logging           | Server logs                                                         |
| **Healthcheck**  | Uptime monitoring                 | [`/api/healthcheck`](https://pdp-news-prod.fly.dev/api/healthcheck) |
| **Telegram Bot** | CI/CD & monitoring alerts         | Every 15 min + on deploy                                            |

---

## 🐳 Docker

```bash
# Local development (app + PostgreSQL)
docker compose up

# Production (pulls from GHCR)
POSTGRES_PASSWORD=secret docker compose -f docker-compose.prod.yml up -d
```

---

## 🏗️ Infrastructure as Code

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars  # fill in values
terraform init
terraform plan
terraform apply
```

---

## 📜 Available Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start development server       |
| `npm run build`      | Production build               |
| `npm start`          | Start production server        |
| `npm test`           | Run Jest unit tests            |
| `npm run test:e2e`   | Run Playwright E2E tests       |
| `npm run lint`       | ESLint check                   |
| `npm run format`     | Prettier check                 |
| `npm run format:fix` | Prettier auto-fix              |
| `npm run db:migrate` | Apply Prisma migrations        |
| `npm run db:seed`    | Seed database with sample data |

---

## 🔐 Environment Variables

| Variable             | Required | Description                  |
| -------------------- | -------- | ---------------------------- |
| `DATABASE_URL`       | No\*     | PostgreSQL connection string |
| `SENTRY_DSN`         | No       | Sentry error tracking DSN    |
| `FLY_API_TOKEN`      | CI only  | Fly.io deploy token          |
| `TELEGRAM_BOT_TOKEN` | CI only  | Telegram bot token           |
| `TELEGRAM_CHAT_ID`   | CI only  | Telegram chat ID             |

\* App works without database using fallback data

---

<div align="center">

**Built with** ❤️ **as a PDP (Personal Development Plan) project**

<sub>Demonstrates a complete CI/CD pipeline from code to production</sub>

</div>
