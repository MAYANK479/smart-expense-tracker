import React from 'react';

export default function Card({
  children,
  className = '',
  glow = false,
  interactive = false,
  padding = 'p-6',
  ...props
}) {
  return (
    <div
      className={`glass-card ${glow ? 'glass-card-glow' : ''} ${interactive ? 'hover:-translate-y-1 hover:border-purple-500/50 cursor-pointer' : ''} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
