'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton h-4 w-full rounded-xl',
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {[1, 2].map((i) => (
        <div key={i} className="card-glass p-8">
          <Skeleton className="h-16 w-16 rounded-2xl mb-4" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <Skeleton className="h-12 w-32" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="card-glass p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
