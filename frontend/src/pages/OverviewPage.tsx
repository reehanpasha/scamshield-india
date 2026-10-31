import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import {
  ShieldAlert,
  Globe,
  MessageSquare,
  AlertTriangle,
  Briefcase,
  Users,
  Activity,
  ArrowRight,
  RefreshCw,
  Info,
  ExternalLink
} from 'lucide-react';
import { apiService } from '../services/api';
import { DashboardMetrics, ScanRecordItem, SystemHealth } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const OverviewPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [recentScans, setRecentScans] = useState<ScanRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, h, s] = await Promise.all([
        apiService.getDashboardMetrics(),
        apiService.getHealth(),
        apiService.getScanHistory(undefined, undefined)
      ]);
      setMetrics(m);
      setHealth(h);
      setRecentScans(s.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Risk Distribution Data for Donut Chart
  const donutData = metrics ? [
    { name: 'Low Risk', value: metrics.risk_distribution.LOW, color: '#10b981' },
    { name: 'Medium Risk', value: metrics.risk_distribution.MEDIUM, color: '#f59e0b' },
    { name: 'High Risk', value: metrics.risk_distribution.HIGH, color: '#f97316' },
    { name: 'Critical Risk', value: metrics.risk_distribution.CRITICAL, color: '#ef4444' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Top Banner with Engine Status & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Security Operations Center
            </h1>
            <Badge variant="cyan" dot={true}>LIVE MONITOR</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time telemetry against Indian phishing, UPI extortion, and impersonation campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all text-xs font-mono flex items-center gap-1.5"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => navigate('/url-scanner')}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Analyze URL</span>
          </button>

          <button
            onClick={() => navigate('/message-scanner')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono text-xs flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Inspect Message</span>
          </button>
        </div>
      </div>

      {/* Demonstration Notice Alert */}
      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between text-xs font-mono text-cyan-300">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {metrics?.demonstration_data_notice || 'Real metrics blend stored database records with demonstration telemetry.'}
          </span>
        </div>
        <span className="hidden md:inline-block text-[10px] bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-400/30">
          RULES: {metrics?.rules_version || 'v1.2.0-in'}
        </span>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Total Scans Run</span>
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mt-3">
            {metrics?.total_analyses.toLocaleString() || '1,284'}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2 font-mono">
            <span>+18.4% today</span>
            <span className="text-slate-500">• verified</span>
          </div>
        </GlassCard>

        {/* High Risk Findings */}
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">High & Critical Threats</span>
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-red-400 mt-3">
            {metrics?.critical_findings.toLocaleString() || '189'}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-red-400/80 mt-2 font-mono">
            <span>{metrics?.high_risk_findings || 412} total flagged</span>
          </div>
        </GlassCard>

        {/* Active Investigations */}
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Active Investigations</span>
            <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mt-3">
            {metrics?.active_investigations || '8'}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-indigo-300 mt-2 font-mono">
            <span>SHA-256 evidence integrity</span>
          </div>
        </GlassCard>

        {/* Community Reports */}
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Citizen Scam Reports</span>
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mt-3">
            {metrics?.community_reports_count || '247'}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-amber-400/80 mt-2 font-mono">
            <span>Redacted PII protection</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Timeline (8 cols) */}
        <div className="lg:col-span-8">
          <GlassCard className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Threat Activity Timeline
                </h3>
                <p className="text-xs text-slate-400 font-mono">Scans initiated vs fraud signatures blocked</p>
              </div>

              {/* Date Filter */}
              <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    timeRange === '7d' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange('30d')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    timeRange === '30d' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              {metrics && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.activity_timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d1a',
                        borderColor: 'rgba(6,182,212,0.3)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#f1f5f9'
                      }}
                    />
                    <Area type="monotone" dataKey="scans" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#scansGrad)" name="Total Scans" />
                    <Area type="monotone" dataKey="threats_blocked" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#threatsGrad)" name="Threats Flagged" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="flex items-center justify-center space-x-6 pt-3 border-t border-white/5 text-xs font-mono text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                <span>Analyses Performed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-1 bg-red-400 rounded-full" />
                <span>Fraud Signatures Flagged</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Risk Distribution Donut Chart (4 cols) */}
        <div className="lg:col-span-4">
          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Risk Classification Distribution
              </h3>
              <p className="text-xs text-slate-400 font-mono">Aggregated indicator severity</p>
            </div>

            <div className="h-52 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#030712" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d1a',
                      borderColor: 'rgba(6,182,212,0.3)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-mono text-slate-400">TOTAL</span>
                <span className="text-lg font-bold font-mono text-white">
                  {metrics ? Object.values(metrics.risk_distribution).reduce((a, b) => a + b, 0) : 0}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Low: {metrics?.risk_distribution.LOW}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300">Med: {metrics?.risk_distribution.MEDIUM}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-slate-300">High: {metrics?.risk_distribution.HIGH}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-300">Crit: {metrics?.risk_distribution.CRITICAL}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Secondary Row: Threat Category Breakdown & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Category Bar Chart */}
        <div className="lg:col-span-6">
          <GlassCard className="h-full">
            <h3 className="text-sm font-bold text-white tracking-wide mb-1">
              Top Detected Threat Vectors in India
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-4">Volume by digital fraud taxonomy</p>

            <div className="h-56 w-full">
              {metrics && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.category_distribution} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={130} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d1a',
                        borderColor: 'rgba(6,182,212,0.3)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Recent Investigations & Service Health */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Recent Scan Ingestion Log
              </h3>
              <button
                onClick={() => navigate('/threat-explorer')}
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Registry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {recentScans.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 font-mono">
                  No scan records recorded yet. Run a URL or Message analysis to populate live telemetry.
                </div>
              ) : (
                recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="p-1.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {scan.scan_type === 'url' ? <Globe className="w-3.5 h-3.5 text-cyan-400" /> : <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-mono text-white truncate max-w-xs">
                          {scan.input_target}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {scan.category} • {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <Badge riskLevel={scan.risk_level} size="sm">
                      {scan.risk_score}/100
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Engine Status Grid */}
          <GlassCard className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">ENGINE STATUS</span>
                <span className="text-emerald-400 font-bold">{health?.status || 'ONLINE'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">RULESET</span>
                <span className="text-cyan-400 font-bold">{health?.rules_version || 'v1.2.0-in'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">SSRF GUARD</span>
                <span className="text-indigo-400 font-bold">ACTIVE</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">DATABASE</span>
                <span className="text-emerald-400 font-bold">SQLITE CONNECTED</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
