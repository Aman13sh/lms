// src/middlewares/requestLogger.ts
// Request logging middleware with response time tracking

import { Request, Response, NextFunction } from 'express';
import { logApiRequest } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log request received
  const originalSend = res.send;
  res.send = function (data) {
    const responseTime = Date.now() - startTime;

    // Log the request with response time
    logApiRequest(req, res, responseTime);

    // Add response time header
    res.setHeader('X-Response-Time', `${responseTime}ms`);

    return originalSend.call(this, data);
  };

  next();
};