import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import { sendSuccess, sendError } from './utils/response';

// ─── Route imports ───────────────────────────────────────────────────────────
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import attendanceRoutes from './routes/attendance.routes';
import leaveRoutes from './routes/leave.routes';
import payrollRoutes from './routes/payroll.routes';

const app = express();

// ─── Global middleware ───────────────────────────────────────────────────────

/** CORS — allow the configured frontend origin */
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

/** HTTP request logging */
app.use(morgan('dev'));

/** Parse JSON request bodies */
app.use(express.json({ limit: '10mb' }));

/** Parse URL-encoded request bodies */
app.use(express.urlencoded({ extended: true }));

/** Parse cookies */
app.use(cookieParser());

// ─── Health check ────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  sendSuccess(res, 'AlignHR server is running');
});

// ─── API Routes ──────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────

app.use((_req, res) => {
  sendError(res, 'The requested resource was not found.', 404);
});

// ─── Error handler ───────────────────────────────────────────────────────────

app.use(errorMiddleware);

export default app;
