import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import * as leaveService from '../services/leave.service';

/**
 * POST /api/leaves — Employee applies for leave
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const leave = await leaveService.createLeave(req.user!.id, req.body);
  sendSuccess(res, 'Leave request submitted.', leave, 201);
});

/**
 * GET /api/leaves/me — Get own leave requests
 */
export const getMyLeaves = asyncHandler(async (req: Request, res: Response) => {
  const leaves = await leaveService.getMyLeaves(req.user!.id);
  sendSuccess(res, 'Leave requests retrieved.', leaves);
});

/**
 * GET /api/leaves — Get all leave requests (ADMIN/HR)
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { status, leaveType, department, employeeId, startDate, endDate } = req.query;
  const leaves = await leaveService.getAllLeaves({
    status: status as string,
    leaveType: leaveType as string,
    department: department as string,
    employeeId: employeeId as string,
    startDate: startDate as string,
    endDate: endDate as string,
  });
  sendSuccess(res, 'All leave requests retrieved.', leaves);
});

/**
 * PATCH /api/leaves/:id/approve — Approve leave request (ADMIN/HR)
 */
export const approve = asyncHandler(async (req: Request, res: Response) => {
  const leave = await leaveService.approveLeave(
    req.params.id as string,
    req.user!.id,
    req.body.adminComment,
  );
  sendSuccess(res, 'Leave request approved.', leave);
});

/**
 * PATCH /api/leaves/:id/reject — Reject leave request (ADMIN/HR)
 */
export const reject = asyncHandler(async (req: Request, res: Response) => {
  const leave = await leaveService.rejectLeave(
    req.params.id as string,
    req.user!.id,
    req.body.adminComment,
  );
  sendSuccess(res, 'Leave request rejected.', leave);
});
