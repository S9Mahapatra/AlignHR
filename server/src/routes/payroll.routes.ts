import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createPayrollSchema, updatePayrollSchema } from '../validations/payroll.validation';
import * as payrollController from '../controllers/payroll.controller';

const router = Router();

// ─── Employee self-route ─────────────────────────────────────────────────────
router.get('/me', authenticate, payrollController.getMyPayroll);

// ─── Admin/HR routes ─────────────────────────────────────────────────────────
router.get('/', authenticate, requireRole('ADMIN', 'HR'), payrollController.getAll);
router.get('/:employeeId', authenticate, requireRole('ADMIN', 'HR'), payrollController.getByEmployeeId);
router.post('/', authenticate, requireRole('ADMIN', 'HR'), validate(createPayrollSchema), payrollController.create);
router.patch('/:id', authenticate, requireRole('ADMIN', 'HR'), validate(updatePayrollSchema), payrollController.update);

export default router;
