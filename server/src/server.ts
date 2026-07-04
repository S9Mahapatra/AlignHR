import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const PORT = env.PORT;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════╗
║           AlignHR API Server                   ║
║────────────────────────────────────────────────║
║  Status:  🟢 Running                          ║
║  Port:    ${String(PORT).padEnd(36)}║
║  Mode:    ${env.NODE_ENV.padEnd(36)}║
║  URL:     http://localhost:${String(PORT).padEnd(20)}║
╚════════════════════════════════════════════════╝
  `);
});

// ─── Graceful shutdown ───────────────────────────────────────────────────────

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
