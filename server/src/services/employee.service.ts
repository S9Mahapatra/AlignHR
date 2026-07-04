import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { UpdateEmployeeAdminInput, UpdateEmployeeSelfInput } from '../validations/employee.validation';

/** Reusable select to exclude password from User results */
const userSelectWithoutPassword = {
  id: true,
  name: true,
  employeeId: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  profile: {
    include: {
      department: true,
    },
  },
};

/**
 * Get all employees (ADMIN/HR only).
 */
export const getAllEmployees = async () => {
  const users = await prisma.user.findMany({
    select: userSelectWithoutPassword,
    orderBy: { createdAt: 'desc' },
  });
  return users;
};

/**
 * Get a single employee by ID (ADMIN/HR only).
 */
export const getEmployeeById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelectWithoutPassword,
  });

  if (!user) {
    throw new AppError('Employee not found.', 404);
  }

  return user;
};

/**
 * Update an employee — ADMIN/HR can update:
 * name, role, department, designation, phone, address, profileImage, status, joiningDate
 */
export const updateEmployee = async (id: string, data: UpdateEmployeeAdminInput) => {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Employee not found.', 404);
  }

  const result = await prisma.$transaction(async (tx) => {
    // Update user-level fields
    const userUpdate: any = {};
    if (data.name !== undefined) userUpdate.name = data.name;
    if (data.role !== undefined) userUpdate.role = data.role;

    if (Object.keys(userUpdate).length > 0) {
      await tx.user.update({ where: { id }, data: userUpdate });
    }

    // Update profile-level fields
    const profileUpdate: any = {};
    if (data.department !== undefined) profileUpdate.departmentId = data.department;
    if (data.designation !== undefined) profileUpdate.designation = data.designation;
    if (data.phone !== undefined) profileUpdate.phone = data.phone;
    if (data.address !== undefined) profileUpdate.address = data.address;
    if (data.profileImage !== undefined) profileUpdate.profileImage = data.profileImage;
    if (data.status !== undefined) profileUpdate.status = data.status;
    if (data.joiningDate !== undefined) profileUpdate.joiningDate = new Date(data.joiningDate);

    if (Object.keys(profileUpdate).length > 0) {
      await tx.employeeProfile.update({
        where: { userId: id },
        data: profileUpdate,
      });
    }

    return tx.user.findUnique({
      where: { id },
      select: userSelectWithoutPassword,
    });
  });

  return result;
};

/**
 * Delete an employee — ADMIN only.
 * Cascading delete removes profile, attendance, leaves, and payroll.
 */
export const deleteEmployee = async (id: string) => {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Employee not found.', 404);
  }

  await prisma.user.delete({ where: { id } });
  return { message: 'Employee deleted successfully.' };
};

/**
 * Get the logged-in employee's own profile.
 */
export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelectWithoutPassword,
  });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

/**
 * Employee updates their own profile — limited to phone, address, profileImage.
 */
export const updateMyProfile = async (userId: string, data: UpdateEmployeeSelfInput) => {
  const profileUpdate: any = {};
  if (data.phone !== undefined) profileUpdate.phone = data.phone;
  if (data.address !== undefined) profileUpdate.address = data.address;
  if (data.profileImage !== undefined) profileUpdate.profileImage = data.profileImage;

  await prisma.employeeProfile.update({
    where: { userId },
    data: profileUpdate,
  });

  return prisma.user.findUnique({
    where: { id: userId },
    select: userSelectWithoutPassword,
  });
};
