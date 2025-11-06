import { Request } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp: number;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}

export interface PoolInfo {
  address: string;
  tokenA: string;
  tokenB: string;
  liquidity: string;
  volume24h: string;
}

export interface WhaleTransaction {
  signature: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

export interface BlockInfo {
  slot: number;
  blockhash: string;
  blockTime: number;
  transactionCount: number;
}

export interface CustomRequest extends Request {
  startTime?: number;
}
