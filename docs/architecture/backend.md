# Backend Architecture

The backend of **Human Platform** is designed to scale from a single API gateway into a distributed microservice mesh.

## Key Technologies
- **Runtime**: Node.js (v20+)
- **Framework**: NestJS (v10+)
- **Language**: TypeScript
- **ORM**: Prisma
- **Documentation**: Swagger UI

## Package Workspaces Structure
```text
services/
├── api/             # Main Express/NestJS gateway API
├── ai/              # AI Orchestration workflows (future)
├── notification/    # SMS, Email & Push notification services (future)
├── scheduler/       # Cron task dispatcher (future)
└── worker/          # Asynchronous queue processors (future)
```

## Modular Design Guidelines

1. **Keep Controllers Lean**: Controllers are responsible ONLY for request parsing, DTO binding/validation, and route declarations. Business operations belong in Services.
2. **Abstract Database Calls via Repositories**: Encapsulate Prisma operations in repository classes to permit changing data layers in the future without refactoring services.
3. **Validate All Ingress Payloads**: Use NestJS ValidationPipe together with Zod schemas from `@human-platform/validation` to ensure structural validation.
4. **Decouple Asynchronous Tasks**: Tasks like emails or AI processing must be pushed to a queue (e.g. BullMQ / Redis) processed in `services/worker` instead of execution inline during HTTP requests.
