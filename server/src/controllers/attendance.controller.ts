import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import * as attendanceService from '../services/attendance.service';

/**
 * GET /api/attendance
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, startDate, endDate, status, page, limit } = req.query;

  const result = await attendanceService.getAll({
    employeeId: employeeId as string,
    startDate: startDate as string,
    endDate: endDate as string,
    status: status as string,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 10,
  });

  sendPaginated(res, result.records, result.total, result.page, result.limit);
});

/**
 * GET /api/attendance/my
 */
export const getMyAttendance = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const { startDate, endDate, page, limit } = req.query;

  const result = await attendanceService.getMyAttendance(req.user.employeeId, {
    startDate: startDate as string,
    endDate: endDate as string,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 30,
  });

  sendPaginated(res, result.records, result.total, result.page, result.limit);
});

/**
 * GET /api/attendance/today
 */
export const getTodayStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const record = await attendanceService.getTodayStatus(req.user.employeeId);
  sendSuccess(res, record, record ? 'Today\'s attendance retrieved.' : 'No attendance record for today.');
});

/**
 * POST /api/attendance/check-in
 */
export const checkIn = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const attendance = await attendanceService.checkIn(req.user.employeeId, req.body.notes);
  sendSuccess(res, attendance, 'Checked in successfully.', 201);
});

/**
 * POST /api/attendance/check-out
 */
export const checkOut = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.employeeId) {
    throw new AppError('Employee profile not found for this user.', 404);
  }

  const attendance = await attendanceService.checkOut(req.user.employeeId, req.body.notes);
  sendSuccess(res, attendance, 'Checked out successfully.');
});
