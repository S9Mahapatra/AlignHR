import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { CreateDepartmentInput, UpdateDepartmentInput } from '../validations/department.validation';

/**
 * Get all departments with head employee and employee count.
 */
export const getAll = async () => {
  const departments = await prisma.department.findMany({
    include: {
      head: {
        select: { id: true, firstName: true, lastName: true },
      },
      _count: {
        select: { employees: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return departments;
};

/**
 * Get a single department by ID with its employees.
 */
export const getById = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      head: {
        select: { id: true, firstName: true, lastName: true, designation: true },
      },
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeCode: true,
          designation: true,
          email: true,
          status: true,
        },
        orderBy: { firstName: 'asc' },
      },
    },
  });

  if (!department) {
    throw new AppError('Department not found.', 404);
  }

  return department;
};

/**
 * Create a new department.
 */
export const create = async (data: CreateDepartmentInput) => {
  const department = await prisma.department.create({
    data: {
      name: data.name,
      description: data.description,
      headId: data.headId,
    },
    include: {
      head: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  return department;
};

/**
 * Update an existing department.
 */
export const update = async (id: string, data: UpdateDepartmentInput) => {
  const existing = await prisma.department.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError('Department not found.', 404);
  }

  const department = await prisma.department.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      headId: data.headId,
    },
    include: {
      head: {
        select: { id: true, firstName: true, lastName: true },
      },
      _count: {
        select: { employees: true },
      },
    },
  });

  return department;
};

/**
 * Delete a department. Fails if there are employees still assigned to it.
 */
export const remove = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: { id },
    include: { _count: { select: { employees: true } } },
  });

  if (!department) {
    throw new AppError('Department not found.', 404);
  }

  if (department._count.employees > 0) {
    throw new AppError(
      `Cannot delete department "${department.name}" because it still has ${department._count.employees} employee(s). Reassign them first.`,
      400,
    );
  }

  await prisma.department.delete({ where: { id } });

  return { message: 'Department deleted successfully.' };
};
