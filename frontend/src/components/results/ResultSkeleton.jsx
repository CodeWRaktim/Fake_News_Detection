import { cn } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';

export default function ResultSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 animate-fade-in" role="status" aria-label="Loading results">
      {/* Left skeleton */}
      <div className="md:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Right skeleton */}
      <div className="md:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-full" />
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
