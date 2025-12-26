// src/middlewares/auth.ts
// Authentication and authorization middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';
import { AppError } from './errorHandler';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

// Verify JWT token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('No authentication token provided', 401, 'NO_TOKEN');
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError('User account is inactive', 401, 'ACCOUNT_INACTIVE');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
    } else {
      next(new AppError('Authentication failed', 401, 'AUTH_FAILED'));
    }
  }
};

// Check user role
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401, 'NOT_AUTHENTICATED'));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn({
        message: 'Unauthorized access attempt',
        user: req.user.email,
        requiredRoles: roles,
        userRole: req.user.role,
        path: req.originalUrl,
      });

      return next(
        new AppError(
          'You do not have permission to access this resource',
          403,
          'INSUFFICIENT_PERMISSIONS'
        )
      );
    }

    next();
  };
};

// API Partner authentication
export const authenticatePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new AppError('API key is required', 401, 'NO_API_KEY');
    }

    // Find partner by API key
    const partner = await prisma.apiPartner.findUnique({
      where: { apiKey },
    });

    if (!partner) {
      throw new AppError('Invalid API key', 401, 'INVALID_API_KEY');
    }

    if (partner.status !== 'ACTIVE') {
      throw new AppError('Partner account is inactive', 401, 'PARTNER_INACTIVE');
    }

    // Check IP whitelist if configured
    if (partner.ipWhitelist.length > 0) {
      const clientIp = req.ip || req.connection.remoteAddress || '';
      if (!partner.ipWhitelist.includes(clientIp)) {
        logger.warn({
          message: 'API access from non-whitelisted IP',
          partner: partner.partnerName,
          ip: clientIp,
          whitelistedIps: partner.ipWhitelist,
        });
        throw new AppError('Access denied from this IP address', 403, 'IP_NOT_WHITELISTED');
      }
    }

    // Update last activity
    await prisma.apiPartner.update({
      where: { id: partner.id },
      data: { lastActivityAt: new Date() },
    });

    // Attach partner info to request
    (req as any).partner = {
      id: partner.id,
      code: partner.partnerCode,
      name: partner.partnerName,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Partner authentication failed', 401, 'PARTNER_AUTH_FAILED'));
    }
  }
};

// Optional authentication (for public routes that may have authenticated users)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, status: true },
      });

      if (user && user.status === 'ACTIVE') {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    }
  } catch (error) {
    // Ignore errors in optional auth
    logger.debug('Optional auth failed, continuing as guest', error);
  }

  next();
};