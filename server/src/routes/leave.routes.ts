import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createLeaveSchema } from '../validations/leave.validation';
import * as leaveController from '../controllers/leave.controller';

const router = Router();

// ─── Employee self-routes ────────────────────────────────────────────────────
router.post('/', authenticate, validate(createLeaveSchema), leaveController.create);
router.get('/me', authenticate, leaveController.getMyLeaves);

// ─── Admin/HR routes ─────────────────────────────────────────────────────────
router.get('/', authenticate, requireRole('ADMIN', 'HR'), leaveController.getAll);
router.patch('/:id/approve', authenticate, requireRole('ADMIN', 'HR'), leaveController.approve);
router.patch('/:id/reject', authenticate, requireRole('ADMIN', 'HR'), leaveController.reject);

export default router;
