import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { prisma } from '../config/prisma';

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' },
  });
  sendSuccess(res, 'Departments retrieved.', departments);
});
