import React, { useEffect, useState } from 'react';
import { RiskLevel } from '../../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  confidence?: number;
  size?: number;
  showConfidence?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  confidence = 90,
  size = 200,
  showConfidence = true
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    if (start === end) {
      setDisplayScore(end);
      return;
    }
    const duration = 1000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG Gauge calculations
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc for gauge look
  const strokeDashoffset = circumference - (circumference * 0.75 * (displayScore / 100));

  const getColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'CRITICAL':
        return { stroke: '#ef4444', text: 'text-red-400', glow: 'rgba(239, 68, 68, 0.4)' };
      case 'HIGH':
        return { stroke: '#f97316', text: 'text-orange-400', glow: 'rgba(249, 115, 22, 0.4)' };
      case 'MEDIUM':
        return { stroke: '#f59e0b', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.4)' };
      case 'LOW':
      default:
        return { stroke: '#10b981', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.4)' };
    }
  };

  const colorConfig = getColor(level);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ background: colorConfig.glow }}
        />

        <svg width={size} height={size} className="transform -rotate-135">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          {/* Animated Active Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${colorConfig.stroke})`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
            Risk Score
          </span>
          <div className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white mt-1">
            {displayScore}
            <span className="text-xs text-slate-500 font-normal ml-1">/100</span>
          </div>
          <div
            className={`mt-1 text-sm font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase border ${colorConfig.text} border-current/30 bg-black/40`}
          >
            {level} RISK
          </div>
        </div>
      </div>

      {showConfidence && (
        <div className="mt-2 flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Confidence: <strong className="text-slate-200">{confidence}%</strong></span>
        </div>
      )}
    </div>
  );
};
