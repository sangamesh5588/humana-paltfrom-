# 🌐 Human Platform — AI-Driven Professional Collaboration Ecosystem

[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build)
[![React Native](https://img.shields.io/badge/Mobile-React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Container-Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)

> **Human Platform** is an enterprise-scale, AI-driven professional collaboration monorepo engineered with **Turborepo** and **pnpm**. It seamlessly coordinates cross-platform mobile apps (**React Native** for Android & iOS), modular web portals, and microservice backends (**NestJS + Prisma**).

---

## 🏗️ Monorepo Architecture

```
human-platform/
├── apps/                         # Client Applications
│   ├── mobile/                   # React Native App (iOS & Android)
│   ├── website/                  # Marketing & Landing Platform
│   ├── admin/                    # Internal Admin Console
│   ├── expert-portal/            # Expert Workspace
│   ├── organization-portal/      # Corporate Management Console
│   └── docs-site/                # Developer Documentation
│
├── services/                     # Backend Microservices
│   ├── api/                      # Main NestJS Core API
│   ├── ai/                       # Autonomous AI Agents & Pipelines
│   ├── notification/             # Transactional Push / SMS / Email
│   ├── scheduler/                # Distributed Cron Orchestration
│   ├── worker/                   # Asynchronous Job & Queue Workers
│   ├── search/                   # Full-Text Search & Indexing Engine
│   └── realtime/                 # WebSocket Real-Time Gateway
│
├── packages/                     # Shared Monorepo Packages
│   ├── ui/                       # Design System & Component Library
│   ├── types/                    # Shared Domain TypeScript Contracts
│   ├── api-client/               # Type-Safe HTTP SDK (Axios)
│   ├── validation/               # Zod Schema Enforcers
│   ├── constants/                # Global Application Constants
│   ├── config/                   # Shared tsconfig & ESLint bases
│   ├── utils/                    # Shared Helper Functions
│   ├── hooks/                    # Reusable React & React Native Hooks
│   └── theme/                    # Design Tokens & Styling Primitives
│
├── database/                     # Data Persistence & ORM
│   ├── prisma/                   # Schema, Migrations & Seeds
│   ├── erd/                      # Entity Relationship Diagrams
│   └── sql/                      # Custom SQL Functions
│
├── infrastructure/               # Docker, Compose & Deployment Configs
├── docs/                         # Architecture RFCs & Standards
└── .github/                      # CI/CD Workflows & Issue Templates
```

---

## 📱 Mobile Architecture (`apps/mobile`)

The mobile client is built on **React Native** supporting both **iOS and Android**:
- **Navigation:** `@react-navigation/native-stack` & `@react-navigation/bottom-tabs`
- **Animations:** Hardware-accelerated 60fps micro-interactions with `react-native-reanimated` (v3) & `react-native-gesture-handler`
- **State Management:** Reactive global state with `zustand` (v5)
- **Validation:** Type-safe runtime schemas with `zod`
- **Authentication:** Native Google Sign-In (`@react-native-google-signin/google-signin`)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

### 3. Start Database (Docker)
```bash
docker compose up -d postgres
```

### 4. Run Prisma Migrations
```bash
pnpm run prisma:generate
pnpm run prisma:migrate:dev
```

### 5. Launch Development Workspaces
```bash
pnpm run dev
```

---

## 📜 Monorepo Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start all apps & microservices in parallel via Turborepo |
| `pnpm run build` | Compile all workspaces with incremental caching |
| `pnpm run lint` | Lint all workspaces |
| `pnpm run test` | Execute unit and integration tests |
| `pnpm run prisma:generate` | Generate Prisma client bindings |
| `pnpm run prisma:migrate:dev` | Apply database migrations locally |

---

## 🛡️ License
Copyright © 2026 Sangamesh K. All rights reserved.