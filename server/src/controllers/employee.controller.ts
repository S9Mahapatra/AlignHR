import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import * as employeeService from '../services/employee.service';

/**
 * GET /api/employees — List all employees (ADMIN/HR only)
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const employees = await employeeService.getAllEmployees();
  sendSuccess(res, 'Employees retrieved.', employees);
});

/**
 * GET /api/employees/:id — Get employee by ID (ADMIN/HR only)
 */
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.getEmployeeById(req.params.id as string);
  sendSuccess(res, 'Employee retrieved.', employee);
});

/**
 * PATCH /api/employees/:id — Update employee (ADMIN/HR only)
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.updateEmployee(req.params.id as string, req.body);
  sendSuccess(res, 'Employee updated successfully.', employee);
});

/**
 * DELETE /api/employees/:id — Delete employee (ADMIN only)
 */
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await employeeService.deleteEmployee(req.params.id as string);
  sendSuccess(res, 'Employee deleted successfully.', result);
});

/**
 * GET /api/employees/me/profile — Get own profile
 */
export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await employeeService.getMyProfile(req.user!.id);
  sendSuccess(res, 'Profile retrieved.', profile);
});

/**
 * PATCH /api/employees/me/profile — Update own profile (limited fields)
 */
export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await employeeService.updateMyProfile(req.user!.id, req.body);
  sendSuccess(res, 'Profile updated successfully.', profile);
});
