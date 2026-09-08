# --- Build Stage ---
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.33.2

WORKDIR /app

# Copy root configurations and workspace definitions
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./

# Copy packages configurations
COPY packages/config/package.json ./packages/config/
COPY packages/theme/package.json ./packages/theme/
COPY packages/constants/package.json ./packages/constants/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/
COPY packages/utils/package.json ./packages/utils/
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/ui/package.json ./packages/ui/

# Copy services configurations
COPY services/api/package.json ./services/api/

# Install dependencies (only required workspace graph)
RUN pnpm install --no-frozen-lockfile

# Copy source and schemas
COPY database/prisma/schema.prisma ./database/prisma/
COPY packages/ ./packages/
COPY services/api/ ./services/api/

# Generate Prisma Client
RUN npx prisma generate --schema=database/prisma/schema.prisma

# Build packages and NestJS API
RUN pnpm --filter @human-platform/types build
RUN pnpm --filter @human-platform/api build

# --- Production Runner Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules and built dist
COPY --from=builder /app ./

EXPOSE 3000

CMD ["node", "services/api/dist/src/main.js"]
