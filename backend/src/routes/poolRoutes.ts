import { Router, Request, Response } from 'express';
import { SolanaService } from '../services/solanaService';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { strictLimiter } from '../middleware/rateLimiter';

export const createPoolRouter = (solanaService: SolanaService): Router => {
  const router = Router();

  // Get pool information
  router.get(
    '/:address',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const { address } = req.params;

      if (!address) {
        throw new AppError(400, 'Pool address is required');
      }

      const poolInfo = await solanaService.getPoolInfo(address);

      if (!poolInfo) {
        throw new AppError(404, 'Pool not found');
      }

      const response: ApiResponse = {
        success: true,
        data: poolInfo,
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  // Get all pools (placeholder)
  router.get(
    '/',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      // Placeholder response
      const response: ApiResponse = {
        success: true,
        data: {
          pools: [],
          total: 0,
        },
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  return router;
};
