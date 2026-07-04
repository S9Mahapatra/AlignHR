import { LeaveStatus, LeaveType, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateLeaveInput } from '../validations/leave.validation';

/**
 * Calculate the number of days between two dates (inclusive).
 */
const calculateDays = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Employee applies for leave.
 * Calculates totalDays, defaults to PENDING status.
 */
export const createLeave = async (userId: string, data: CreateLeaveInput) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (endDate < startDate) {
    throw new AppError('End date must be on or after start date.', 400);
  }

  const totalDays = calculateDays(startDate, endDate);

  // Check for overlapping leave requests
  const overlapping = await prisma.leaveRequest.findFirst({
    where: {
      userId,
      status: { not: 'REJECTED' },
      OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
    },
  });

  if (overlapping) {
    throw new AppError('You already have a leave request that overlaps with these dates.', 400);
  }

  const leave = await prisma.leaveRequest.create({
    data: {
      userId,
      leaveType: data.leaveType as LeaveType,
      startDate,
      endDate,
      totalDays,
      remarks: data.remarks,
      status: 'PENDING',
    },
    include: {
      user: { select: { id: true, name: true, employeeId: true } },
    },
  });

  return leave;
};

/**
 * Get logged-in user's own leave requests.
 */
export const getMyLeaves = async (userId: string) => {
  const leaves = await prisma.leaveRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return leaves;
};

/**
 * Get all leave requests (ADMIN/HR).
 * Supports filters: status, leaveType, department, employeeId, startDate, endDate.
 */
export const getAllLeaves = async (
  filters: {
    status?: string;
    leaveType?: string;
    department?: string;
    employeeId?: string;
    startDate?: string;
    endDate?: string;
  } = {},
) => {
  const where: Prisma.LeaveRequestWhereInput = {};

  if (filters.status) {
    where.status = filters.status as LeaveStatus;
  }
  if (filters.leaveType) {
    where.leaveType = filters.leaveType as LeaveType;
  }
  if (filters.employeeId) {
    const user = await prisma.user.findUnique({ where: { employeeId: filters.employeeId } });
    if (user) {
      where.userId = user.id;
    } else {
      return [];
    }
  }
  if (filters.department) {
    const usersInDept = await prisma.user.findMany({
      where: { profile: { department: filters.department } },
      select: { id: true },
    });
    where.userId = { in: usersInDept.map((u) => u.id) };
  }
  if (filters.startDate) {
    where.startDate = { gte: new Date(filters.startDate) };
  }
  if (filters.endDate) {
    where.endDate = { lte: new Date(filters.endDate) };
  }

  const leaves = await prisma.leaveRequest.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          employeeId: true,
          email: true,
          profile: {
            select: { department: true, designation: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return leaves;
};

/**
 * Approve a leave request (ADMIN/HR).
 */
export const approveLeave = async (
  leaveId: string,
  reviewerId: string,
  adminComment?: string,
) => {
  const leave = await prisma.leaveRequest.findUnique({ where: { id: leaveId } });
  if (!leave) {
    throw new AppError('Leave request not found.', 404);
  }
  if (leave.status !== 'PENDING') {
    throw new AppError(`This leave request has already been ${leave.status.toLowerCase()}.`, 400);
  }

  const updated = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: {
      status: 'APPROVED',
      adminComment,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
    include: {
      user: { select: { id: true, name: true, employeeId: true } },
    },
  });

  return updated;
};

/**
 * Reject a leave request (ADMIN/HR).
 */
export const rejectLeave = async (
  leaveId: string,
  reviewerId: string,
  adminComment?: string,
) => {
  const leave = await prisma.leaveRequest.findUnique({ where: { id: leaveId } });
  if (!leave) {
    throw new AppError('Leave request not found.', 404);
  }
  if (leave.status !== 'PENDING') {
    throw new AppError(`This leave request has already been ${leave.status.toLowerCase()}.`, 400);
  }

  const updated = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: {
      status: 'REJECTED',
      adminComment,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
    include: {
      user: { select: { id: true, name: true, employeeId: true } },
    },
  });

  return updated;
};
