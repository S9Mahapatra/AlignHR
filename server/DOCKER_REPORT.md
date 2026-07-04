# AlignHR Backend Docker Report

## Files Added

- `server/Dockerfile`
- `server/.dockerignore`
- `server/docker-entrypoint.sh`
- `docker-compose.yml`

## Fixes Done

- Added production Docker multi-stage build.
- Added Prisma Client generation during Docker build.
- Added Prisma migration deploy at container startup.
- Added environment variable validation before server startup.
- Ensured `.env` is not copied into the Docker image.
- Ensured `.env.example` does not exist.
- Ensured server listens on `0.0.0.0`.
- Added backend health check support.
- Added Docker Compose setup for backend-only deployment.
- Added Docker commands to backend README.

## Validation Commands

```bash
cd server
npm install
npm run build
docker build -t alignhr-server .
docker run --env-file .env -p 5000:5000 alignhr-server
curl http://localhost:5000/health
```

From root:

```bash
docker compose up --build
docker compose down
```

## Remaining Notes

- Replace placeholder Neon DB credentials in `server/.env`.
- Replace placeholder `JWT_SECRET` with a strong production secret.
- Run `npm run prisma:seed` manually only when seed data is needed.
