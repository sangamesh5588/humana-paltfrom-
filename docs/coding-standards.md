# Coding Standards & Guidelines

Maintaining a cohesive style is vital for developers collaborating in a large monorepo. Follow these guidelines for all contributions.

## General Guidelines
- **Language**: Always write TypeScript (`.ts` or `.tsx` files). Avoid `any` declarations. Use proper interfaces or types.
- **Code Style**: Format all files using Prettier. Lint using ESLint before committing.
- **Imports**: Group imports as follows:
  1. Built-in Node modules (e.g. `path`, `fs`)
  2. External dependencies (e.g. `react`, `@nestjs/common`)
  3. Shared workspace packages (e.g. `@human-platform/ui`, `@human-platform/types`)
  4. Local relative imports (e.g. `./App`, `../services`)

## Naming Conventions
- **Files**:
  - React Components: PascalCase (e.g. `Button.tsx`, `Modal.tsx`)
  - Utilities/Services: camelCase (e.g. `formatDate.ts`, `prisma.service.ts`)
  - Modules/Folders: kebab-case (e.g. `expert-portal`, `services/api`)
- **Classes/Interfaces**: PascalCase (e.g. `HttpExceptionFilter`, `HealthResponse`)
- **Variables/Functions**: camelCase (e.g. `isModalOpen`, `handleLoginSubmit`)
- **Constants/Enums**: UPPER_SNAKE_CASE (e.g. `USER_ROLES`, `API_VERSION`)

## Documentation
- Add jsdoc comments to exported functions and helper utilities.
- Keep README.md files updated with instructions for starting, testing, and configuration parameters.
