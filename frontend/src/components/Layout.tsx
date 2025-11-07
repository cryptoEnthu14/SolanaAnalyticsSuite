import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

interface LayoutProps {
  children: ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Token Analyzer', path: '/', icon: '🪙' },
  { name: 'Pool Monitor', path: '/pools', icon: '💧' },
  { name: 'Whale Tracker', path: '/whales', icon: '🐋' },
  { name: 'Block Explorer', path: '/blocks', icon: '⛓️' },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">
              ⚡ Solana Analytics
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Connected to Solana Mainnet
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
