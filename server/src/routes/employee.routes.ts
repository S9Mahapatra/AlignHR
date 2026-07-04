import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateEmployeeAdminSchema, updateEmployeeSelfSchema } from '../validations/employee.validation';
import * as employeeController from '../controllers/employee.controller';

const router = Router();

// ─── Employee self-routes (must be before /:id to avoid param conflict) ──────
router.get('/me/profile', authenticate, employeeController.getMyProfile);
router.patch('/me/profile', authenticate, validate(updateEmployeeSelfSchema), employeeController.updateMyProfile);

// ─── Admin/HR routes ─────────────────────────────────────────────────────────
router.post('/', authenticate, requireRole('ADMIN', 'HR'), employeeController.create);
router.get('/', authenticate, requireRole('ADMIN', 'HR'), employeeController.getAll);
router.get('/:id', authenticate, requireRole('ADMIN', 'HR'), employeeController.getById);
router.put('/:id', authenticate, requireRole('ADMIN', 'HR'), employeeController.update);
router.patch('/:id', authenticate, requireRole('ADMIN', 'HR'), validate(updateEmployeeAdminSchema), employeeController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), employeeController.remove);

export default router;
