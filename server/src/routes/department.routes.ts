import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createDepartmentSchema, updateDepartmentSchema } from '../validations/department.validation';
import * as departmentController from '../controllers/department.controller';

const router = Router();

/** GET /api/departments — List all departments (any authenticated user) */
router.get('/', authenticate, departmentController.getAll);

/** GET /api/departments/:id — Get department by ID (any authenticated user) */
router.get('/:id', authenticate, departmentController.getById);

/** POST /api/departments — Create department (ADMIN, HR only) */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'HR'),
  validate(createDepartmentSchema),
  departmentController.create,
);

/** PUT /api/departments/:id — Update department (ADMIN, HR only) */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'HR'),
  validate(updateDepartmentSchema),
  departmentController.update,
);

/** DELETE /api/departments/:id — Delete department (ADMIN only) */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  departmentController.remove,
);

export default router;
