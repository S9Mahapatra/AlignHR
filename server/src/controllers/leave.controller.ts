import { Request, Response } from 'express';
import { LeaveStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import * as leaveService from '../services/leave.service';

/**
 * GET /api/leaves
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { status, employeeId, page, limit } = req.query;

  const result = await leaveService.getAll({
    status: status as LeaveStatus,
    employeeId: employeeId as string,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 10,
  });

  sendPaginated(res, result.leaves, result.total, result.page, result.limit);
});

/**
 * GET /api/leaves/my
 */
export const getMyLeaves = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const leaves = await leaveService.getMyLeaves(req.user.employeeId);
  sendSuccess(res, leaves, 'Leave requests retrieved.');
});

/**
 * GET /api/leaves/balance
 */
export const getLeaveBalance = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const balance = await leaveService.getLeaveBalance(req.user.employeeId);
  sendSuccess(res, balance, 'Leave balance retrieved.');
});

/**
 * POST /api/leaves
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const leave = await leaveService.create(req.user.employeeId, req.body);
  sendSuccess(res, leave, 'Leave request submitted.', 201);
});

/**
 * PUT /api/leaves/:id/approve
 */
export const approve = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const leave = await leaveService.updateStatus(
    req.params.id,
    'APPROVED',
    req.user.employeeId,
  );
  sendSuccess(res, leave, 'Leave request approved.');
});

/**
 * PUT /api/leaves/:id/reject
 */
export const reject = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const leave = await leaveService.updateStatus(
    req.params.id,
    'REJECTED',
    req.user.employeeId,
    req.body.rejectionNote,
  );
  sendSuccess(res, leave, 'Leave request rejected.');
});
