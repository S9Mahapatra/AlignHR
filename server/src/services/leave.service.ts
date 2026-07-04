import { LeaveStatus, LeaveType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { CreateLeaveInput } from '../validations/leave.validation';

/** Annual leave entitlements per type */
const LEAVE_ENTITLEMENTS: Record<LeaveType, number> = {
  CASUAL: 12,
  SICK: 12,
  EARNED: 15,
  UNPAID: 365, // unlimited effectively
};

export interface LeaveFilters {
  status?: LeaveStatus;
  employeeId?: string;
  page?: number;
  limit?: number;
}

/**
 * Calculate the number of days between two dates (inclusive).
 */
const calculateDays = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Get all leave records with filters and pagination.
 */
export const getAll = async (filters: LeaveFilters = {}) => {
  const { status, employeeId, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.LeaveWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (employeeId) {
    where.employeeId = employeeId;
  }

  const [leaves, total] = await Promise.all([
    prisma.leave.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeCode: true,
            department: { select: { name: true } },
          },
        },
        approvedBy: {
          select: { firstName: true, lastName: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.leave.count({ where }),
  ]);

  return { leaves, total, page, limit };
};

/**
 * Create a new leave request.
 */
export const create = async (employeeId: string, data: CreateLeaveInput) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (endDate < startDate) {
    throw new AppError('End date must be on or after start date.', 400);
  }

  const totalDays = calculateDays(startDate, endDate);

  // Check if employee has enough leave balance for non-UNPAID leaves
  if (data.leaveType !== 'UNPAID') {
    const balance = await getLeaveBalance(employeeId);
    const leaveTypeBalance = balance.find((b) => b.type === data.leaveType);
    if (leaveTypeBalance && leaveTypeBalance.remaining < totalDays) {
      throw new AppError(
        `Insufficient ${data.leaveType} leave balance. You have ${leaveTypeBalance.remaining} day(s) remaining.`,
        400,
      );
    }
  }

  // Check for overlapping leave requests
  const overlapping = await prisma.leave.findFirst({
    where: {
      employeeId,
      status: { not: 'REJECTED' },
      OR: [
        { startDate: { lte: endDate }, endDate: { gte: startDate } },
      ],
    },
  });

  if (overlapping) {
    throw new AppError('You already have a leave request that overlaps with these dates.', 400);
  }

  const leave = await prisma.leave.create({
    data: {
      employeeId,
      leaveType: data.leaveType as LeaveType,
      startDate,
      endDate,
      totalDays,
      reason: data.reason,
    },
    include: {
      employee: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  return leave;
};

/**
 * Approve or reject a leave request.
 */
export const updateStatus = async (
  leaveId: string,
  status: 'APPROVED' | 'REJECTED',
  approvedById: string,
  rejectionNote?: string,
) => {
  const leave = await prisma.leave.findUnique({ where: { id: leaveId } });

  if (!leave) {
    throw new AppError('Leave request not found.', 404);
  }

  if (leave.status !== 'PENDING') {
    throw new AppError(`This leave request has already been ${leave.status.toLowerCase()}.`, 400);
  }

  const updated = await prisma.leave.update({
    where: { id: leaveId },
    data: {
      status: status as LeaveStatus,
      approvedById,
      approvedAt: new Date(),
      rejectionNote: status === 'REJECTED' ? rejectionNote : null,
    },
    include: {
      employee: {
        select: { firstName: true, lastName: true },
      },
      approvedBy: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  return updated;
};

/**
 * Get all leaves for a specific employee.
 */
export const getMyLeaves = async (employeeId: string) => {
  const leaves = await prisma.leave.findMany({
    where: { employeeId },
    include: {
      approvedBy: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return leaves;
};

/**
 * Calculate the remaining leave balance for an employee for the current year.
 */
export const getLeaveBalance = async (employeeId: string) => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(Date.UTC(currentYear, 0, 1));
  const endOfYear = new Date(Date.UTC(currentYear, 11, 31));

  // Count approved leaves for each type in the current year
  const usedLeaves = await prisma.leave.groupBy({
    by: ['leaveType'],
    where: {
      employeeId,
      status: { in: ['APPROVED', 'PENDING'] },
      startDate: { gte: startOfYear },
      endDate: { lte: endOfYear },
    },
    _sum: { totalDays: true },
  });

  const usedMap = new Map(
    usedLeaves.map((l) => [l.leaveType, l._sum.totalDays || 0]),
  );

  const balance = Object.entries(LEAVE_ENTITLEMENTS).map(([type, entitled]) => ({
    type: type as LeaveType,
    entitled,
    used: usedMap.get(type as LeaveType) || 0,
    remaining: entitled - (usedMap.get(type as LeaveType) || 0),
  }));

  return balance;
};
