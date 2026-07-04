import app from './app';
import { config } from './config';

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║           AlignHR API Server                   ║
║────────────────────────────────────────────────║
║  Status:  🟢 Running                          ║
║  Port:    ${String(PORT).padEnd(36)}║
║  Mode:    ${(process.env.NODE_ENV || 'development').padEnd(36)}║
║  URL:     http://localhost:${String(PORT).padEnd(20)}║
╚════════════════════════════════════════════════╝
  `);
});
