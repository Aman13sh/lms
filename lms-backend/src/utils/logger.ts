// src/utils/logger.ts
// Pino logger configuration with human-readable API timing

import pino from 'pino';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logDir = process.env.LOG_DIR || './logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Format duration in human-readable format
export const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else {
    return `${(ms / 60000).toFixed(2)}min`;
  }
};

// Create logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      // Console output with pretty printing in development
      {
        target: 'pino-pretty',
        level: process.env.LOG_LEVEL || 'info',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: '{msg}'
        }
      },
      // File output for production
      {
        target: 'pino/file',
        level: 'info',
        options: {
          destination: path.join(logDir, 'app.log'),
          mkdir: true
        }
      },
      // Error file output
      {
        target: 'pino/file',
        level: 'error',
        options: {
          destination: path.join(logDir, 'error.log'),
          mkdir: true
        }
      }
    ]
  },
  base: {
    pid: process.pid,
    hostname: process.env.NODE_ENV === 'production' ? undefined : undefined
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        host: bindings.hostname,
        node_version: process.version,
      };
    },
  },
});

// Create child logger for HTTP requests
export const httpLogger = logger.child({ context: 'HTTP' });

// Log API request details with timing
export const logApiRequest = (req: any, res: any, responseTime: number) => {
  const { method, url, ip, headers } = req;
  const { statusCode } = res;

  const logData = {
    method,
    url,
    statusCode,
    responseTime,
    responseTimeFormatted: formatDuration(responseTime),
    ip: ip || req.connection.remoteAddress,
    userAgent: headers['user-agent'],
  };

  // Color code based on response time
  if (responseTime < 100) {
    httpLogger.info(logData, `✅ ${method} ${url} - ${statusCode} - ${formatDuration(responseTime)}`);
  } else if (responseTime < 500) {
    httpLogger.warn(logData, `⚠️  ${method} ${url} - ${statusCode} - ${formatDuration(responseTime)}`);
  } else {
    httpLogger.error(logData, `🔴 ${method} ${url} - ${statusCode} - ${formatDuration(responseTime)}`);
  }
};

export default logger;