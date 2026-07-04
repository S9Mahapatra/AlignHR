import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createEmployeeSchema, updateEmployeeSchema } from '../validations/employee.validation';
import * as employeeController from '../controllers/employee.controller';

const router = Router();

/** GET /api/employees — List all employees (any authenticated user) */
router.get('/', authenticate, employeeController.getAll);

/** GET /api/employees/:id — Get employee by ID (any authenticated user) */
router.get('/:id', authenticate, employeeController.getById);

/** POST /api/employees — Create new employee (ADMIN, HR only) */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'HR'),
  validate(createEmployeeSchema),
  employeeController.create,
);

/** PUT /api/employees/:id — Update employee (ADMIN, HR only) */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'HR'),
  validate(updateEmployeeSchema),
  employeeController.update,
);

/** DELETE /api/employees/:id — Delete employee (ADMIN only) */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  employeeController.remove,
);

export default router;
