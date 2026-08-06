import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  glow = false,
  interactive = false,
  padding = 'p-6',
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={interactive ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      onClick={onClick}
      className={`glass-card ${glow ? 'glass-card-glow' : ''} ${interactive ? 'cursor-pointer hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/10' : ''} ${padding} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
