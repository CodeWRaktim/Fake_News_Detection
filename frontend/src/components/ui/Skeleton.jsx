import React from 'react';
import { cn } from '../../lib/utils';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg bg-gray-200 dark:bg-gray-700 animate-skeleton-pulse',
        className
      )}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
};

export { Skeleton };
