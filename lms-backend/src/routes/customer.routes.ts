// src/routes/customer.routes.ts
// Customer management routes

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Placeholder routes - to be implemented
router.get('/', authenticate, authorize('ADMIN', 'LOAN_OFFICER'), (req, res) => {
  res.json({ message: 'Get all customers' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get customer by id' });
});

router.put('/:id', authenticate, (req, res) => {
  res.json({ message: 'Update customer profile' });
});

router.post('/:id/kyc', authenticate, (req, res) => {
  res.json({ message: 'Submit KYC documents' });
});

router.post('/:id/verify-kyc', authenticate, authorize('LOAN_OFFICER', 'ADMIN'), (req, res) => {
  res.json({ message: 'Verify KYC' });
});

export default router;