import { z } from 'zod';

/** Schema for employee creating a leave request */
export const createLeaveSchema = z.object({
  leaveType: z.enum(['PAID', 'SICK', 'UNPAID'], {
    required_error: 'Leave type is required',
  }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  remarks: z.string().optional(),
});

/** Schema for ADMIN/HR approve/reject action */
export const leaveActionSchema = z.object({
  adminComment: z.string().optional(),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type LeaveActionInput = z.infer<typeof leaveActionSchema>;
