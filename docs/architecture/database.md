# Database Architecture

The **Human Platform** database layout is configured to ensure data integrity and decoupled database orchestration.

## Tech Stack
- **Database Engine**: PostgreSQL (v15+)
- **ORM**: Prisma Client
- **Orchestration**: Prisma Migrations

## Centralized Schema
To prevent multiple definitions and drifting schema layouts, the Prisma definition resides in a single root repository folder:
`database/prisma/schema.prisma`

## Core Models

### User (`users`)
- Identifies system accounts (both regular users, experts, and administrators).
- Declares base credentials (`email`, `password`) and timestamps.

### Profile (`profiles`)
- Extends User records with details (`firstName`, `lastName`).
- Linked to `users` with a cascade deletion policy.

## Schema Operations

### Generate Local Typings
Re-generates Prisma typescript client definitions inside package nodes:
```bash
pnpm run prisma:generate
```

### Apply Migrations
Creates and runs SQL migrations to align PostgreSQL with schema.prisma:
```bash
pnpm run prisma:migrate:dev
```
