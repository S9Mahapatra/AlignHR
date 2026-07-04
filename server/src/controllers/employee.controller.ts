import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import * as employeeService from '../services/employee.service';
import { EmployeeStatus } from '@prisma/client';

/**
 * GET /api/employees
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { search, departmentId, status, page, limit } = req.query;

  const result = await employeeService.getAll({
    search: search as string,
    departmentId: departmentId as string,
    status: status as EmployeeStatus,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 10,
  });

  sendPaginated(res, result.employees, result.total, result.page, result.limit);
});

/**
 * GET /api/employees/:id
 */
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.getById(req.params.id);
  sendSuccess(res, employee, 'Employee retrieved.');
});

/**
 * POST /api/employees
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.create(req.body);
  sendSuccess(res, employee, 'Employee created successfully.', 201);
});

/**
 * PUT /api/employees/:id
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.update(req.params.id, req.body);
  sendSuccess(res, employee, 'Employee updated successfully.');
});

/**
 * DELETE /api/employees/:id
 */
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await employeeService.remove(req.params.id);
  sendSuccess(res, result, 'Employee deleted successfully.');
});
