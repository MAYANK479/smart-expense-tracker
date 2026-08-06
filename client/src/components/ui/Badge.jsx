import React from 'react';

export default function Badge({
  children,
  variant = 'purple', // 'purple' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'cyan'
  size = 'md',
  icon: Icon,
  className = ''
}) {
  const variantMap = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  const sizeMap = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl gap-2',
  };

  return (
    <span className={`inline-flex items-center font-semibold border ${variantMap[variant]} ${sizeMap[size]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
