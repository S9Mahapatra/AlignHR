import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import * as payrollService from '../services/payroll.service';

/**
 * GET /api/payroll/me — Employee views own payroll (read-only)
 */
export const getMyPayroll = asyncHandler(async (req: Request, res: Response) => {
  const records = await payrollService.getMyPayroll(req.user!.id);
  sendSuccess(res, 'Payroll records retrieved.', records);
});

/**
 * GET /api/payroll — Get all payroll records (ADMIN/HR)
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, department, month, year, status } = req.query;
  const records = await payrollService.getAllPayroll({
    employeeId: employeeId as string,
    department: department as string,
    month: month as string,
    year: year as string,
    status: status as string,
  });
  sendSuccess(res, 'All payroll records retrieved.', records);
});

/**
 * GET /api/payroll/:employeeId — Get payroll for one employee (ADMIN/HR)
 */
export const getByEmployeeId = asyncHandler(async (req: Request, res: Response) => {
  const records = await payrollService.getPayrollByEmployeeId(req.params.employeeId as string);
  sendSuccess(res, 'Employee payroll retrieved.', records);
});

/**
 * POST /api/payroll — Create payroll record (ADMIN/HR)
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const payroll = await payrollService.createPayroll(req.body);
  sendSuccess(res, 'Payroll created successfully.', payroll, 201);
});

/**
 * PATCH /api/payroll/:id — Update payroll record (ADMIN/HR)
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const payroll = await payrollService.updatePayroll(req.params.id as string, req.body);
  sendSuccess(res, 'Payroll updated successfully.', payroll);
});
