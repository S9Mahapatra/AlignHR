import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateAttendanceSchema } from '../validations/attendance.validation';
import * as attendanceController from '../controllers/attendance.controller';

const router = Router();

// ─── Employee self-routes ────────────────────────────────────────────────────
router.post('/check-in', authenticate, attendanceController.checkIn);
router.post('/check-out', authenticate, attendanceController.checkOut);
router.get('/me', authenticate, attendanceController.getMyAttendance);

// ─── Admin/HR routes ─────────────────────────────────────────────────────────
router.get('/', authenticate, requireRole('ADMIN', 'HR'), attendanceController.getAll);
router.patch('/:id', authenticate, requireRole('ADMIN', 'HR'), validate(updateAttendanceSchema), attendanceController.updateAttendance);

export default router;
