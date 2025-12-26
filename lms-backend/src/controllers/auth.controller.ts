// src/controllers/auth.controller.ts
// Authentication controller

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { generateCustomerCode } from '../utils/helpers';
import { encrypt } from '../utils/encryption';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Generate JWT tokens
const generateTokens = (userId: string, email: string, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as any
  );

  const refreshToken = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as any
  );

  return { accessToken, refreshToken };
};

// Register new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      panNumber,
      aadhaarNumber,
      address,
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists with this email', 409, 'USER_EXISTS');
    }

    // Check if PAN already exists
    const existingPAN = await prisma.customer.findUnique({
      where: { panNumber: panNumber.toUpperCase() },
    });

    if (existingPAN) {
      throw new AppError('PAN number already registered', 409, 'PAN_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Encrypt Aadhaar
    const encryptedAadhaar = encrypt(aadhaarNumber);

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: 'CUSTOMER',
        },
      });

      // Create customer profile
      const customer = await tx.customer.create({
        data: {
          userId: user.id,
          customerCode: generateCustomerCode(),
          firstName,
          lastName,
          email,
          phoneNumber,
          dateOfBirth: new Date(dateOfBirth),
          panNumber: panNumber.toUpperCase(),
          aadhaarNumber: encryptedAadhaar,
          address,
          kycStatus: 'PENDING',
        },
      });

      return { user, customer };
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      result.user.id,
      result.user.email,
      result.user.role
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        customer: {
          id: result.customer.id,
          customerCode: result.customer.customerCode,
          firstName: result.customer.firstName,
          lastName: result.customer.lastName,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        customer: {
          select: {
            id: true,
            customerCode: true,
            firstName: true,
            lastName: true,
            kycStatus: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new AppError('Your account is inactive', 401, 'ACCOUNT_INACTIVE');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.email,
      user.role
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          ...(user.customer && {
            customer: {
              id: user.customer.id,
              customerCode: user.customer.customerCode,
              firstName: user.customer.firstName,
              lastName: user.customer.lastName,
              kycStatus: user.customer.kycStatus,
            },
          }),
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400, 'NO_REFRESH_TOKEN');
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Generate new tokens
    const tokens = generateTokens(user.id, user.email, user.role);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN'));
    } else {
      next(error);
    }
  }
};

// Change password
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user!.id;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid old password', 401, 'INVALID_OLD_PASSWORD');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        customer: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout (optional - for token blacklisting)
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // In a production app, you might want to blacklist the token here
    // For now, we'll just return a success response
    logger.info(`User logged out: ${req.user!.email}`);

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};