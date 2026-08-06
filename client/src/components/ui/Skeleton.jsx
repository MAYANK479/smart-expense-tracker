import React from 'react';

export default function Skeleton({ className = '', height = 'h-4', width = 'w-full', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`bg-slate-800/60 animate-pulse ${rounded} ${height} ${width} ${className}`}
    />
  );
}

export function CardSkeleton({ count = 1 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton height="h-3" width="w-24" />
            <Skeleton height="h-9" width="w-9" rounded="rounded-xl" />
          </div>
          <Skeleton height="h-8" width="w-36" />
          <Skeleton height="h-3" width="w-28" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton height="h-6" width="w-48" />
        <Skeleton height="h-9" width="w-64" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <Skeleton height="h-8" width="w-8" rounded="rounded-xl" />
            <div className="space-y-2">
              <Skeleton height="h-4" width="w-32" />
              <Skeleton height="h-3" width="w-20" />
            </div>
          </div>
          <Skeleton height="h-4" width="w-20" />
        </div>
      ))}
    </div>
  );
}
