import { Prisma, PayrollStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreatePayrollInput, UpdatePayrollInput } from '../validations/payroll.validation';

/**
 * Employee views their own payroll records (read-only).
 */
export const getMyPayroll = async (userId: string) => {
  const records = await prisma.payroll.findMany({
    where: { userId },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });
  return records;
};

/**
 * Get all payroll records (ADMIN/HR).
 * Supports filters: employeeId, department, month, year, status.
 */
export const getAllPayroll = async (
  filters: {
    employeeId?: string;
    department?: string;
    month?: string;
    year?: string;
    status?: string;
  } = {},
) => {
  const where: Prisma.PayrollWhereInput = {};

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
      where: { profile: { departmentId: filters.department } },
      select: { id: true },
    });
    where.userId = { in: usersInDept.map((u) => u.id) };
  }

  if (filters.month) where.month = parseInt(filters.month, 10);
  if (filters.year) where.year = parseInt(filters.year, 10);
  if (filters.status) where.status = filters.status as PayrollStatus;

  const records = await prisma.payroll.findMany({
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
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });

  return records;
};

/**
 * Get payroll for one employee by their employeeId (ADMIN/HR).
 */
export const getPayrollByEmployeeId = async (employeeId: string) => {
  const user = await prisma.user.findUnique({ where: { employeeId } });
  if (!user) {
    throw new AppError('Employee not found.', 404);
  }

  const records = await prisma.payroll.findMany({
    where: { userId: user.id },
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
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });

  return records;
};

/**
 * Create a payroll record (ADMIN/HR).
 * netSalary = basicSalary + allowances - deductions.
 */
export const createPayroll = async (data: CreatePayrollInput) => {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  // Check if payroll already exists for this month/year
  const existing = await prisma.payroll.findUnique({
    where: {
      userId_month_year: { userId: data.userId, month: data.month, year: data.year },
    },
  });

  if (existing) {
    throw new AppError(
      `Payroll already exists for this employee for ${data.month}/${data.year}.`,
      409,
    );
  }

  const netSalary = data.basicSalary + (data.allowances || 0) - (data.deductions || 0);

  const payroll = await prisma.payroll.create({
    data: {
      userId: data.userId,
      basicSalary: data.basicSalary,
      allowances: data.allowances || 0,
      deductions: data.deductions || 0,
      netSalary,
      month: data.month,
      year: data.year,
    },
    include: {
      user: {
        select: { id: true, name: true, employeeId: true },
      },
    },
  });

  return payroll;
};

/**
 * Update a payroll record (ADMIN/HR).
 * Recalculates netSalary automatically.
 */
export const updatePayroll = async (id: string, data: UpdatePayrollInput) => {
  const existing = await prisma.payroll.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Payroll record not found.', 404);
  }

  const basicSalary = data.basicSalary ?? existing.basicSalary;
  const allowances = data.allowances ?? existing.allowances;
  const deductions = data.deductions ?? existing.deductions;
  const netSalary = basicSalary + allowances - deductions;

  const updated = await prisma.payroll.update({
    where: { id },
    data: {
      ...(data.basicSalary !== undefined && { basicSalary: data.basicSalary }),
      ...(data.allowances !== undefined && { allowances: data.allowances }),
      ...(data.deductions !== undefined && { deductions: data.deductions }),
      ...(data.status !== undefined && { status: data.status }),
      netSalary,
    },
    include: {
      user: {
        select: { id: true, name: true, employeeId: true },
      },
    },
  });

  return updated;
};
