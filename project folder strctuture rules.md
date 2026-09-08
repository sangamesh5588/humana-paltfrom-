# Monorepo Restructuring Plan

This implementation plan outlines the steps required to transition the `human-platform` repository into a large-scale, corporate-grade startup monorepo. We will transition from npm workspaces to **pnpm workspaces** and **Turborepo**, move existing code to their appropriate subdirectories, initialize placeholder packages and new frontend applications with a premium Vanilla CSS layout, and write detailed architectural documentation.

## User Review Required

> [!IMPORTANT]
> - **Dependency Manager Switch**: We will transition the monorepo from `npm` workspaces to `pnpm` workspaces (using version `10.33.2` which is installed on your system). This will require deleting `package-lock.json` and running `pnpm install` at the root.
> - **Shared Code Refactoring**: The existing `@human-platform/shared` package will be migrated and renamed to `@human-platform/types` to fit the structured package ecosystem.
> - **Prisma Schema Relocation**: The Prisma schema will be moved from `backend/prisma/schema.prisma` to `database/prisma/schema.prisma` to decouple database management from any single service.

## Proposed Changes

We will restructure the project according to the following layout:

```text
human-platform/
├── apps/
│   ├── mobile/                   # [MIGRATED] React Native App
│   ├── website/                  # [NEW] Marketing & Landing Website
│   ├── admin/                    # [NEW] Internal Admin Dashboard
│   ├── expert-portal/            # [NEW] Experts Portal
│   ├── organization-portal/      # [NEW] Organizations Portal
│   └── docs-site/                # [NEW] Developer Documentation Site
├── services/
│   ├── api/                      # [MIGRATED] NestJS main API
│   ├── ai/                       # [NEW] AI service structure
│   ├── notification/             # [NEW] Notification service structure
│   ├── scheduler/                # [NEW] Cron scheduler service structure
│   ├── worker/                   # [NEW] Queue worker service structure
│   ├── search/                   # [NEW] Search service structure (placeholder)
│   └── realtime/                 # [NEW] Realtime WebSockets (placeholder)
├── packages/
│   ├── ui/                       # [NEW] Shared React components
│   ├── types/                    # [MIGRATED] Shared TypeScript types
│   ├── api-client/               # [NEW] Axios SDK for services
│   ├── validation/               # [NEW] Zod schemas
│   ├── constants/                # [NEW] Shared global constants
│   ├── config/                   # [NEW] Eslint, tsconfig configuration
│   ├── utils/                    # [NEW] Date/string utility functions
│   ├── hooks/                    # [NEW] Shared React hooks
│   └── theme/                    # [NEW] Theme variables (Vanilla CSS tokens)
├── database/
│   ├── prisma/                   # [MIGRATED] Schema, migrations, seeds, backups
│   ├── erd/                      # [NEW] ER diagrams
│   └── sql/                      # [NEW] Raw SQL scripts
├── infrastructure/               # [NEW] Docker, Railway, AWS configuration
├── docs/                         # [NEW] Tech docs
└── tools/                        # [NEW] CLI and helper tools
```

---

### Workspace Configuration

#### [NEW] [pnpm-workspace.yaml](file:///c:/Users/sangu/my%20projects/human-platform/pnpm-workspace.yaml)
Defines pnpm workspaces for apps, services, and packages.

#### [NEW] [turbo.json](file:///c:/Users/sangu/my%20projects/human-platform/turbo.json)
Turborepo build pipeline configuration to cache and parallelize builds, lint checks, and testing.

#### [MODIFY] [package.json](file:///c:/Users/sangu/my%20projects/human-platform/package.json)
Configure scripts to launch Turborepo commands and declare workspace dependencies.

---

### Apps Component

#### [MODIFY] [mobile](file:///c:/Users/sangu/my%20projects/human-platform/apps/mobile)
- Move all files from `mobile/` to `apps/mobile/`.
- Update `package.json` dependencies: replace `@human-platform/shared` with `@human-platform/types`, `@human-platform/theme`, etc.
- Update typescript config and asset routes.

#### [NEW] [website](file:///c:/Users/sangu/my%20projects/human-platform/apps/website)
- Initialize a React + TypeScript + Vite app using Vanilla CSS.
- Style with a state-of-the-art dark-mode, glassmorphic layout, micro-animations, and dynamic landing sections.

#### [NEW] [admin](file:///c:/Users/sangu/my%20projects/human-platform/apps/admin)
- Initialize a React + Vite + TS admin dashboard with widgets, user lists, charts, and moderation layouts.

#### [NEW] [expert-portal](file:///c:/Users/sangu/my%20projects/human-platform/apps/expert-portal)
- Initialize a React + Vite + TS expert portal for calendar events, analytics, and meeting controls.

#### [NEW] [organization-portal](file:///c:/Users/sangu/my%20projects/human-platform/apps/organization-portal)
- Initialize a React + Vite + TS organization portal with team rosters, department lists, and invoicing templates.

#### [NEW] [docs-site](file:///c:/Users/sangu/my%20projects/human-platform/apps/docs-site)
- Initialize a simple developer/public documentation portal.

---

### Services Component

#### [MODIFY] [api](file:///c:/Users/sangu/my%20projects/human-platform/services/api)
- Move root `backend` files to `services/api`.
- Update NestJS cli configurations, typescript configs, and paths.
- Update `package.json` to link with the relocated database schema.
- Update files that referenced `@human-platform/shared` to refer to `@human-platform/types` or `@human-platform/validation`.

#### [NEW] [ai, notification, scheduler, worker, search, realtime](file:///c:/Users/sangu/my%20projects/human-platform/services)
- Create individual boilerplate project folders containing basic NestJS/TS settings (`package.json`, `tsconfig.json`, `src/index.ts`) so they are ready for future development.

---

### Packages Component

#### [NEW] [types](file:///c:/Users/sangu/my%20projects/human-platform/packages/types)
- Migrate code from root `shared/` to `packages/types/`.
- Rename package to `@human-platform/types`.

#### [NEW] [ui, api-client, validation, constants, config, utils, hooks, theme](file:///c:/Users/sangu/my%20projects/human-platform/packages)
- Initialize shared packages with fully typed interfaces and configuration files.
- `packages/theme`: CSS Variables and JS tokens for brand colors, layout sizes, and fonts.
- `packages/ui`: High-fidelity Vanilla CSS components (Button, Input, Card, Modal).
- `packages/validation`: Zod schemas for shared models (Auth, Profiles, Settings).
- `packages/api-client`: Axios-based HTTP module.

---

### Database Component

#### [NEW] [database/prisma](file:///c:/Users/sangu/my%20projects/human-platform/database/prisma)
- Move existing `backend/prisma/schema.prisma` to `database/prisma/schema.prisma`.
- Create a seed script (`database/prisma/seed.ts`).
- Setup folder layout for migrations and backups.

---

### Infrastructure Component

#### [NEW] [infrastructure](file:///c:/Users/sangu/my%20projects/human-platform/infrastructure)
- Setup Docker configurations (`docker/Dockerfile.dev`, `docker/Dockerfile.prod`, `docker-compose.yml` updated).
- Railway (`railway/railway.json`), AWS cloud setup documents, Nginx gateway configurations.

---

### Documentation Component

#### [NEW] [docs](file:///c:/Users/sangu/my%20projects/human-platform/docs)
Create markdown documents detailing:
- `docs/architecture/backend.md`
- `docs/architecture/frontend.md`
- `docs/architecture/database.md`
- `docs/architecture/deployment.md`
- `docs/coding-standards.md`

## Verification Plan

### Automated Tests
- Run `pnpm run lint` across all packages and apps to verify code styling.
- Run `pnpm run test` to verify Jest tests in NestJS.
- Generate Prisma Client and verify DB connections: `pnpm run prisma:generate`.
- Compile and build all services and apps to verify Turborepo compiles successfully: `pnpm run build`.

### Manual Verification
- Verify database service spinning up via Docker Compose.
- Verify Vite dev servers can run for website, admin, expert, and organization portals.
