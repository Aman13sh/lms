// src/routes/loanProduct.routes.ts
// Loan product routes

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  getAllLoanProducts,
  getLoanProductById,
  createLoanProduct,
  updateLoanProduct,
  deleteLoanProduct
} from '../controllers/loanProduct.controller';

const router = Router();

// Public routes (no authentication required for viewing products)
router.get('/', getAllLoanProducts);
router.get('/:id', getLoanProductById);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), createLoanProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateLoanProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteLoanProduct);

export default router;