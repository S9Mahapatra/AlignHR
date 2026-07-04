import { z } from 'zod';

/** Schema for creating a payroll record */
export const createPayrollSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  basicSalary: z.number().min(0, 'Basic salary cannot be negative'),
  allowances: z.number().min(0).optional().default(0),
  deductions: z.number().min(0).optional().default(0),
  month: z.number().int().min(1, 'Month must be between 1 and 12').max(12, 'Month must be between 1 and 12'),
  year: z.number().int().min(2000, 'Year must be 2000 or later').max(2100),
});

/** Schema for updating a payroll record */
export const updatePayrollSchema = z.object({
  basicSalary: z.number().min(0).optional(),
  allowances: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
  status: z.enum(['DRAFT', 'PROCESSED', 'PAID']).optional(),
});

export type CreatePayrollInput = z.infer<typeof createPayrollSchema>;
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;
