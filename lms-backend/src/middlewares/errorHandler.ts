// src/middlewares/errorHandler.ts
// Global error handling middleware

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
  details?: any;

  constructor(message: string, statusCode: number, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err } as any;
  error.message = err.message;

  // Preserve AppError properties
  if (err instanceof AppError) {
    error.statusCode = err.statusCode;
    error.code = err.code;
    error.details = err.details;
  }

  // Log error
  logger.error({
    error: {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    },
  });

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      error.statusCode = 409;
      error.message = 'Duplicate field value';
      error.code = 'DUPLICATE_ENTRY';
    } else if (err.code === 'P2025') {
      error.statusCode = 404;
      error.message = 'Record not found';
      error.code = 'NOT_FOUND';
    } else if (err.code === 'P2003') {
      error.statusCode = 400;
      error.message = 'Invalid foreign key reference';
      error.code = 'INVALID_REFERENCE';
    }
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    error.statusCode = 400;
    error.message = 'Invalid data provided';
    error.code = 'VALIDATION_ERROR';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
    error.code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
    error.code = 'TOKEN_EXPIRED';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = 'Validation failed';
    error.code = 'VALIDATION_ERROR';
  }

  // Cast errors
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = 'Invalid data format';
    error.code = 'INVALID_FORMAT';
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'Internal server error',
      // Always include details for validation errors
      ...(error.code === 'VALIDATION_ERROR' && error.details && { details: error.details }),
      ...(process.env.NODE_ENV === 'development' && {
        details: error.details,
        stack: err.stack,
      }),
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};