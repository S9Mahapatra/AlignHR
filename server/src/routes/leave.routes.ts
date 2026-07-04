import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeaveSchema } from '../validations/leave.validation';
import * as leaveController from '../controllers/leave.controller';

const router = Router();

/** GET /api/leaves — List all leave requests (ADMIN, HR only) */
router.get('/', authenticate, authorize('ADMIN', 'HR'), leaveController.getAll);

/** GET /api/leaves/my — Get own leave requests */
router.get('/my', authenticate, leaveController.getMyLeaves);

/** GET /api/leaves/balance — Get own leave balance */
router.get('/balance', authenticate, leaveController.getLeaveBalance);

/** POST /api/leaves — Submit a leave request */
router.post('/', authenticate, validate(createLeaveSchema), leaveController.create);

/** PUT /api/leaves/:id/approve — Approve a leave request (ADMIN, HR only) */
router.put('/:id/approve', authenticate, authorize('ADMIN', 'HR'), leaveController.approve);

/** PUT /api/leaves/:id/reject — Reject a leave request (ADMIN, HR only) */
router.put('/:id/reject', authenticate, authorize('ADMIN', 'HR'), leaveController.reject);

export default router;
