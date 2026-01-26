import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:resetToken', validateResetPassword, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;