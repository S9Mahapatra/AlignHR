import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../config/prisma';
import { sendError } from '../utils/response';

/**
 * Authentication middleware.
 * Extracts the Bearer token from the Authorization header, verifies it,
 * looks up the user in the database, and attaches user info to `req.user`.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication required. Please provide a valid token.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Verify the user still exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        employeeId: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      sendError(res, 'User associated with this token no longer exists.', 401);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token.', 401);
  }
};
