import { useState } from 'react';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { api } from '../utils/api';
import { TokenInfo } from '../types';

export const TokenAnalyzer = () => {
  const [address, setAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setTokenInfo(null);

    try {
      const response = await api.getToken(address);
      if (response.success && response.data) {
        setTokenInfo(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch token information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Token Analyzer
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Analyze Solana tokens and their metadata
        </p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label
              htmlFor="token-address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Token Address
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                id="token-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter token mint address..."
                className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </Card>

      {loading && (
        <Card>
          <Loading />
        </Card>
      )}

      {error && (
        <Card>
          <div className="text-red-600 dark:text-red-400">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        </Card>
      )}

      {tokenInfo && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Token Information">
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Address
                </dt>
                <dd className="mt-1 break-all text-sm text-gray-900 dark:text-white">
                  {tokenInfo.address}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {tokenInfo.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Symbol
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {tokenInfo.symbol}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Decimals
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {tokenInfo.decimals}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Supply
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {tokenInfo.supply}
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="Token Metrics">
            <div className="space-y-4">
              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Market Cap
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  Coming Soon
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  24h Volume
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  Coming Soon
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
