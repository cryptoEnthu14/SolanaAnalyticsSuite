import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types';

export const requestLogger = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || Date.now());
    const log = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(log));
  });

  next();
};
