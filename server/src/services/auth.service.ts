import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validations/auth.validation';

/**
 * Register a new user and create a corresponding employee profile.
 * Only EMPLOYEE and HR roles are allowed via public registration.
 * ADMIN accounts should only be created through seed data.
 */
export const register = async (data: RegisterInput) => {
  // Check if user already exists by email or employeeId
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { employeeId: data.employeeId },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new AppError('A user with this email already exists.', 409);
    }
    throw new AppError('A user with this employee ID already exists.', 409);
  }

  const hashedPassword = await hashPassword(data.password);

  // Create user and employee profile in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name,
        employeeId: data.employeeId,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'EMPLOYEE',
      },
    });

    let deptId = null;
    if (data.department) {
      let dept = await tx.department.findUnique({
        where: { name: data.department }
      });
      if (!dept) {
        dept = await tx.department.create({
          data: { name: data.department }
        });
      }
      deptId = dept.id;
    }

    const profile = await tx.employeeProfile.create({
      data: {
        userId: user.id,
        phone: data.phone,
        address: data.address,
        departmentId: deptId,
        designation: data.designation,
      },
    });

    return { user, profile };
  });

  const token = generateToken({
    id: result.user.id,
    name: result.user.name,
    employeeId: result.user.employeeId,
    email: result.user.email,
    role: result.user.role,
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = result.user;

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Authenticate a user by email and password.
 */
export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    employeeId: user.employeeId,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Get the currently authenticated user's profile.
 * Password hash is never returned.
 */
export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
