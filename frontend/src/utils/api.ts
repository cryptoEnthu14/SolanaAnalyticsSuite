import { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.error || 'An error occurred while fetching data'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error occurred');
  }
}

export const api = {
  // Token endpoints
  getToken: (address: string) => fetchApi(`/tokens/${address}`),
  getTokenHolders: (address: string) =>
    fetchApi(`/tokens/${address}/holders`),

  // Pool endpoints
  getPool: (address: string) => fetchApi(`/pools/${address}`),
  getPools: () => fetchApi('/pools'),

  // Whale endpoints
  getWhaleTransactions: (address: string, limit = 10) =>
    fetchApi(`/whales/address/${address}?limit=${limit}`),
  getWhaleTxs: (limit = 20) => fetchApi(`/whales/transactions?limit=${limit}`),
  getBalance: (address: string) => fetchApi(`/whales/balance/${address}`),

  // Block endpoints
  getRecentBlocks: (limit = 10) => fetchApi(`/blocks/recent?limit=${limit}`),
  getBlock: (slot: number) => fetchApi(`/blocks/${slot}`),

  // Health check
  health: () => fetchApi('/health'),
};
