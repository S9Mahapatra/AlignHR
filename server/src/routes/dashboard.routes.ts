import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

/** GET /api/dashboard/stats — Get dashboard statistics (ADMIN, HR only) */
router.get('/stats', authenticate, authorize('ADMIN', 'HR'), dashboardController.getStats);

export default router;
