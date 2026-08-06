import React from 'react';

export default function Skeleton({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div
      className={`bg-slate-800/60 animate-pulse rounded-lg ${height} ${width} ${className}`}
    />
  );
}
