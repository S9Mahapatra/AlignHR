import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as attendanceController from '../controllers/attendance.controller';

const router = Router();

/** GET /api/attendance — List all attendance records (ADMIN, HR only) */
router.get('/', authenticate, authorize('ADMIN', 'HR'), attendanceController.getAll);

/** GET /api/attendance/my — Get own attendance records */
router.get('/my', authenticate, attendanceController.getMyAttendance);

/** GET /api/attendance/today — Get today's attendance status */
router.get('/today', authenticate, attendanceController.getTodayStatus);

/** POST /api/attendance/check-in — Check in for today */
router.post('/check-in', authenticate, attendanceController.checkIn);

/** POST /api/attendance/check-out — Check out for today */
router.post('/check-out', authenticate, attendanceController.checkOut);

export default router;
