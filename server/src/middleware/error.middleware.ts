import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error-handling middleware.
 * Catches all errors thrown or passed via next(err) and returns a consistent JSON response.
 */
export const errorMiddleware = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Prisma known errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      const target = prismaErr.meta?.target as string[] | undefined;
      res.status(409).json({
        success: false,
        message: `A record with this ${target?.join(', ') || 'value'} already exists.`,
      });
      return;
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'The requested record was not found.',
      });
      return;
    }
  }

  // Unexpected errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === 'production'
        ? 'An unexpected error occurred.'
        : err.message || 'An unexpected error occurred.',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
