import { Prisma, AttendanceStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';

/**
 * Get today's date at midnight (UTC).
 */
const getTodayDate = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

/**
 * Check in for the current day.
 * Creates an attendance record with status PRESENT.
 */
export const checkIn = async (userId: string) => {
  const today = getTodayDate();

  // Check if already checked in today
  const existing = await prisma.attendance.findUnique({
    where: {
      userId_date: { userId, date: today },
    },
  });

  if (existing) {
    throw new AppError('You have already checked in today.', 400);
  }

  const attendance = await prisma.attendance.create({
    data: {
      userId,
      date: today,
      checkIn: new Date(),
      status: 'PRESENT',
    },
    include: {
      user: { select: { id: true, name: true, employeeId: true } },
    },
  });

  return attendance;
};

/**
 * Check out for the current day.
 * Calculates workHours. If < 4 hours, marks HALF_DAY.
 */
export const checkOut = async (userId: string) => {
  const today = getTodayDate();

  const existing = await prisma.attendance.findUnique({
    where: {
      userId_date: { userId, date: today },
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
  const status: AttendanceStatus = workHours < 4 ? 'HALF_DAY' : 'PRESENT';

  const attendance = await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOut: now,
      workHours,
      status,
    },
    include: {
      user: { select: { id: true, name: true, employeeId: true } },
    },
  });

  return attendance;
};

/**
 * Get own attendance records with optional filters.
 */
export const getMyAttendance = async (
  userId: string,
  filters: { startDate?: string; endDate?: string; status?: string } = {},
) => {
  const where: Prisma.AttendanceWhereInput = { userId };

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      (where.date as Prisma.DateTimeFilter).gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      (where.date as Prisma.DateTimeFilter).lte = new Date(filters.endDate);
    }
  }

  if (filters.status) {
    where.status = filters.status as AttendanceStatus;
  }

  const records = await prisma.attendance.findMany({
    where,
    orderBy: { date: 'desc' },
  });

  return records;
};

/**
 * Get all attendance records (ADMIN/HR).
 * Supports filters: employeeId, department, status, startDate, endDate.
 */
export const getAllAttendance = async (
  filters: {
    employeeId?: string;
    department?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {},
) => {
  const where: Prisma.AttendanceWhereInput = {};

  if (filters.employeeId) {
    // Look up user by their employeeId field
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

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      (where.date as Prisma.DateTimeFilter).gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      (where.date as Prisma.DateTimeFilter).lte = new Date(filters.endDate);
    }
  }

  if (filters.status) {
    where.status = filters.status as AttendanceStatus;
  }

  const records = await prisma.attendance.findMany({
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
    orderBy: { date: 'desc' },
  });

  return records;
};

/**
 * Update an attendance record (ADMIN/HR).
 */
export const updateAttendance = async (
  id: string,
  data: { status?: AttendanceStatus; remarks?: string },
) => {
  const existing = await prisma.attendance.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Attendance record not found.', 404);
  }

  const updated = await prisma.attendance.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.remarks !== undefined && { remarks: data.remarks }),
    },
    include: {
      user: { select: { id: true, name: true, employeeId: true } },
    },
  });

  return updated;
};
