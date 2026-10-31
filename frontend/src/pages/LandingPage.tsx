import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Globe,
  MessageSquare,
  Lock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Search,
  ExternalLink
} from 'lucide-react';
import { ShieldEmblem } from '../components/common/ShieldEmblem';
import { GlobeNetworkCanvas } from '../components/landing/GlobeNetworkCanvas';
import { ThreatTicker } from '../components/landing/ThreatTicker';
import { LiveCounters } from '../components/landing/LiveCounters';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#030712] overflow-hidden flex flex-col">
      {/* Top Cyber Navigation Bar */}
      <nav className="w-full glass-panel border-b border-white/10 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <ShieldEmblem size={36} glow={true} pulse={false} />
            <div>
              <span className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                SCAMSHIELD INDIA
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  NATIONAL
                </span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 block tracking-wider">
                THREAT INTELLIGENCE
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-mono text-slate-300">
            <button onClick={() => navigate('/dashboard')} className="hover:text-cyan-400 transition-colors">
              Operations Center
            </button>
            <button onClick={() => navigate('/url-scanner')} className="hover:text-cyan-400 transition-colors">
              URL Engine
            </button>
            <button onClick={() => navigate('/message-scanner')} className="hover:text-cyan-400 transition-colors">
              Message Lab
            </button>
            <button onClick={() => navigate('/cyber-safety')} className="hover:text-cyan-400 transition-colors">
              1930 Helpline
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all text-xs font-mono"
            >
              Command Center
            </button>
            <button
              onClick={() => navigate('/url-scanner')}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all text-xs font-mono shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-1.5"
            >
              <span>Scan Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Threat Ticker */}
      <ThreatTicker />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 z-10 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>DEFENSE ENGINE v1.2.0-IN ACTIVE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              THINK BEFORE <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                YOU CLICK.
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-medium text-slate-300 font-mono">
              Intelligence Against Digital Fraud.
            </h2>

            <p className="text-base text-slate-400 max-w-xl leading-relaxed">
              Analyze suspicious links, uncover fraud indicators, and make smarter security decisions with explainable threat intelligence engineered for India’s cyber ecosystem.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={() => navigate('/url-scanner')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold transition-all text-sm font-mono shadow-[0_0_25px_rgba(6,182,212,0.45)] flex items-center justify-center space-x-2"
              >
                <span>Launch Security Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 transition-all text-sm font-mono flex items-center justify-center space-x-2"
              >
                <span>Explore Intelligence</span>
                <Globe className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Key feature pills */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/10 text-xs font-mono text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Zero SSRF Execution</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Hindi & English NLP</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>100% Explainable</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visual Centerpiece */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* 3D Network Globe Canvas Container */}
            <div className="w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] relative flex items-center justify-center">
              <GlobeNetworkCanvas />

              {/* Central Floating Shield Emblem */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <ShieldEmblem size={92} glow={true} pulse={true} />
              </div>

              {/* Floating Live Telemetry Cards */}
              <div className="absolute top-4 -left-4 sm:left-2 p-3 rounded-xl glass-panel-glow border border-red-500/40 text-left shadow-2xl animate-pulse-subtle">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-red-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  <span>SUSPICIOUS LOOKALIKE</span>
                </div>
                <div className="text-xs font-mono text-white font-semibold mt-0.5">
                  sbi-kyc-verify.top
                </div>
                <div className="text-[10px] text-red-300 font-mono">Risk Score: 95/100 (Critical)</div>
              </div>

              <div className="absolute bottom-6 -right-4 sm:right-2 p-3 rounded-xl glass-panel-glow border border-emerald-500/40 text-left shadow-2xl">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>OFFICIAL PORTAL</span>
                </div>
                <div className="text-xs font-mono text-white font-semibold mt-0.5">
                  cybercrime.gov.in
                </div>
                <div className="text-[10px] text-emerald-300 font-mono">Verified Gov Root</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Numerical Counters */}
      <LiveCounters />

      {/* Section 2: Core Capabilities Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Tactical Threat Defense
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Engineered for India's Digital Landscape
          </h3>
          <p className="text-slate-400 text-sm mt-3">
            Detecting the exact vectors fraudsters use across UPI payments, banking impersonation, and fraudulent summons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => navigate('/url-scanner')}
            className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/60 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              URL & Lookalike Intelligence
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Dissects domain hierarchies, homoglyphs, bare IP addresses, and deceptive subdomains mimicking SBI, HDFC, ICICI, and UIDAI.
            </p>
            <div className="flex items-center text-xs font-mono text-cyan-400 group-hover:underline">
              <span>Open URL Scanner</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => navigate('/message-scanner')}
            className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/60 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
              Message & Phishing Lab
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Scans SMS, WhatsApp, and Telegram messages for UPI payment reversals, fake KYC cutoffs, electricity threats, and digital arrest coercion in Hindi and English.
            </p>
            <div className="flex items-center text-xs font-mono text-indigo-400 group-hover:underline">
              <span>Open Message Lab</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => navigate('/threat-explorer')}
            className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/60 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/30 flex items-center justify-center text-red-400 mb-5 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
              Threat Mesh & Forensics
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Interactive threat graph mapping reported scam categories, fraudulent UPI handles, and SHA-256 cataloged evidence files.
            </p>
            <div className="flex items-center text-xs font-mono text-red-400 group-hover:underline">
              <span>Explore Threat Mesh</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Helpline 1930 & Official Portal Banner */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-950 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>OFFICIAL CITIZEN HELPLINE</span>
            </div>
            <h4 className="text-2xl font-bold text-white">
              Defrauded within the last 2 hours? Call 1930
            </h4>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Under the Indian Cyber Crime Coordination Centre (I4C), dialing 1930 triggers the Citizen Financial Cyber Fraud Reporting System to freeze fraudulent transactions in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono text-xs flex items-center gap-2 transition-all"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => navigate('/cyber-safety')}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              View Recovery Guide
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-8 px-6 bg-slate-950 text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldEmblem size={20} glow={false} pulse={false} />
            <span className="text-slate-300 font-bold">SCAMSHIELD INDIA</span>
            <span>— Advanced Cybersecurity & Digital Fraud Platform</span>
          </div>
          <div>
            <span>Official Reporting: </span>
            <a href="https://cybercrime.gov.in" className="text-cyan-400 hover:underline">
              cybercrime.gov.in
            </a>
            <span className="mx-2">|</span>
            <span>Helpline: 1930</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
