import React from 'react';
import { Sparkles } from 'lucide-react';

interface ProBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

const ProBadge: React.FC<ProBadgeProps> = ({ size = 'sm', className = '' }) => {
  const sizeClasses = size === 'sm'
    ? 'text-[9px] px-1.5 py-0.5 gap-0.5'
    : 'text-xs px-2 py-1 gap-1';

  return (
    <span
      className={`inline-flex items-center font-bold tracking-widest rounded-full
        bg-gradient-to-r from-amber-500/20 to-yellow-500/20
        border border-amber-500/40 text-amber-400 uppercase
        ${sizeClasses} ${className}`}
    >
      <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      PRO
    </span>
  );
};

export default ProBadge;
