// src/routes/loan.routes.ts
// Active loan routes

import { Router } from 'express';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Placeholder routes - to be implemented
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'Get all loans' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get loan by id' });
});

router.get('/:id/emi-schedule', authenticate, (req, res) => {
  res.json({ message: 'Get EMI schedule' });
});

router.post('/:id/payment', authenticate, (req, res) => {
  res.json({ message: 'Make EMI payment' });
});

router.post('/:id/prepayment', authenticate, (req, res) => {
  res.json({ message: 'Make prepayment' });
});

router.get('/:id/statement', authenticate, (req, res) => {
  res.json({ message: 'Get loan statement' });
});

export default router;