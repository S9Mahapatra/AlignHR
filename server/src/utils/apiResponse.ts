import { Response } from 'express';

/**
 * Send a successful JSON response.
 */
export const sendSuccess = (
  res: Response,
  data: any,
  message: string = 'Success',
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
  message: string = 'Something went wrong',
  statusCode: number = 500,
): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Send a paginated JSON response.
 */
export const sendPaginated = (
  res: Response,
  data: any,
  total: number,
  page: number,
  limit: number,
): void => {
  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};
