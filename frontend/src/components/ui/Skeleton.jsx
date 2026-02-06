import React from 'react';
import { clsx } from 'clsx';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={clsx('animate-pulse rounded-md bg-slate-200 dark:bg-zinc-800', className)}
      {...props}
    />
  );
};

// Specific Skeleton for a Post Card
export const PostSkeleton = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 mb-6">
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-3 w-1/4 rounded" />
      </div>
    </div>
    
    {/* Body */}
    <div className="space-y-3 mb-4">
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
      <Skeleton className="h-4 w-4/6 rounded" />
    </div>

    {/* Image Placeholder */}
    <Skeleton className="w-full h-64 rounded-xl mb-4" />

    {/* Actions */}
    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
      <div className="flex gap-4">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);