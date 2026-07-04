import { z } from 'zod';

/** Schema for ADMIN/HR updating an attendance record */
export const updateAttendanceSchema = z.object({
  status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE']).optional(),
  remarks: z.string().optional(),
});

export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
