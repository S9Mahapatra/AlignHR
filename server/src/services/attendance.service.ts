import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface AttendanceFilters {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

/**
 * Get today's date at midnight (UTC).
 */
const getTodayDate = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

/**
 * Get all attendance records with filters and pagination.
 */
export const getAll = async (filters: AttendanceFilters = {}) => {
  const { employeeId, startDate, endDate, status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.AttendanceWhereInput = {};

  if (employeeId) {
    where.employeeId = employeeId;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      (where.date as Prisma.DateTimeFilter).gte = new Date(startDate);
    }
    if (endDate) {
      (where.date as Prisma.DateTimeFilter).lte = new Date(endDate);
    }
  }

  if (status) {
    where.status = status as any;
  }

  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, department: { select: { name: true } } },
        },
      },
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    }),
    prisma.attendance.count({ where }),
  ]);

  return { records, total, page, limit };
};

/**
 * Check in for the current day.
 */
export const checkIn = async (employeeId: string, notes?: string) => {
  const today = getTodayDate();

  // Check if already checked in today
  const existing = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: today,
      },
    },
  });

  if (existing) {
    throw new AppError('You have already checked in today.', 400);
  }

  const now = new Date();
  // Consider late if check-in is after 9:30 AM
  const lateThreshold = new Date(today);
  lateThreshold.setUTCHours(9, 30, 0, 0);

  const status = now > lateThreshold ? 'LATE' : 'PRESENT';

  const attendance = await prisma.attendance.create({
    data: {
      employeeId,
      date: today,
      checkIn: now,
      status,
      notes,
    },
    include: {
      employee: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  return attendance;
};

/**
 * Check out for the current day.
 */
export const checkOut = async (employeeId: string, notes?: string) => {
  const today = getTodayDate();

  const existing = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: today,
      },
    },
  });

  if (!existing) {
    throw new AppError('You have not checked in today. Please check in first.', 400);
  }

  if (existing.checkOut) {
    throw new AppError('You have already checked out today.', 400);
  }

  const now = new Date();
  let workHours = 0;

  if (existing.checkIn) {
    const diffMs = now.getTime() - existing.checkIn.getTime();
    workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  }

  // Mark as half day if worked less than 4 hours
  const status = workHours < 4 ? 'HALF_DAY' : existing.status;

  const attendance = await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOut: now,
      workHours,
      status,
      notes: notes || existing.notes,
    },
    include: {
      employee: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  return attendance;
};

/**
 * Get attendance records for a specific employee.
 */
export const getMyAttendance = async (employeeId: string, filters: AttendanceFilters = {}) => {
  const { startDate, endDate, page = 1, limit = 30 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.AttendanceWhereInput = { employeeId };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      (where.date as Prisma.DateTimeFilter).gte = new Date(startDate);
    }
    if (endDate) {
      (where.date as Prisma.DateTimeFilter).lte = new Date(endDate);
    }
  }

  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    }),
    prisma.attendance.count({ where }),
  ]);

  return { records, total, page, limit };
};

/**
 * Get today's attendance status for an employee.
 */
export const getTodayStatus = async (employeeId: string) => {
  const today = getTodayDate();

  const record = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: today,
      },
    },
  });

  return record;
};
