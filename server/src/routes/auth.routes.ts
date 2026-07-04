import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import * as authController from '../controllers/auth.controller';

const router = Router();

/** POST /api/auth/login — Authenticate user and return token */
router.post('/login', validate(loginSchema), authController.login);

/** POST /api/auth/register — Register new user account */
router.post('/register', validate(registerSchema), authController.register);

/** GET /api/auth/me — Get current user profile (requires auth) */
router.get('/me', authenticate, authController.getMe);

export default router;
