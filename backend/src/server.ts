import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { SolanaService } from './services/solanaService';
import { WebSocketService } from './services/websocketService';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { createTokenRouter } from './routes/tokenRoutes';
import { createPoolRouter } from './routes/poolRoutes';
import { createWhaleRouter } from './routes/whaleRoutes';
import { createBlockRouter } from './routes/blockRoutes';
import { ApiResponse } from './types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Initialize services
const solanaService = new SolanaService(SOLANA_RPC_URL);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: Date.now(),
      uptime: process.uptime(),
    },
    timestamp: Date.now(),
  };
  res.json(response);
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Route handlers
app.use('/api/tokens', createTokenRouter(solanaService));
app.use('/api/pools', createPoolRouter(solanaService));
app.use('/api/whales', createWhaleRouter(solanaService));
app.use('/api/blocks', createBlockRouter(solanaService));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: Date.now(),
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket service
const wsService = new WebSocketService(server, solanaService);

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║   Solana Analytics Platform - Backend Server          ║
╚════════════════════════════════════════════════════════╝

🚀 Server running on port ${PORT}
🔗 RPC Endpoint: ${SOLANA_RPC_URL}
🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}
📡 WebSocket available at: ws://localhost:${PORT}/ws

API Endpoints:
  GET  /api/health              - Health check
  GET  /api/tokens/:address     - Get token information
  GET  /api/pools/:address      - Get pool information
  GET  /api/whales/address/:address - Get whale transactions
  GET  /api/blocks/recent       - Get recent blocks

Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    wsService.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    wsService.close();
    process.exit(0);
  });
});

export default app;
