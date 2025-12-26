// src/routes/partnerApi.routes.ts
// Partner API routes for fintech integration

import { Router } from 'express';
import { authenticatePartner } from '../middlewares/auth';

const router = Router();

// Partner API routes - Very Important for fintech integration
router.post('/auth/token', (req, res) => {
  res.json({ message: 'Generate partner access token' });
});

// Protected partner routes
router.post('/applications/create', authenticatePartner, (req, res) => {
  res.json({ message: 'Create loan application via API' });
});

router.get('/applications/:applicationId/status', authenticatePartner, (req, res) => {
  res.json({ message: 'Check application status' });
});

router.post('/applications/:applicationId/documents', authenticatePartner, (req, res) => {
  res.json({ message: 'Upload documents' });
});

router.get('/loan-products', authenticatePartner, (req, res) => {
  res.json({ message: 'Get available loan products' });
});

router.post('/webhooks/register', authenticatePartner, (req, res) => {
  res.json({ message: 'Register webhook endpoint' });
});

export default router;