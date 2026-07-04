import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import * as employeeService from '../services/employee.service';
import * as authService from '../services/auth.service';

/**
 * POST /api/employees — Create a new employee (ADMIN/HR only)
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const name = `${data.firstName} ${data.lastName}`.trim();
  const employeeId = data.employeeId || `EMP${Math.floor(Math.random() * 10000)}`;

  const result = await authService.register({
    name,
    employeeId,
    email: data.email,
    password: data.password || 'password123',
    role: data.role || 'EMPLOYEE',
    department: data.departmentId || data.department,
    designation: data.designation,
    phone: data.phone,
    address: data.address,
  });

  // If there's a joiningDate or salary, we should update the profile/payroll, but for now this is enough to create it.
  sendSuccess(res, 'Employee created successfully.', result.user, 201);
});

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
  const data = req.body;
  if (data.firstName && data.lastName && !data.name) {
    data.name = `${data.firstName} ${data.lastName}`.trim();
  }
  if (data.departmentId && !data.department) {
    data.department = data.departmentId;
  }
  const employee = await employeeService.updateEmployee(req.params.id as string, data);
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
