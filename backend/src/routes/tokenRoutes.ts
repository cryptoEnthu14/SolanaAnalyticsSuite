import { Router, Request, Response } from 'express';
import { SolanaService } from '../services/solanaService';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { strictLimiter } from '../middleware/rateLimiter';

export const createTokenRouter = (solanaService: SolanaService): Router => {
  const router = Router();

  // Get token information
  router.get(
    '/:address',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const { address } = req.params;

      if (!address) {
        throw new AppError(400, 'Token address is required');
      }

      const tokenInfo = await solanaService.getTokenInfo(address);

      if (!tokenInfo) {
        throw new AppError(404, 'Token not found');
      }

      const response: ApiResponse = {
        success: true,
        data: tokenInfo,
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  // Get token holders (placeholder)
  router.get(
    '/:address/holders',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const { address } = req.params;

      if (!address) {
        throw new AppError(400, 'Token address is required');
      }

      // Placeholder response
      const response: ApiResponse = {
        success: true,
        data: {
          holders: [],
          totalHolders: 0,
        },
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  return router;
};
