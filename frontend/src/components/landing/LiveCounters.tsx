import React, { useEffect, useState } from 'react';
import { ShieldCheck, Eye, Database, Zap } from 'lucide-react';

interface CounterProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AnimatedCounter: React.FC<CounterProps> = ({ label, value, prefix = '', suffix = '', icon: Icon }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-panel p-5 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex items-center space-x-4">
      <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
          {prefix}{count.toLocaleString('en-IN')}{suffix}
        </div>
        <div className="text-xs text-slate-400 font-mono mt-0.5">{label}</div>
      </div>
    </div>
  );
};

export const LiveCounters: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Threat Intelligence Telemetry
        </span>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Demonstration Metrics Baseline
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCounter
          label="Threat Signatures Indexed"
          value={48210}
          icon={Database}
          suffix="+"
        />
        <AnimatedCounter
          label="Fraud Indicators Analyzed"
          value={189500}
          icon={Eye}
          suffix="+"
        />
        <AnimatedCounter
          label="Estimated Losses Prevented"
          value={14}
          prefix="₹"
          suffix=".2 Cr"
          icon={ShieldCheck}
        />
        <AnimatedCounter
          label="Average Engine Response"
          value={34}
          suffix="ms"
          icon={Zap}
        />
      </div>
    </div>
  );
};
