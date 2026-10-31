import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  danger = false,
  onClick
}) => {
  const baseStyle = danger
    ? 'glass-panel-danger'
    : glow
    ? 'glass-panel-glow'
    : 'glass-panel';

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} rounded-xl p-5 transition-all duration-300 relative ${
        onClick ? 'cursor-pointer hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.18)]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
