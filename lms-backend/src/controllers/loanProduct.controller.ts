// src/controllers/loanProduct.controller.ts
// Loan product controller

import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Get all loan products
export const getAllLoanProducts = async (req: Request, res: Response) => {
  try {
    const loanProducts = await prisma.loanProduct.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: {
        productName: 'asc'
      }
    });

    res.json({
      success: true,
      data: loanProducts,
      message: 'Loan products fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching loan products:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch loan products'
      }
    });
  }
};

// Get loan product by ID
export const getLoanProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const loanProduct = await prisma.loanProduct.findUnique({
      where: { id }
    });

    if (!loanProduct) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Loan product not found'
        }
      });
      return;
    }

    res.json({
      success: true,
      data: loanProduct,
      message: 'Loan product fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching loan product:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch loan product'
      }
    });
  }
};

// Create loan product (Admin only)
export const createLoanProduct = async (req: Request, res: Response) => {
  try {
    const {
      productName,
      productCode,
      description,
      minAmount,
      maxAmount,
      minTenureMonths,
      maxTenureMonths,
      interestRate,
      processingFeePercentage,
      ltvRatio,
      eligibleMfCategories
    } = req.body;

    const loanProduct = await prisma.loanProduct.create({
      data: {
        productName,
        productCode,
        description,
        minAmount,
        maxAmount,
        minTenureMonths,
        maxTenureMonths,
        interestRate,
        processingFeePercentage,
        ltvRatio,
        eligibleMfCategories: eligibleMfCategories || ['MUTUAL_FUNDS'],
        status: 'ACTIVE'
      }
    });

    res.status(201).json({
      success: true,
      data: loanProduct,
      message: 'Loan product created successfully'
    });
  } catch (error) {
    console.error('Error creating loan product:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json({
          success: false,
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'Loan product with this code already exists'
          }
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create loan product'
      }
    });
  }
};

// Update loan product (Admin only)
export const updateLoanProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const loanProduct = await prisma.loanProduct.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: loanProduct,
      message: 'Loan product updated successfully'
    });
  } catch (error) {
    console.error('Error updating loan product:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Loan product not found'
          }
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update loan product'
      }
    });
  }
};

// Delete loan product (Admin only)
export const deleteLoanProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete by updating status
    await prisma.loanProduct.update({
      where: { id },
      data: { status: 'INACTIVE' }
    });

    res.json({
      success: true,
      message: 'Loan product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting loan product:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Loan product not found'
          }
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete loan product'
      }
    });
  }
};