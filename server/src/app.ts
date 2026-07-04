import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import routes from './routes';
import { errorHandler, AppError } from './middleware/errorHandler';

const app = express();

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------

/** CORS — allow the configured frontend origin */
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

/** Security headers */
app.use(helmet());

/** HTTP request logging (dev format) */
app.use(morgan('dev'));

/** Parse JSON request bodies */
app.use(express.json({ limit: '10mb' }));

/** Parse URL-encoded request bodies */
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/** Health-check endpoint */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/** Mount all API routes */
app.use(routes);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

/** 404 — catch unmatched routes */
app.use((_req, _res, next) => {
  next(new AppError('The requested resource was not found.', 404));
});

/** Global error handler */
app.use(errorHandler);

export default app;
