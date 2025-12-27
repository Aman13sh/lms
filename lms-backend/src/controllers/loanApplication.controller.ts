// src/controllers/loanApplication.controller.ts
// Controller for loan application management

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Get all loan applications (for admin/officer) or user's own applications (for customer)
export const getLoanApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let applications;

    if (role === 'CUSTOMER') {
      // Get customer's own applications
      const customer = await prisma.customer.findUnique({
        where: { userId },
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      applications = await prisma.loanApplication.findMany({
        where: { customerId: customer.id },
        include: {
          loanProduct: true,
          customer: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Admin/Officer can see all applications
      applications = await prisma.loanApplication.findMany({
        include: {
          loanProduct: true,
          customer: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Format the response
    const formattedApplications = applications.map(app => ({
      id: app.id,
      applicationNumber: app.applicationNumber,
      customerName: `${app.customer.firstName} ${app.customer.lastName}`,
      customerEmail: app.customer.user.email,
      productName: app.loanProduct.productName,
      requestedAmount: app.requestedAmount,
      approvedAmount: app.approvedAmount,
      status: app.status,
      submittedDate: app.createdAt,
      ltvRatio: '60%', // Default LTV
      tenure: `${app.tenureMonths} months`,
      interestRate: app.interestRate?.toNumber() || null,
      monthlyEmi: null, // Will be calculated when loan is created
      reviewNotes: app.rejectionReason,
    }));

    res.json({
      success: true,
      data: formattedApplications,
    });
  } catch (error) {
    console.error('Error fetching loan applications:', error);
    res.status(500).json({ error: 'Failed to fetch loan applications' });
  }
};

// Create a new loan application
export const createLoanApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      loanProductId,
      requestedAmount,
      tenure,
      purposeOfLoan,
      monthlyIncome,
      existingEMI,
      collateralIds,
    } = req.body;

    // Get customer profile
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    // Get loan product details
    const loanProduct = await prisma.loanProduct.findUnique({
      where: { id: loanProductId },
    });

    if (!loanProduct) {
      return res.status(404).json({ error: 'Loan product not found' });
    }

    // Calculate EMI
    const principal = requestedAmount;
    const rate = loanProduct.interestRate.toNumber() / 12 / 100;
    const n = tenure;
    const emi = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);

    // Generate application number
    const applicationNumber = `APP${Date.now().toString().slice(-10)}`;

    // Create loan application
    const application = await prisma.loanApplication.create({
      data: {
        id: uuidv4(),
        applicationNumber,
        customerId: customer.id,
        loanProductId,
        requestedAmount,
        tenureMonths: tenure,
        interestRate: loanProduct.interestRate,
        purposeOfLoan,
        status: 'DRAFT',
        applicationData: {
          purposeOfLoan,
          monthlyIncome,
          existingEMI,
          calculatedEmi: Math.round(emi),
        },
        createdById: userId,
      },
      include: {
        loanProduct: true,
        customer: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Loan application created successfully',
      data: application,
    });
  } catch (error) {
    console.error('Error creating loan application:', error);
    res.status(500).json({ error: 'Failed to create loan application' });
  }
};

// Update loan application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes, approvedAmount } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;

    // Only admin/officer can update status
    if (role === 'CUSTOMER') {
      return res.status(403).json({ error: 'Unauthorized to update application status' });
    }

    const application = await prisma.loanApplication.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? reviewNotes : undefined,
        approvedAmount: approvedAmount || undefined,
        reviewedById: userId,
        reviewedAt: new Date(),
        approvedById: status === 'APPROVED' ? userId : undefined,
        approvedAt: status === 'APPROVED' ? new Date() : undefined,
        rejectedAt: status === 'REJECTED' ? new Date() : undefined,
      },
    });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

// Get a single loan application by ID
export const getLoanApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const application = await prisma.loanApplication.findUnique({
      where: { id },
      include: {
        loanProduct: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    // If customer, verify they own this application
    if (role === 'CUSTOMER') {
      const customer = await prisma.customer.findUnique({
        where: { userId },
      });

      if (!customer || application.customerId !== customer.id) {
        return res.status(403).json({ error: 'Unauthorized to view this application' });
      }
    }

    // Get application data (stored as JSON)
    const applicationData = application.applicationData as Record<string, unknown> || {};

    // Format the response to match frontend expectations
    const formattedApplication = {
      id: application.id,
      applicationNumber: application.applicationNumber,
      status: application.status,
      requestedAmount: application.requestedAmount,
      tenure: application.tenureMonths,
      purpose: applicationData.purposeOfLoan || application.purposeOfLoan || 'Not specified',
      employmentType: applicationData.employmentType || 'Not specified',
      monthlyIncome: applicationData.monthlyIncome || 0,
      existingEMI: applicationData.existingEMI || 0,
      submittedDate: application.createdAt,
      customer: {
        firstName: application.customer.firstName,
        lastName: application.customer.lastName,
        email: application.customer.user.email,
        phone: application.customer.phoneNumber || 'Not provided',
        pan: application.customer.panNumber || 'Not provided',
        aadhaar: application.customer.aadhaarNumber || 'Not provided',
      },
      loanProduct: {
        name: application.loanProduct.productName,
        interestRate: application.loanProduct.interestRate.toNumber(),
        processingFee: application.loanProduct.processingFeePercentage?.toNumber() || 0,
        minAmount: application.loanProduct.minAmount.toNumber(),
        maxAmount: application.loanProduct.maxAmount.toNumber(),
      },
      reviewNotes: application.rejectionReason,
      rejectionReason: application.rejectionReason,
    };

    res.json({
      success: true,
      data: formattedApplication,
    });
  } catch (error) {
    console.error('Error fetching loan application details:', error);
    res.status(500).json({ error: 'Failed to fetch loan application details' });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role === 'CUSTOMER') {
      // Customer-specific stats
      const customer = await prisma.customer.findUnique({
        where: { userId },
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const [applications, activeLoans] = await Promise.all([
        prisma.loanApplication.count({
          where: { customerId: customer.id },
        }),
        prisma.loan.count({
          where: {
            customerId: customer.id,
            status: 'ACTIVE',
          },
        }),
      ]);

      const totalOutstanding = await prisma.loan.aggregate({
        where: {
          customerId: customer.id,
          status: 'ACTIVE',
        },
        _sum: {
          outstandingPrincipal: true,
          outstandingInterest: true,
        },
      });

      const totalOutstandingAmount =
        (totalOutstanding._sum.outstandingPrincipal?.toNumber() || 0) +
        (totalOutstanding._sum.outstandingInterest?.toNumber() || 0);

      res.json({
        success: true,
        data: {
          totalApplications: applications,
          activeLoans,
          totalOutstanding: totalOutstandingAmount,
          creditScore: 750, // Default credit score
        },
      });
    } else {
      // Admin/Officer stats
      const [totalApplications, activeLoans, totalCustomers] = await Promise.all([
        prisma.loanApplication.count(),
        prisma.loan.count({
          where: { status: 'ACTIVE' },
        }),
        prisma.customer.count(),
      ]);

      const totalCollateral = await prisma.loanCollateral.aggregate({
        _sum: {
          pledgeValue: true,
        },
      });

      const totalOutstanding = await prisma.loan.aggregate({
        where: { status: 'ACTIVE' },
        _sum: {
          outstandingPrincipal: true,
          outstandingInterest: true,
        },
      });

      const totalOutstandingAmount =
        (totalOutstanding._sum.outstandingPrincipal?.toNumber() || 0) +
        (totalOutstanding._sum.outstandingInterest?.toNumber() || 0);

      res.json({
        success: true,
        data: {
          totalApplications,
          activeLoans,
          totalCustomers,
          totalCollateral: totalCollateral._sum.pledgeValue?.toNumber() || 0,
          totalOutstanding: totalOutstandingAmount,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};