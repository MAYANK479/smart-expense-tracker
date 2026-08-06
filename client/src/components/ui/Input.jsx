import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={`input-primary ${Icon ? 'pl-10' : ''} ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-medium">{error}</p>
      )}
    </div>
  );
}
