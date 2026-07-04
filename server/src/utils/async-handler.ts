import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async route handler so thrown errors are automatically
 * forwarded to Express error-handling middleware.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
