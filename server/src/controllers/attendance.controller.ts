import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import * as attendanceService from '../services/attendance.service';

/**
 * POST /api/attendance/check-in
 */
export const checkIn = asyncHandler(async (req: Request, res: Response) => {
  const attendance = await attendanceService.checkIn(req.user!.id);
  sendSuccess(res, 'Checked in successfully.', attendance, 201);
});

/**
 * POST /api/attendance/check-out
 */
export const checkOut = asyncHandler(async (req: Request, res: Response) => {
  const attendance = await attendanceService.checkOut(req.user!.id);
  sendSuccess(res, 'Checked out successfully.', attendance);
});

/**
 * GET /api/attendance/me — Get own attendance records
 */
export const getMyAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, status } = req.query;
  const records = await attendanceService.getMyAttendance(req.user!.id, {
    startDate: startDate as string,
    endDate: endDate as string,
    status: status as string,
  });
  sendSuccess(res, 'Attendance records retrieved.', records);
});

/**
 * GET /api/attendance — Get all attendance records (ADMIN/HR)
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, department, status, startDate, endDate } = req.query;
  const records = await attendanceService.getAllAttendance({
    employeeId: employeeId as string,
    department: department as string,
    status: status as string,
    startDate: startDate as string,
    endDate: endDate as string,
  });
  sendSuccess(res, 'All attendance records retrieved.', records);
});

/**
 * PATCH /api/attendance/:id — Update attendance record (ADMIN/HR)
 */
export const updateAttendance = asyncHandler(async (req: Request, res: Response) => {
  const updated = await attendanceService.updateAttendance(req.params.id as string, req.body);
  sendSuccess(res, 'Attendance record updated.', updated);
});
