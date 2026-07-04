import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  /** PostgreSQL connection string */
  DATABASE_URL: process.env.DATABASE_URL as string,

  /** Secret key used to sign and verify JWTs */
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret',

  /** JWT token expiration duration */
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  /** Port the Express server listens on */
  PORT: parseInt(process.env.PORT || '5000', 10),

  /** Allowed CORS origin (frontend URL) */
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
} as const;
