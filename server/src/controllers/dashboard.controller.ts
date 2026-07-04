import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as dashboardService from '../services/dashboard.service';

/**
 * GET /api/dashboard/stats
 */
export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await dashboardService.getStats();
  sendSuccess(res, stats, 'Dashboard statistics retrieved.');
});
