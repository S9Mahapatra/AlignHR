import { PayrollStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { GeneratePayrollInput } from '../validations/payroll.validation';

export interface PayrollFilters {
  employeeId?: string;
  month?: number;
  year?: number;
  status?: PayrollStatus;
  page?: number;
  limit?: number;
}

/**
 * Get all payroll records with filters and pagination.
 */
export const getAll = async (filters: PayrollFilters = {}) => {
  const { employeeId, month, year, status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.PayrollWhereInput = {};

  if (employeeId) where.employeeId = employeeId;
  if (month) where.month = month;
  if (year) where.year = year;
  if (status) where.status = status;

  const [records, total] = await Promise.all([
    prisma.payroll.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeCode: true,
            designation: true,
            department: { select: { name: true } },
          },
        },
      },
      skip,
      take: limit,
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    }),
    prisma.payroll.count({ where }),
  ]);

  return { records, total, page, limit };
};

/**
 * Generate payroll for a specific employee (or all active employees if employeeId is omitted).
 */
export const generate = async (data: GeneratePayrollInput) => {
  const { month, year, bonuses = 0, deductions = 0 } = data;

  // If specific employee, generate for one; otherwise for all active employees
  if (data.employeeId) {
    return generateForEmployee(data.employeeId, month, year, bonuses, deductions);
  }

  // Generate for all active employees
  const employees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' },
  });

  if (employees.length === 0) {
    throw new AppError('No active employees found.', 404);
  }

  const results = [];
  const errors = [];

  for (const emp of employees) {
    try {
      const payroll = await generateForEmployee(emp.id, month, year, bonuses, deductions);
      results.push(payroll);
    } catch (error) {
      errors.push({ employeeId: emp.id, name: `${emp.firstName} ${emp.lastName}`, error: (error as Error).message });
    }
  }

  return { generated: results, errors, total: results.length };
};

/**
 * Generate payroll for a single employee.
 */
const generateForEmployee = async (
  employeeId: string,
  month: number,
  year: number,
  bonuses: number,
  deductions: number,
) => {
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });

  if (!employee) {
    throw new AppError('Employee not found.', 404);
  }

  // Check if payroll already exists for this month/year
  const existing = await prisma.payroll.findUnique({
    where: {
      employeeId_month_year: { employeeId, month, year },
    },
  });

  if (existing) {
    throw new AppError(
      `Payroll for ${employee.firstName} ${employee.lastName} already exists for ${month}/${year}.`,
      409,
    );
  }

  // Calculate salary components
  const basicSalary = employee.salary;
  const hra = basicSalary * 0.4; // 40% of basic
  const da = basicSalary * 0.2; // 20% of basic
  const gross = basicSalary + hra + da + bonuses;
  const tax = gross > 50000 ? gross * 0.1 : gross * 0.05; // 10% if > 50k, else 5%
  const netSalary = gross - deductions - tax;

  const payroll = await prisma.payroll.create({
    data: {
      employeeId,
      month,
      year,
      basicSalary,
      hra,
      da,
      deductions,
      bonuses,
      tax: parseFloat(tax.toFixed(2)),
      netSalary: parseFloat(netSalary.toFixed(2)),
      status: 'DRAFT',
    },
    include: {
      employee: {
        select: { firstName: true, lastName: true, employeeCode: true },
      },
    },
  });

  return payroll;
};

/**
 * Get payroll records for a specific employee.
 */
export const getMyPayroll = async (employeeId: string) => {
  const records = await prisma.payroll.findMany({
    where: { employeeId },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });

  return records;
};

/**
 * Mark a payroll record as paid.
 */
export const markAsPaid = async (payrollId: string) => {
  const payroll = await prisma.payroll.findUnique({ where: { id: payrollId } });

  if (!payroll) {
    throw new AppError('Payroll record not found.', 404);
  }

  if (payroll.status === 'PAID') {
    throw new AppError('This payroll has already been marked as paid.', 400);
  }

  const updated = await prisma.payroll.update({
    where: { id: payrollId },
    data: {
      status: 'PAID',
      paidAt: new Date(),
    },
    include: {
      employee: {
        select: { firstName: true, lastName: true, employeeCode: true },
      },
    },
  });

  return updated;
};
