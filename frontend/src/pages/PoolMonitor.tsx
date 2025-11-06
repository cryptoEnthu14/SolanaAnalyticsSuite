import { useState } from 'react';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { api } from '../utils/api';
import { PoolInfo } from '../types';

export const PoolMonitor = () => {
  const [address, setAddress] = useState('');
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setPoolInfo(null);

    try {
      const response = await api.getPool(address);
      if (response.success && response.data) {
        setPoolInfo(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pool information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Pool Monitor
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor liquidity pools and trading activity
        </p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label
              htmlFor="pool-address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pool Address
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                id="pool-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter pool address..."
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

      {poolInfo && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Pool Information">
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pool Address
                </dt>
                <dd className="mt-1 break-all text-sm text-gray-900 dark:text-white">
                  {poolInfo.address}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Token A
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {poolInfo.tokenA}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Token B
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {poolInfo.tokenB}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Liquidity
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  ${poolInfo.liquidity}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  24h Volume
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  ${poolInfo.volume24h}
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="Pool Analytics">
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">APR</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  Coming Soon
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trading Fees
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  Coming Soon
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card title="Top Pools">
        <p className="text-gray-600 dark:text-gray-400">
          Coming soon: Real-time pool rankings and analytics
        </p>
      </Card>
    </div>
  );
};
