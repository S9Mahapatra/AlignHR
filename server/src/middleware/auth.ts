import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../config/database';
import { AppError } from './errorHandler';

/**
 * Extend the Express Request interface to carry authenticated user data.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
        employeeId?: string;
      };
    }
  }
}

/**
 * Authentication middleware.
 * Extracts the Bearer token from the Authorization header, verifies it,
 * looks up the user in the database, and attaches user info to `req.user`.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please provide a valid token.', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token) as {
      userId: string;
      role: string;
      employeeId?: string;
    };

    // Verify the user still exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { employee: { select: { id: true } } },
    });

    if (!user) {
      throw new AppError('User associated with this token no longer exists.', 401);
    }

    req.user = {
      userId: user.id,
      role: user.role,
      employeeId: user.employee?.id,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token.', 401));
    }
  }
};

/**
 * Authorization middleware factory.
 * Restricts access to users whose role is one of the supplied `roles`.
 */
export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      );
    }

    next();
  };
};
