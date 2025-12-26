// src/utils/helpers.ts
// General helper functions

import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

// Generate unique application number
export const generateApplicationNumber = (): string => {
  const prefix = 'APP';
  const date = dayjs().format('YYYYMM');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}${date}${random}`;
};

// Generate unique loan number
export const generateLoanNumber = (): string => {
  const prefix = 'LN';
  const date = dayjs().format('YYYYMM');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}${date}${random}`;
};

// Generate unique customer code
export const generateCustomerCode = (): string => {
  const prefix = 'CUST';
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${random}`;
};

// Generate unique transaction reference
export const generateTransactionRef = (): string => {
  const prefix = 'TXN';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Generate API key for partners
export const generateApiKey = (): string => {
  return `lms_${uuidv4().replace(/-/g, '')}`;
};

// Calculate EMI amount
export const calculateEMI = (
  principal: number,
  ratePerAnnum: number,
  tenureMonths: number
): number => {
  const monthlyRate = ratePerAnnum / 12 / 100;

  if (monthlyRate === 0) {
    return principal / tenureMonths;
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi * 100) / 100;
};

// Calculate total interest
export const calculateTotalInterest = (
  principal: number,
  ratePerAnnum: number,
  tenureMonths: number
): number => {
  const emi = calculateEMI(principal, ratePerAnnum, tenureMonths);
  const totalAmount = emi * tenureMonths;
  return Math.round((totalAmount - principal) * 100) / 100;
};

// Calculate LTV ratio
export const calculateLTV = (loanAmount: number, collateralValue: number): number => {
  if (collateralValue === 0) return 0;
  return Math.round((loanAmount / collateralValue) * 10000) / 100;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

// Validate PAN format
export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

// Validate Aadhaar format (basic check)
export const isValidAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(aadhaar);
};

// Validate phone number
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Parse and format date
export const formatDate = (date: Date | string, format: string = 'DD/MM/YYYY'): string => {
  return dayjs(date).format(format);
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: Date | string): number => {
  return dayjs().diff(dayjs(dateOfBirth), 'years');
};

// Check if age is eligible (minimum 18 years)
export const isEligibleAge = (dateOfBirth: Date | string, minAge: number = 18): boolean => {
  return calculateAge(dateOfBirth) >= minAge;
};

// Generate OTP
export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Paginate results
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const getPaginationParams = (params: PaginationParams) => {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
};

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};