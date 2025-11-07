import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, children, className }: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-lg bg-white p-6 shadow-md dark:bg-gray-800',
        className
      )}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
