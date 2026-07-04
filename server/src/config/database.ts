import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient singleton.
 *
 * During development with hot-reload (tsx watch, nodemon, etc.) every restart
 * would create a new PrismaClient and eventually exhaust the database connection
 * pool. We store the client on `globalThis` so the same instance is reused
 * across hot-reloads.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
