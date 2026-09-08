# Deployment & Infrastructure Reference

This document describes how to deploy the **Human Platform** applications and services.

## Production Container Builds
We containerize the NestJS API gateway using a multi-stage Docker build optimized for pnpm workspaces:
- Path: `services/api/Dockerfile`
- Configuration: `docker-compose.yml`

To test production build locally:
```bash
docker compose build
docker compose up -d
```

## Cloud Provider Setup
1. **Railway**: Point to `services/api/` workspace using Nixpacks builder mapping. Configure env variables for DB and JWT keys.
2. **AWS EC2/ECS**: Push the built Docker image to Amazon ECR. Deploy using AWS ECS (Fargate) with ALB.

## Environment Configurations
All services require the following root environments (defined in `.env`):
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret signing key for credentials.
- `PORT`: Gateway listener port (defaults to 3000).
