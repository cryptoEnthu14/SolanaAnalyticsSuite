import { Router, Request, Response } from 'express';
import { SolanaService } from '../services/solanaService';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { strictLimiter } from '../middleware/rateLimiter';

export const createWhaleRouter = (solanaService: SolanaService): Router => {
  const router = Router();

  // Get transactions for a specific address
  router.get(
    '/address/:address',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const { address } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!address) {
        throw new AppError(400, 'Wallet address is required');
      }

      const transactions = await solanaService.getTransactionsByAddress(
        address,
        limit
      );

      const response: ApiResponse = {
        success: true,
        data: {
          address,
          transactions,
          count: transactions.length,
        },
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  // Get whale transactions (placeholder)
  router.get(
    '/transactions',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 20;

      // Placeholder response
      const response: ApiResponse = {
        success: true,
        data: {
          transactions: [],
          count: 0,
        },
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  // Get wallet balance
  router.get(
    '/balance/:address',
    strictLimiter,
    asyncHandler(async (req: Request, res: Response) => {
      const { address } = req.params;

      if (!address) {
        throw new AppError(400, 'Wallet address is required');
      }

      const balance = await solanaService.getBalance(address);

      const response: ApiResponse = {
        success: true,
        data: {
          address,
          balance,
          balanceSOL: balance,
        },
        timestamp: Date.now(),
      };

      res.json(response);
    })
  );

  return router;
};
