import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/apiResponse';
import * as departmentService from '../services/department.service';

/**
 * GET /api/departments
 */
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await departmentService.getAll();
  sendSuccess(res, departments, 'Departments retrieved.');
});

/**
 * GET /api/departments/:id
 */
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.getById(req.params.id);
  sendSuccess(res, department, 'Department retrieved.');
});

/**
 * POST /api/departments
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.create(req.body);
  sendSuccess(res, department, 'Department created successfully.', 201);
});

/**
 * PUT /api/departments/:id
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.update(req.params.id, req.body);
  sendSuccess(res, department, 'Department updated successfully.');
});

/**
 * DELETE /api/departments/:id
 */
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await departmentService.remove(req.params.id);
  sendSuccess(res, result, 'Department deleted successfully.');
});
