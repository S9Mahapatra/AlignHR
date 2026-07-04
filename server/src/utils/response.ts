import { Response } from 'express';

/**
 * Send a successful JSON response.
 */
export const sendSuccess = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error JSON response.
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
