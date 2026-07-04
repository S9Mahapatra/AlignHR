import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generatePayrollSchema } from '../validations/payroll.validation';
import * as payrollController from '../controllers/payroll.controller';

const router = Router();

/** GET /api/payroll — List all payroll records (ADMIN, HR only) */
router.get('/', authenticate, authorize('ADMIN', 'HR'), payrollController.getAll);

/** GET /api/payroll/my — Get own payroll records */
router.get('/my', authenticate, payrollController.getMyPayroll);

/** POST /api/payroll/generate — Generate payroll (ADMIN only) */
router.post(
  '/generate',
  authenticate,
  authorize('ADMIN'),
  validate(generatePayrollSchema),
  payrollController.generate,
);

/** PUT /api/payroll/:id/pay — Mark payroll as paid (ADMIN only) */
router.put('/:id/pay', authenticate, authorize('ADMIN'), payrollController.markAsPaid);

export default router;
