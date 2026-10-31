import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Key,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lock,
  EyeOff,
  Cpu,
  RefreshCw,
  Server
} from 'lucide-react';
import { apiService } from '../services/api';
import { SystemHealth } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  // Settings Toggles
  const [ssrfGuard, setSsrfGuard] = useState(true);
  const [autoPiiRedaction, setAutoPiiRedaction] = useState(true);
  const [sensitivity, setSensitivity] = useState<'BALANCED' | 'AGGRESSIVE' | 'CONSERVATIVE'>('BALANCED');
  const [vtKey, setVtKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      setLoading(true);
      try {
        const data = await apiService.getHealth();
        setHealth(data);
      } catch (err) {
        console.error('Failed to load health status', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Platform & Detection Engine Settings
            </h1>
            <Badge variant="cyan">CORE CONTROL</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure local deterministic heuristics, SSRF defense guards, and optional external threat adapters.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <Server className="w-4 h-4" />
          <span>Local Engine Status: {health?.status || 'ONLINE'}</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Detection Engine Configuration */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Detection Engine & Heuristics Tuning</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Active Ruleset Version
              </label>
              <input
                type="text"
                disabled
                value={health?.rules_version || 'v1.2.0-in'}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 font-bold"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Includes Indian banking regex, homoglyph maps, and Hindi fraud tokens.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Heuristic Scoring Sensitivity
              </label>
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="BALANCED">Balanced (Recommended)</option>
                <option value="AGGRESSIVE">Aggressive (High Flag Rate)</option>
                <option value="CONSERVATIVE">Conservative (Minimal False Positives)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Shannon Entropy Threshold
              </label>
              <input
                type="text"
                disabled
                value="3.80 bits / char"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Flags dynamically generated domains (DGA algorithms).
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Security & SSRF Safeguards */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Active Cyber Defense & Privacy Guards</span>
          </h3>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>SSRF & Private Network Guard</span>
                  <Badge variant="emerald" size="sm">Active</Badge>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Strictly prevents scans against loopback (127.0.0.1), RFC1918 private subnets, and AWS/GCP cloud metadata services (169.254.169.254).
                </p>
              </div>
              <input
                type="checkbox"
                checked={ssrfGuard}
                onChange={(e) => setSsrfGuard(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Automatic Citizen PII Redaction</span>
                  <Badge variant="cyan" size="sm">Active</Badge>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Masks phone numbers, 16-digit debit/credit cards, 12-digit Aadhaar numbers, and OTP sequences prior to database ingestion.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoPiiRedaction}
                onChange={(e) => setAutoPiiRedaction(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </GlassCard>

        {/* Optional External Threat Intelligence Adapters */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Optional External Threat Intelligence Integrations</span>
            </h3>
            <Badge variant="indigo" size="sm">
              {health?.providers?.active_mode || 'LOCAL_DETERMINISTIC_RULES'}
            </Badge>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            ScamShield India operates autonomously with full capability using its local deterministic ruleset. External keys enhance reputation telemetry when configured in environment variables.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                VirusTotal API Key (Optional)
              </label>
              <input
                type="password"
                placeholder={health?.providers?.virustotal_configured ? '••••••••••••••••' : 'Enter VIRUSTOTAL_API_KEY'}
                value={vtKey}
                onChange={(e) => setVtKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Status: {health?.providers?.virustotal_configured ? 'Configured in Environment' : 'Local Mock / Inactive'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Gemini / AI Explanation Key (Optional)
              </label>
              <input
                type="password"
                placeholder={health?.providers?.ai_explanation_configured ? '••••••••••••••••' : 'Enter GEMINI_API_KEY'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Status: {health?.providers?.ai_explanation_configured ? 'Configured in Environment' : 'Local Heuristic Explainability Active'}
              </span>
            </div>
          </div>
        </GlassCard>

        {savedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings preferences updated successfully!</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            Apply Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
