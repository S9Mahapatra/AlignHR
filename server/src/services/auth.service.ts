import { Role } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validations/auth.validation';

/**
 * Register a new user and create a corresponding employee profile.
 */
export const register = async (data: RegisterInput) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('A user with this email already exists.', 409);
  }

  const hashedPassword = await hashPassword(data.password);

  // Create user and employee in a transaction
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
      },
    });

    return { user, employee };
  });

  const token = generateToken({
    userId: result.user.id,
    role: result.user.role,
    employeeId: result.employee.id,
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = result.user;

  return {
    user: userWithoutPassword,
    employee: result.employee,
    token,
  };
};

/**
 * Authenticate a user by email and password.
 */
export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      employee: true,
    },
  });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
    employeeId: user.employee?.id,
  });

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Get the currently authenticated user's profile.
 */
export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      employee: {
        include: {
          department: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
