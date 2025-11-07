import { useState } from 'react';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { api } from '../utils/api';
import { WhaleTransaction } from '../types';

export const WhaleTracker = () => {
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setTransactions([]);
    setBalance(null);

    try {
      const [txResponse, balanceResponse] = await Promise.all([
        api.getWhaleTransactions(address, 10),
        api.getBalance(address),
      ]);

      if (txResponse.success && txResponse.data) {
        setTransactions(txResponse.data.transactions || []);
      }

      if (balanceResponse.success && balanceResponse.data) {
        setBalance(balanceResponse.data.balance);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wallet information');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Whale Tracker
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track large transactions and whale wallets
        </p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label
              htmlFor="wallet-address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Wallet Address
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                id="wallet-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter wallet address..."
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

      {balance !== null && (
        <Card title="Wallet Balance">
          <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-6 dark:from-purple-900/20 dark:to-blue-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              SOL Balance
            </p>
            <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              {balance.toFixed(4)} SOL
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Address: {formatAddress(address)}
            </p>
          </div>
        </Card>
      )}

      {transactions.length > 0 && (
        <Card title="Recent Transactions">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Signature
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    From
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    To
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {formatAddress(tx.signature)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {formatAddress(tx.from)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {formatAddress(tx.to)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(tx.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card title="Live Whale Alerts">
        <p className="text-gray-600 dark:text-gray-400">
          Coming soon: Real-time whale transaction monitoring
        </p>
      </Card>
    </div>
  );
};
