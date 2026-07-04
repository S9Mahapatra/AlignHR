import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as departmentController from '../controllers/department.controller';

const router = Router();

router.get('/', authenticate, departmentController.getAll);

export default router;
