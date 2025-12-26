// src/routes/loanApplication.routes.ts
// Routes for loan application endpoints

import { Router } from 'express';
import {
  getLoanApplications,
  createLoanApplication,
  updateApplicationStatus,
  getDashboardStats,
} from '../controllers/loanApplication.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard stats (accessible to all authenticated users)
router.get('/dashboard/stats', getDashboardStats);

// Get all applications (filtered by role)
router.get('/', getLoanApplications);

// Create new application (customers only)
router.post('/', createLoanApplication);

// Update application status (admin/officer only)
router.patch('/:id/status', authorize('LOAN_OFFICER', 'ADMIN'), updateApplicationStatus);

// Legacy routes for compatibility
router.post('/:id/approve', authorize('LOAN_OFFICER', 'ADMIN'), async (req, res) => {
  req.body.status = 'APPROVED';
  return updateApplicationStatus(req, res);
});

router.post('/:id/reject', authorize('LOAN_OFFICER', 'ADMIN'), async (req, res) => {
  req.body.status = 'REJECTED';
  return updateApplicationStatus(req, res);
});

export default router;