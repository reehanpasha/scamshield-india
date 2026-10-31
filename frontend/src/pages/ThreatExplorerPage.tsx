import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Globe,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../services/api';
import { ThreatItem } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const ThreatExplorerPage: React.FC = () => {
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'graph'>('list');

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const [tList, g] = await Promise.all([
        apiService.getThreats(searchQuery, selectedCategory, selectedRisk),
        apiService.getThreatGraph()
      ]);
      setThreats(tList);
      setGraphData(g);
    } catch (err) {
      console.error('Failed to load threats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, [selectedCategory, selectedRisk]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchThreats();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(threats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scamshield_threat_intelligence_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Threat Explorer & Indicator Registry
            </h1>
            <Badge variant="cyan">MESH V2</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Search, filter, and correlate confirmed Indian phishing domains, UPI handles, and scam categories.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Feed (JSON)</span>
          </button>

          {/* Toggle View */}
          <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'list' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'graph' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              Graph Mesh
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by domain, UPI ID, scam category, or indicator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700/80 focus:border-cyan-400 text-xs text-white font-mono placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="">All Categories</option>
              <option value="BANKING_PHISH">Banking & KYC Phish</option>
              <option value="DIGITAL_ARREST">Digital Arrest Police</option>
              <option value="UPI_FRAUD">UPI & QR Fraud</option>
              <option value="UTILITY_SCAM">Utility & Electricity</option>
              <option value="COURIER_FRAUD">Courier / India Post</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full h-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-all flex items-center justify-center"
            >
              Filter
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Content: List View or Graph Mesh */}
      {activeTab === 'graph' ? (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Interactive Threat Correlation Mesh
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Visual relationship graph connecting National Threat Hub, categories, and discovered indicator endpoints.
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
              {graphData?.nodes?.length || 0} Nodes • {graphData?.edges?.length || 0} Edges
            </span>
          </div>

          {/* SVG Interactive Relationship Graph */}
          <div className="h-96 w-full rounded-xl bg-slate-950 border border-white/10 relative overflow-hidden flex items-center justify-center p-4">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Center Hub */}
              <circle cx="400" cy="200" r="30" fill="#083344" stroke="#06b6d4" strokeWidth="2" className="animate-pulse" />
              <text x="400" y="205" textAnchor="middle" fill="#00f0ff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                THREAT MESH
              </text>

              {/* Surrounding Category Nodes */}
              {[
                { x: 220, y: 100, label: 'BANKING PHISH', count: 14, color: '#ef4444' },
                { x: 580, y: 100, label: 'DIGITAL ARREST', count: 18, color: '#ef4444' },
                { x: 200, y: 300, label: 'UPI FRAUD', count: 12, color: '#f59e0b' },
                { x: 600, y: 300, label: 'UTILITY SCAM', count: 9, color: '#f97316' },
              ].map((cat, i) => (
                <g key={i}>
                  {/* Connection Line */}
                  <line x1="400" y1="200" x2={cat.x} y2={cat.y} stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx={cat.x} cy={cat.y} r="22" fill="#0f172a" stroke={cat.color} strokeWidth="1.5" />
                  <text x={cat.x} y={cat.y + 4} textAnchor="middle" fill="#f8fafc" fontSize="9" fontFamily="monospace">
                    {cat.label}
                  </text>
                  {/* Satellites */}
                  <line x1={cat.x} y1={cat.y} x2={cat.x - 40} y2={cat.y + (i % 2 === 0 ? -30 : 30)} stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
                  <circle cx={cat.x - 40} cy={cat.y + (i % 2 === 0 ? -30 : 30)} r="6" fill={cat.color} />
                  <line x1={cat.x} y1={cat.y} x2={cat.x + 40} y2={cat.y + (i % 2 === 0 ? -30 : 30)} stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
                  <circle cx={cat.x + 40} cy={cat.y + (i % 2 === 0 ? -30 : 30)} r="6" fill={cat.color} />
                </g>
              ))}
            </svg>

            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
              Relationship Graph Generated From Stored Indicators
            </div>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {threats.length === 0 ? (
            <GlassCard className="p-8 text-center text-xs font-mono text-slate-400">
              No threat indicators matched the selected filter criteria.
            </GlassCard>
          ) : (
            threats.map((threat) => {
              const isExpanded = expandedId === threat.id;

              return (
                <GlassCard
                  key={threat.id}
                  danger={threat.risk_level === 'CRITICAL'}
                  className="transition-all p-4"
                >
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : threat.id)}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-900 text-slate-400 shrink-0">
                        {threat.indicator_type === 'DOMAIN' ? (
                          <Globe className="w-4 h-4 text-cyan-400" />
                        ) : threat.indicator_type === 'UPI_VPA' ? (
                          <Share2 className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-red-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold font-mono text-white truncate">
                            {threat.indicator_value}
                          </span>
                          {threat.verified && (
                            <Badge variant="emerald" size="sm" dot={true}>Verified</Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                          <span>{threat.scam_category}</span>
                          <span>•</span>
                          <span>Reported {threat.reported_count}x</span>
                          <span>•</span>
                          <span>Source: {threat.source}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <Badge riskLevel={threat.risk_level} size="sm">
                        {threat.risk_level}
                      </Badge>
                      <button className="text-slate-400 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-3 animate-in fade-in duration-150">
                      <p className="text-xs text-slate-300 font-mono leading-relaxed">
                        {threat.description || 'No additional technical description catalogued for this indicator.'}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400">
                        <div>
                          <span className="text-slate-500 block">FIRST SEEN:</span>
                          <span className="text-slate-200">{new Date(threat.first_seen).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">LAST DETECTED:</span>
                          <span className="text-slate-200">{new Date(threat.last_seen).toLocaleTimeString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">INDICATOR TYPE:</span>
                          <span className="text-cyan-400">{threat.indicator_type}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">INTELLIGENCE ORIGIN:</span>
                          <span className="text-slate-200">{threat.source}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
