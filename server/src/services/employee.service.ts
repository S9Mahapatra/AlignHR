import { Role, EmployeeStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { hashPassword } from '../utils/password';
import { CreateEmployeeInput, UpdateEmployeeInput } from '../validations/employee.validation';

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  status?: EmployeeStatus;
  page?: number;
  limit?: number;
}

/**
 * Get all employees with optional filters, search, and pagination.
 */
export const getAll = async (filters: EmployeeFilters = {}) => {
  const { search, departmentId, status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.EmployeeWhereInput = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { employeeCode: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (departmentId) {
    where.departmentId = departmentId;
  }

  if (status) {
    where.status = status;
  }

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: {
        department: { select: { id: true, name: true } },
        user: { select: { id: true, email: true, role: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.employee.count({ where }),
  ]);

  return { employees, total, page, limit };
};

/**
 * Get a single employee by ID with all relations.
 */
export const getById = async (id: string) => {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      user: {
        select: { id: true, email: true, role: true, createdAt: true },
      },
      attendances: {
        orderBy: { date: 'desc' },
        take: 30,
      },
      leaves: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!employee) {
    throw new AppError('Employee not found.', 404);
  }

  return employee;
};

/**
 * Create a new employee along with their user account.
 */
export const create = async (data: CreateEmployeeInput) => {
  // Check if a user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('A user with this email already exists.', 409);
  }

  const hashedPassword = await hashPassword(data.password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: (data.role as Role) || 'EMPLOYEE',
      },
    });

    const employee = await tx.employee.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        departmentId: data.departmentId,
        designation: data.designation,
        dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining) : new Date(),
        salary: data.salary || 0,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
      },
    });

    return { user, employee };
  });

  const { password: _, ...userWithoutPassword } = result.user;

  return {
    ...result.employee,
    user: userWithoutPassword,
  };
};

/**
 * Update an existing employee's fields.
 */
export const update = async (id: string, data: UpdateEmployeeInput) => {
  const existing = await prisma.employee.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError('Employee not found.', 404);
  }

  const updateData: Prisma.EmployeeUpdateInput = {};

  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.designation !== undefined) updateData.designation = data.designation;
  if (data.salary !== undefined) updateData.salary = data.salary;
  if (data.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(data.dateOfBirth);
  if (data.gender !== undefined) updateData.gender = data.gender;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.state !== undefined) updateData.state = data.state;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.zipCode !== undefined) updateData.zipCode = data.zipCode;
  if (data.status !== undefined) updateData.status = data.status as EmployeeStatus;
  if (data.emergencyContact !== undefined) updateData.emergencyContact = data.emergencyContact;
  if (data.emergencyPhone !== undefined) updateData.emergencyPhone = data.emergencyPhone;
  if (data.dateOfJoining !== undefined) updateData.dateOfJoining = new Date(data.dateOfJoining);

  // Handle department relation
  if (data.departmentId !== undefined) {
    if (data.departmentId === null) {
      updateData.department = { disconnect: true };
    } else {
      updateData.department = { connect: { id: data.departmentId } };
    }
  }

  const employee = await prisma.employee.update({
    where: { id },
    data: updateData,
    include: {
      department: { select: { id: true, name: true } },
      user: { select: { id: true, email: true, role: true } },
    },
  });

  // If email was updated, also update the user email
  if (data.email && data.email !== existing.email) {
    await prisma.user.update({
      where: { id: existing.userId },
      data: { email: data.email },
    });
  }

  return employee;
};

/**
 * Delete an employee and their associated user account.
 */
export const remove = async (id: string) => {
  const employee = await prisma.employee.findUnique({ where: { id } });

  if (!employee) {
    throw new AppError('Employee not found.', 404);
  }

  // Cascade delete: removing the user also removes the employee (onDelete: Cascade)
  await prisma.user.delete({
    where: { id: employee.userId },
  });

  return { message: 'Employee deleted successfully.' };
};
