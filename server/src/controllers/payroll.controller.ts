import { Request, Response } from 'express';
import { PayrollStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import * as payrollService from '../services/payroll.service';

/**
 * GET /api/payroll
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, month, year, status, page, limit } = req.query;

  const result = await payrollService.getAll({
    employeeId: employeeId as string,
    month: month ? parseInt(month as string, 10) : undefined,
    year: year ? parseInt(year as string, 10) : undefined,
    status: status as PayrollStatus,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 10,
  });

  sendPaginated(res, result.records, result.total, result.page, result.limit);
});

/**
 * GET /api/payroll/my
 */
export const getMyPayroll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const records = await payrollService.getMyPayroll(req.user.employeeId);
  sendSuccess(res, records, 'Payroll records retrieved.');
});

/**
 * POST /api/payroll/generate
 */
export const generate = asyncHandler(async (req: Request, res: Response) => {
  const result = await payrollService.generate(req.body);
  sendSuccess(res, result, 'Payroll generated successfully.', 201);
});

/**
 * PUT /api/payroll/:id/pay
 */
export const markAsPaid = asyncHandler(async (req: Request, res: Response) => {
  const payroll = await payrollService.markAsPaid(req.params.id);
  sendSuccess(res, payroll, 'Payroll marked as paid.');
});
