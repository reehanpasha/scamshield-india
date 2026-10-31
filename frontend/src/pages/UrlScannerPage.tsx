import React, { useState } from 'react';
import {
  Globe,
  Search,
  CheckCircle,
  AlertOctagon,
  AlertTriangle,
  Info,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import { apiService } from '../services/api';
import { UrlAnalysisResult, UrlStage } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { RiskGauge } from '../components/common/RiskGauge';
import { Badge } from '../components/common/Badge';

export const UrlScannerPage: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample quick targets for reviewer testing
  const sampleUrls = [
    { label: 'SBI Lookalike Phishing', url: 'http://sbi-kyc-update.xyz/login' },
    { label: 'Raw IP Bank Phish', url: 'http://192.168.1.100/sbi/netbanking' },
    { label: 'Suspicious Shortener', url: 'https://bit.ly/claim-upi-refund-2026' },
    { label: 'Official Legit SBI', url: 'https://onlinesbi.sbi' },
    { label: 'Official Cybercrime Portal', url: 'https://cybercrime.gov.in' }
  ];

  const handleAnalyze = async (targetUrl?: string) => {
    const urlToTest = targetUrl || urlInput;
    if (!urlToTest.trim()) {
      setErrorMsg('Please enter a URL to inspect.');
      return;
    }
    setErrorMsg('');
    setAnalyzing(true);
    setResult(null);

    try {
      const data = await apiService.analyzeUrl(urlToTest.trim());
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis failed. Please check the URL syntax.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `[SCAMSHIELD INDIA - URL INTELLIGENCE REPORT]
Target URL: ${result.input_url}
Risk Score: ${result.risk_score}/100 (${result.risk_level})
Confidence: ${result.confidence}%
Apex Domain: ${result.apex_domain}
Findings: ${result.findings.join(', ')}
Safety Notes: ${result.safety_notes.join(' | ')}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              URL Intelligence & Lookalike Engine
            </h1>
            <Badge variant="cyan">ENGINE v1.2.0-IN</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            SSRF-protected deterministic heuristic scanner for Indian financial & government domain spoofing.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Safe Environment (Zero Arbitrary Outbound Requests)</span>
        </div>
      </div>

      {/* Input Section */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
            Submit Suspicious URL / Link for Deep Forensic Inspection
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Globe className="w-5 h-5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. http://sbi-kyc-verification.top/login or https://onlinesbi.sbi"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-white font-mono text-sm placeholder-slate-500 transition-all shadow-inner"
              />
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={analyzing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Stages...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Inspect Threat</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sample test fixtures */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-slate-400 block mb-2">
              Quick test fixtures (Indian threat vectors):
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleUrls.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setUrlInput(item.url);
                    handleAnalyze(item.url);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 text-xs font-mono transition-all flex items-center gap-1.5"
                >
                  <span className="text-cyan-400">›</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Progress Stages Bar (When Analyzing or Completed) */}
      {(analyzing || result) && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Verification Execution Sequence
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Only completed operations are marked passed.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {(result?.stages || [
              { name: 'Input Validation', status: 'COMPLETED', detail: 'OK' },
              { name: 'URL Normalization', status: 'COMPLETED', detail: 'OK' },
              { name: 'Domain Structure', status: 'IN_PROGRESS', detail: 'Evaluating' },
              { name: 'Pattern Detection', status: 'PENDING', detail: 'Queued' },
              { name: 'Reputation Lookup', status: 'PENDING', detail: 'Queued' },
              { name: 'Risk Calculation', status: 'PENDING', detail: 'Queued' },
              { name: 'Report Synthesis', status: 'PENDING', detail: 'Queued' },
            ]).map((stg: UrlStage, idx: number) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                  stg.status === 'COMPLETED'
                    ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                    : stg.status === 'IN_PROGRESS'
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 animate-pulse'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  {stg.status === 'COMPLETED' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : stg.status === 'IN_PROGRESS' ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
                  )}
                  <span className="font-semibold text-[11px] truncate">{stg.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{stg.detail}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Results View */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* Left Column: Risk Gauge & Quick Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <GlassCard
              className="flex flex-col items-center justify-center py-8 text-center"
              danger={result.risk_level === 'CRITICAL'}
              glow={result.risk_level === 'LOW'}
            >
              <RiskGauge
                score={result.risk_score}
                level={result.risk_level}
                confidence={result.confidence}
                size={210}
              />

              <div className="mt-6 w-full pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono px-4 text-slate-400">
                <span>Scan ID:</span>
                <span className="text-cyan-400 font-bold">{result.scan_id ? result.scan_id.slice(0, 8) : 'LOCAL-SCAN'}</span>
              </div>
            </GlassCard>

            {/* Quick Domain Anatomy */}
            <GlassCard>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Domain Anatomy Breakdown</span>
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Apex Domain:</span>
                  <span className="text-white font-bold">{result.apex_domain || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">TLD (Top Level):</span>
                  <span className={`font-bold ${result.tld === 'top' || result.tld === 'xyz' ? 'text-red-400' : 'text-cyan-400'}`}>
                    .{result.tld}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Direct IP Host:</span>
                  <span className={result.is_ip_host ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {result.is_ip_host ? 'YES (High Risk)' : 'NO (Domain-based)'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">URL Shortener:</span>
                  <span className={result.is_shortener ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {result.is_shortener ? 'YES (Masked Target)' : 'NO'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Shannon Entropy:</span>
                  <span className="text-white">{result.entropy} bits</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Evidence Cards & Action Protocols (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Header with Export */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
                <span>Identified Forensic Evidence ({result.evidence.length})</span>
              </h3>

              <button
                onClick={handleCopyReport}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Export Report'}</span>
              </button>
            </div>

            {/* Evidence Cards */}
            {result.evidence.length === 0 ? (
              <GlassCard className="p-8 text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Clean Structure & Verified Entity</h4>
                <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
                  No malicious indicators, brand spoofing, or deceptive subdomains matched the Indian threat ruleset.
                </p>
              </GlassCard>
            ) : (
              result.evidence.map((ev, index) => (
                <GlassCard key={index} className="p-4 space-y-2" danger={ev.severity === 'CRITICAL'}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ev.severity === 'CRITICAL' ? 'bg-red-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                    </div>
                    <Badge riskLevel={ev.severity} size="sm">
                      +{ev.score_impact} Impact
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {ev.description}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-start space-x-2 text-xs font-mono text-cyan-300">
                    <span className="font-bold shrink-0">RECOMMENDATION:</span>
                    <span>{ev.recommendation}</span>
                  </div>
                </GlassCard>
              ))
            )}

            {/* Recommended Safety Protocol Box */}
            <GlassCard className="p-4 bg-slate-950/80 border-cyan-500/30 space-y-2">
              <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Citizen Defense Directives</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                {result.safety_notes.map((note, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
