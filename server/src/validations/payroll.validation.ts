import { z } from 'zod';

export const generatePayrollSchema = z.object({
  employeeId: z.string().optional(),
  month: z.number().int().min(1, 'Month must be between 1 and 12').max(12, 'Month must be between 1 and 12'),
  year: z.number().int().min(2000, 'Year must be 2000 or later').max(2100),
  bonuses: z.number().min(0).optional().default(0),
  deductions: z.number().min(0).optional().default(0),
});

export type GeneratePayrollInput = z.infer<typeof generatePayrollSchema>;
