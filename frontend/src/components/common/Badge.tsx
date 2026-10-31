import React from 'react';
import { RiskLevel } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'indigo' | 'emerald' | 'amber' | 'red' | 'slate' | 'risk';
  riskLevel?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  riskLevel,
  size = 'md',
  className = '',
  dot = false
}) => {
  let activeVariant = variant;
  if (riskLevel) {
    if (riskLevel === 'CRITICAL') activeVariant = 'red';
    else if (riskLevel === 'HIGH') activeVariant = 'amber';
    else if (riskLevel === 'MEDIUM') activeVariant = 'indigo';
    else activeVariant = 'emerald';
  }

  const variantStyles = {
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30',
    blue: 'bg-sky-950/60 text-sky-400 border-sky-500/30',
    indigo: 'bg-indigo-950/60 text-indigo-400 border-indigo-500/30',
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
    red: 'bg-red-950/60 text-red-400 border-red-500/30',
    slate: 'bg-slate-800/60 text-slate-300 border-slate-700/50',
    risk: ''
  }[activeVariant];

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  }[size];

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-mono font-medium rounded-md border ${variantStyles} ${sizeStyles} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            activeVariant === 'red'
              ? 'bg-red-400 animate-pulse'
              : activeVariant === 'emerald'
              ? 'bg-emerald-400'
              : 'bg-cyan-400'
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
