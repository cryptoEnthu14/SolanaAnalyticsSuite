import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { api } from '../utils/api';
import { BlockInfo } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const BlockExplorer = () => {
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getRecentBlocks(20);
      if (response.success && response.data) {
        setBlocks(response.data.blocks || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blocks');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  const chartData = blocks
    .slice()
    .reverse()
    .map((block) => ({
      slot: block.slot,
      transactions: block.transactionCount,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Block Explorer
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Explore recent Solana blocks and transactions
          </p>
        </div>
        <button
          onClick={fetchBlocks}
          disabled={loading}
          className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

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

      {!loading && !error && blocks.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest Block
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {blocks[0]?.slot.toLocaleString()}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg Transactions
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {(
                  blocks.reduce((acc, b) => acc + b.transactionCount, 0) /
                  blocks.length
                ).toFixed(0)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Transactions
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {blocks
                  .reduce((acc, b) => acc + b.transactionCount, 0)
                  .toLocaleString()}
              </p>
            </Card>
          </div>

          <Card title="Transaction Volume">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="slot"
                    tickFormatter={(value) => `${value}`.slice(-4)}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#9333ea"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Recent Blocks">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Slot
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Blockhash
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Transactions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {blocks.map((block) => (
                    <tr
                      key={block.slot}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {block.slot.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {block.blockhash.slice(0, 16)}...
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {block.transactionCount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(block.blockTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
