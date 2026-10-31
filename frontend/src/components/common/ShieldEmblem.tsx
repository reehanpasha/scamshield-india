import React from 'react';

interface ShieldEmblemProps {
  size?: number;
  glow?: boolean;
  pulse?: boolean;
  className?: string;
}

export const ShieldEmblem: React.FC<ShieldEmblemProps> = ({
  size = 64,
  glow = true,
  pulse = true,
  className = ''
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-xl bg-cyan-500/25 pointer-events-none"
          style={{ transform: 'scale(1.2)' }}
        />
      )}

      {/* Rotating outer ring */}
      <svg
        className={`absolute inset-0 w-full h-full text-cyan-500/30 ${pulse ? 'animate-spin' : ''}`}
        style={{ animationDuration: '24s' }}
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke="rgba(99, 102, 241, 0.2)"
          strokeWidth="1"
        />
      </svg>

      {/* Central Cyber Shield */}
      <svg
        className="relative z-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
        width={size * 0.75}
        height={size * 0.75}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L3 7V12C3 17.5 6.8 22.6 12 24C17.2 22.6 21 17.5 21 12V7L12 2Z"
          fill="url(#shield-grad)"
          stroke="#06b6d4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Core emblem motif */}
        <path
          d="M12 6L7 9.5V13C7 16.5 9.1 19.8 12 20.8C14.9 19.8 17 16.5 17 13V9.5L12 6Z"
          fill="rgba(6, 182, 212, 0.2)"
          stroke="#38bdf8"
          strokeWidth="1"
        />
        <circle cx="12" cy="12" r="2.5" fill="#00f0ff" className={pulse ? 'animate-ping' : ''} style={{ animationDuration: '3s' }} />
        <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
        <defs>
          <linearGradient id="shield-grad" x1="12" y1="2" x2="12" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#083344" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
