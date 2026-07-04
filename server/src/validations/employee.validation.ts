import { z } from 'zod';

/** Schema for ADMIN/HR updating any employee */
export const updateEmployeeAdminSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'HR', 'EMPLOYEE']).optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).optional(),
  joiningDate: z.string().optional(),
});

/** Schema for employee updating their own profile (limited fields) */
export const updateEmployeeSelfSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
});

export type UpdateEmployeeAdminInput = z.infer<typeof updateEmployeeAdminSchema>;
export type UpdateEmployeeSelfInput = z.infer<typeof updateEmployeeSelfSchema>;
