import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (!globalForPrisma.prisma) {
  let connectionString = process.env.DATABASE_URL || '';
  connectionString = connectionString.replace('postgresql://', 'postgres://');
  connectionString = connectionString.replace('-pooler', '');
  connectionString = connectionString.replace('?sslmode=require&pgbouncer=true&connect_timeout=30&pool_timeout=30', '?sslmode=require');
  connectionString = connectionString.replace('?sslmode=require&pgbouncer=true&connect_timeout=30', '?sslmode=require');
  
  const adapter = new PrismaNeon({ connectionString });

  prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
} else {
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
