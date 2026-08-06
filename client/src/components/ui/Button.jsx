import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeMap = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-4.5 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5',
  };

  const variantMap = {
    primary: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 border border-purple-400/30',
    secondary: 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 shadow-sm hover:border-slate-600',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60',
    outline: 'bg-transparent text-purple-400 border border-purple-500/40 hover:bg-purple-500/10 hover:border-purple-500/80',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-500/20 border border-rose-400/30',
  };

  return (
    <motion.button
      whileHover={isDisabled || isLoading ? undefined : { scale: 1.02 }}
      whileTap={isDisabled || isLoading ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`${baseStyles} ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children && <span>{children}</span>}
    </motion.button>
  );
}

export function IconButton({
  icon: Icon,
  variant = 'secondary',
  size = 'md',
  onClick,
  title,
  className = '',
  ...props
}) {
  const sizeMap = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2.5 rounded-xl',
    lg: 'p-3.5 rounded-2xl',
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      title={title}
      className={`${sizeMap[size]} ${className}`}
      {...props}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}

export function FloatingActionButton({
  icon: Icon,
  onClick,
  label = 'Quick Add',
  className = ''
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white p-4 rounded-full shadow-2xl shadow-purple-500/50 border border-purple-300/40 flex items-center gap-2 font-bold text-xs cursor-pointer ${className}`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}
