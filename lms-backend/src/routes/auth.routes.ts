// src/routes/auth.routes.ts
// Authentication routes

import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  changePassword,
  getProfile,
  logout,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validateRequest';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), refreshToken);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.post('/change-password', authenticate, validateRequest(changePasswordSchema), changePassword);
router.post('/logout', authenticate, logout);

export default router;