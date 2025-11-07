import { Router, Request, Response } from 'express';
import { SolanaService } from '../services/solanaService';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { strictLimiter } from '../middleware/rateLimiter';

export const createBlockRouter = (solanaService: SolanaService): Router => {
  const router = Router();

  // Get recent blocks
  router.get(
    '/recent',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 10;

      if (limit > 50) {
        throw new AppError(400, 'Limit cannot exceed 50 blocks');
      }

      const blocks = await solanaService.getRecentBlocks(limit);

      const response: ApiResponse = {
        success: true,
        data: {
          blocks,
          count: blocks.length,
        },
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  // Get block by slot (placeholder)
  router.get(
    '/:slot',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const { slot } = req.params;

      if (!slot) {
        throw new AppError(400, 'Block slot is required');
      }

      // Placeholder response
      const response: ApiResponse = {
        success: true,
        data: {
          slot: parseInt(slot),
          blockhash: 'placeholder',
          blockTime: Date.now(),
          transactionCount: 0,
        },
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  return router;
};
