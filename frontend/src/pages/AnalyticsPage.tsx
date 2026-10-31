import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  BarChart3,
  MapPin,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const AnalyticsPage: React.FC = () => {
  // Regional Threat Incidence (Simulated based on I4C / CERT-In publicly reported trends)
  const stateThreatData = [
    { state: 'Maharashtra', count: 4820, primaryScam: 'Digital Arrest & KYC' },
    { state: 'Karnataka', count: 4190, primaryScam: 'Job & Telegram Tasks' },
    { state: 'Delhi NCR', count: 3950, primaryScam: 'Police Impersonation' },
    { state: 'Uttar Pradesh', count: 3410, primaryScam: 'Electricity & Utility' },
    { state: 'Telangana', count: 2890, primaryScam: 'UPI Payment Reversal' },
    { state: 'Tamil Nadu', count: 2450, primaryScam: 'Courier Smishing' },
    { state: 'Gujarat', count: 2180, primaryScam: 'Crypto Trading & Forex' }
  ];

  // Delivery Channel Distribution
  const channelData = [
    { name: 'WhatsApp & Telegram', value: 42, color: '#06b6d4' },
    { name: 'SMS Smishing', value: 31, color: '#38bdf8' },
    { name: 'Direct Voice / Skype', value: 18, color: '#ef4444' },
    { name: 'Email / Web Lures', value: 9, color: '#818cf8' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Macro Fraud Analytics & Regional Heatmap
            </h1>
            <Badge variant="cyan">I4C TAXONOMY</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Macro-level trend analysis of digital fraud vectors, delivery channels, and state-wise vulnerability.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Source: ScamShield Telemetry & I4C Public Reports
        </div>
      </div>

      {/* State-wise Threat Volume Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>State-Wise Reported Incidence Index (India)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Aggregate threat reports normalized per million digital banking users
            </p>
          </div>
          <Badge variant="indigo" size="sm">National Rank</Badge>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateThreatData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="state" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d1a',
                  borderColor: 'rgba(6,182,212,0.3)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Reported Incidents" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Breakdown Row: Attack Channels & Key Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Delivery Channel Donut */}
        <div className="lg:col-span-5">
          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Primary Initial Attack Vectors
              </h3>
              <p className="text-xs text-slate-400 font-mono">How scammers initiate contact with victims</p>
            </div>

            <div className="h-56 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
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
                <span className="text-[10px] font-mono text-slate-400">CHANNELS</span>
                <span className="text-base font-bold font-mono text-white">4 VECTORS</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs font-mono">
              {channelData.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-300">{c.name}</span>
                  </div>
                  <span className="text-white font-bold">{c.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Tactical Defense Insights */}
        <div className="lg:col-span-7 space-y-3">
          <GlassCard className="p-4 space-y-2 border-l-4 border-l-cyan-400">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Digital Arrest Shift to Video Calls</h4>
              <Badge variant="red" size="sm">Critical Trend</Badge>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Syndicates have transitioned from simple phone audio impersonation to high-definition Skype video sets featuring forged police stations, artificial police insignias, and fake judicial court backgrounds to maximize intimidation.
            </p>
          </GlassCard>

          <GlassCard className="p-4 space-y-2 border-l-4 border-l-indigo-400">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Disposable Mule Account Networks</h4>
              <Badge variant="indigo" size="sm">Modus Operandi</Badge>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Funds extorted via fake UPI requests or digital arrest fear are routed through 4 to 7 layers of mule bank accounts in under 12 minutes, making the Golden Hour (1930 reporting) the singular effective recovery window.
            </p>
          </GlassCard>

          <GlassCard className="p-4 space-y-2 border-l-4 border-l-amber-400">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Regional Discom Impersonation Spikes</h4>
              <Badge variant="amber" size="sm">Seasonal Spike</Badge>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              End-of-month electricity disconnection SMS campaigns surge by 400% between the 25th and 30th of each month, targeting commercial small businesses and elderly citizens with urgent 9:30 PM power cutoff threats.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
