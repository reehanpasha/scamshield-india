import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Copy,
  Check,
  Languages,
  Layers,
  FileText,
  HelpCircle,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../services/api';
import { MessageAnalysisResult } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { RiskGauge } from '../components/common/RiskGauge';
import { Badge } from '../components/common/Badge';

export const MessageScannerPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState('SMS');
  const [language, setLanguage] = useState('AUTO');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);

  // Pre-configured realistic Indian phishing / fraud messages for 1-click testing
  const sampleMessages = [
    {
      label: 'UPI Cashback PIN Scam',
      type: 'WhatsApp',
      lang: 'ENGLISH',
      text: 'Congratulations! You have won ₹4,500 cashback in PhonePe scratch card reward. Scan this QR code or enter your UPI PIN to claim money directly into your bank account immediately.'
    },
    {
      label: 'Digital Arrest CBI Notice',
      type: 'WhatsApp',
      lang: 'ENGLISH',
      text: 'This is CBI Delhi Crime Branch. A DHL courier parcel with 5 passports and 140 grams of MDMA narcotics was intercepted in your Aadhaar name. An arrest warrant is issued. Connect immediately on Skype video call for digital arrest interrogation or transfer funds to RBI verification account.'
    },
    {
      label: 'SBI Fake KYC Deactivation (Hindi)',
      type: 'SMS',
      lang: 'HINDI',
      text: 'प्रिय ग्राहक, आपका एसबीआई बैंक खाता आज रात 9:30 बजे निलंबित कर दिया जाएगा क्योंकि पैन कार्ड लिंक नहीं है। तुरंत खाता चालू रखने के लिए http://sbi-kyc-update.xyz पर क्लिक करें।'
    },
    {
      label: 'Electricity Power Disconnection',
      type: 'SMS',
      lang: 'ENGLISH',
      text: 'Dear customer, your electricity power will be disconnected tonight at 9:30 PM from the head office because previous month bill was not updated. Call our electricity officer at 9876543210 immediately.'
    },
    {
      label: 'Fake India Post Parcel Notice',
      type: 'SMS',
      lang: 'ENGLISH',
      text: 'India Post: Your package IND94830 cannot be delivered due to incomplete address. Please pay ₹5 address update fee within 24 hours at http://indiapost-update.top to reschedule delivery.'
    },
    {
      label: 'Legitimate Bank OTP Notice',
      type: 'SMS',
      lang: 'ENGLISH',
      text: '729104 is your OTP for transaction of Rs 1,200 at Amazon India. Valid for 10 minutes. Never share your OTP or password with anyone, including bank staff.'
    }
  ];

  const handleAnalyze = async (overrideText?: string, overrideType?: string) => {
    const textToAnalyze = overrideText || content;
    if (!textToAnalyze.trim()) return;

    setAnalyzing(true);
    setResult(null);

    try {
      const data = await apiService.analyzeMessage(
        textToAnalyze.trim(),
        overrideType || messageType,
        language
      );
      setResult(data);
    } catch (err) {
      console.error('Failed to analyze message', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `[SCAMSHIELD INDIA - MESSAGE THREAT INTELLIGENCE]
Message Type: ${result.message_type} | Language: ${result.detected_language}
Risk Score: ${result.risk_score}/100 (${result.risk_level})
Categories: ${result.categories.join(', ')}
Summary: ${result.summary}
Evidence Count: ${result.evidence_cards.length}
Evidence Findings:
${result.evidence_cards.map((e) => `- ${e.category} (${e.severity}): ${e.why_suspicious}`).join('\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render highlighted text with interactive cyber underlines
  const renderHighlightedText = () => {
    if (!result || !result.highlights || result.highlights.length === 0) {
      return <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
    }

    const elements: React.ReactNode[] = [];
    let lastIdx = 0;

    result.highlights.forEach((hl, i) => {
      // Unhighlighted chunk before match
      if (hl.start > lastIdx) {
        elements.push(
          <span key={`text-${i}`}>{content.substring(lastIdx, hl.start)}</span>
        );
      }

      // Highlighted suspicious chunk
      const isSelected = activeHighlightId === hl.rule_id;
      elements.push(
        <mark
          key={`mark-${i}`}
          onClick={() => setActiveHighlightId(hl.rule_id)}
          className={`cursor-pointer px-1 rounded transition-all font-semibold ${
            hl.severity === 'CRITICAL'
              ? 'bg-red-500/30 text-red-300 border-b-2 border-red-500 hover:bg-red-500/50'
              : 'bg-amber-500/30 text-amber-300 border-b-2 border-amber-500 hover:bg-amber-500/50'
          } ${isSelected ? 'ring-2 ring-cyan-400 bg-red-500/60' : ''}`}
          title={`Threat: ${hl.category} (${hl.severity})`}
        >
          {content.substring(hl.start, hl.end)}
        </mark>
      );

      lastIdx = hl.end;
    });

    if (lastIdx < content.length) {
      elements.push(<span key="text-end">{content.substring(lastIdx)}</span>);
    }

    return elements;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Message & Phishing Intelligence Lab
            </h1>
            <Badge variant="indigo">NLP v1.2.0-IN</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Detects UPI coercion, Digital Arrest extortion, fake electricity warnings & SMS smishing in Hindi & English.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/30">
          <Languages className="w-4 h-4" />
          <span>Multilingual Engine (English • हिन्दी • ಕನ್ನಡ Ready)</span>
        </div>
      </div>

      {/* Input Section */}
      <GlassCard className="p-6 space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Channel Type:</span>
            {['SMS', 'WhatsApp', 'Email', 'Telegram'].map((type) => (
              <button
                key={type}
                onClick={() => setMessageType(type)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  messageType === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="AUTO">Auto Detect</option>
              <option value="ENGLISH">English</option>
              <option value="HINDI">Hindi (हिन्दी)</option>
              <option value="KANNADA">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>
        </div>

        {/* Text Input */}
        <div className="relative">
          <textarea
            rows={5}
            placeholder="Paste suspicious SMS, WhatsApp forward, email notice, or job offer here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-white font-mono text-sm placeholder-slate-500 transition-all shadow-inner leading-relaxed"
          />

          <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-500">
            {content.length} chars
          </div>
        </div>

        {/* Action Button & Test Fixtures */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Load sample:</span>
            {sampleMessages.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setContent(sample.text);
                  setMessageType(sample.type);
                  handleAnalyze(sample.text, sample.type);
                }}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 transition-all"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={analyzing || !content.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold font-mono text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Running NLP Engine...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scan Message</span>
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {/* Analysis Results View */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* Left Column: Risk Gauge, Telemetry, and Highlighted View (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <GlassCard
              className="py-6 flex flex-col items-center justify-center text-center"
              danger={result.risk_level === 'CRITICAL'}
              glow={result.risk_level === 'LOW'}
            >
              <RiskGauge
                score={result.risk_score}
                level={result.risk_level}
                confidence={result.confidence}
                size={190}
              />

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Badge variant="cyan" size="sm">Channel: {result.message_type}</Badge>
                <Badge variant="blue" size="sm">Detected: {result.detected_language}</Badge>
                {result.categories.map((c, i) => (
                  <Badge key={i} variant="amber" size="sm">{c}</Badge>
                ))}
              </div>
            </GlassCard>

            {/* Highlighted Message Inspection Pane */}
            <GlassCard className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Interactive Phishing Highlighter</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  Click highlighted phrases to focus evidence
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed max-h-64 overflow-y-auto">
                {renderHighlightedText()}
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                {result.summary}
              </p>
            </GlassCard>
          </div>

          {/* Right Column: Evidence Cards & Prescriptive Action Steps (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
                <span>Forensic Evidence & Action Directives ({result.evidence_cards.length})</span>
              </h3>

              <button
                onClick={handleCopyReport}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Export Report'}</span>
              </button>
            </div>

            {result.evidence_cards.length === 0 ? (
              <GlassCard className="p-8 text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">No Scam Signatures Detected</h4>
                <p className="text-xs text-slate-400 font-mono max-w-sm mx-auto">
                  The message does not contain known high-risk coercion words, fake urgency triggers, or UPI PIN fraud requests.
                </p>
              </GlassCard>
            ) : (
              result.evidence_cards.map((ev, idx) => (
                <GlassCard
                  key={idx}
                  danger={ev.severity === 'CRITICAL'}
                  className={`p-4 space-y-3 transition-all ${
                    activeHighlightId === ev.rule_id ? 'ring-2 ring-cyan-400 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      <h4 className="text-sm font-bold text-white">{ev.category}</h4>
                    </div>
                    <Badge riskLevel={ev.severity} size="sm">
                      +{ev.score} Risk
                    </Badge>
                  </div>

                  {/* 1. What was detected & why */}
                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-slate-300 leading-relaxed">
                      <strong className="text-slate-200">Why it's suspicious: </strong>
                      {ev.why_suspicious}
                    </div>
                  </div>

                  {/* 2. Verification Directive */}
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 space-y-1 text-xs font-mono">
                    <div className="text-cyan-400 font-bold flex items-center gap-1">
                      <Search className="w-3.5 h-3.5" />
                      <span>Independent Verification:</span>
                    </div>
                    <div className="text-slate-300">{ev.what_to_verify}</div>
                  </div>

                  {/* 3. Action To Take */}
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 space-y-1 text-xs font-mono">
                    <div className="text-red-400 font-bold flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Actionable Next Step:</span>
                    </div>
                    <div className="text-red-200">{ev.action_to_take}</div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
