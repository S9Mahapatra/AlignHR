import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { sendError } from '../utils/response';

/**
 * Authorization middleware factory.
 * Restricts access to users whose role is one of the supplied `roles`.
 *
 * Usage: requireRole('ADMIN', 'HR')
 */
export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (!roles.includes(req.user.role as Role)) {
      sendError(res, 'You do not have permission to perform this action.', 403);
      return;
    }

    next();
  };
};
