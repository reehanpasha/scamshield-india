import React, { useState } from 'react';
import {
  BookOpen,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

export const EducationPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const modules = [
    {
      title: 'Digital Arrest Scams: Reality & Countermeasures',
      category: 'High Threat Advisory',
      badge: 'CRITICAL',
      icon: ShieldAlert,
      summary: 'Understanding the counterfeit CBI, Police, and Narcotics Bureau video interrogation fraud.',
      rules: [
        'No Legal Entity Conducts Digital Arrest: Under Indian criminal law (CrPC / BNSS), arrests and interrogations are NEVER executed over Skype, WhatsApp, or Zoom video calls.',
        'Warrants Are Not Served Over WhatsApp: Valid arrest warrants and court summons must be physically served or issued via verified official departmental mail.',
        'No "RBI Verification Account" Exists: Police and ED officers will never demand that you transfer your savings to a "safe government account" for verification.',
        'Immediate Action: Disconnect the video call. Do not fear threats of arrest. Call 1930 or walk into your nearest local police station immediately.'
      ]
    },
    {
      title: 'UPI Payment Architecture & PIN Inversion',
      category: 'Financial Protection',
      badge: 'CRITICAL',
      icon: Lock,
      summary: 'Demystifying the "Scan QR to receive money" fraud vector.',
      rules: [
        'PIN is strictly for SENDING money: You NEVER need to enter your UPI PIN, password, or biometric to receive money, cashback, or refunds.',
        'QR Codes Transfer Money Away: Scanning a QR code authorizes a debit from your bank account, not a credit.',
        'Collect Requests are Debits: If someone sends you a payment request notification on PhonePe/GPay, approving it transfers money from your account to theirs.',
        'Golden Hour Protocol: If defrauded on UPI, immediately call 1930 or your bank to register a freeze request on the beneficiary VPA.'
      ]
    },
    {
      title: 'Fake Bank KYC & Account Freeze Panic',
      category: 'Banking Smishing',
      badge: 'HIGH',
      icon: AlertTriangle,
      summary: 'How fraudsters weaponize urgency using impending 24-hour account deactivations.',
      rules: [
        'Banks Never Send Third-Party Links for KYC: RBI circulars prohibit Indian banks from requesting Aadhaar/PAN upload via SMS links.',
        'Domain Check: Legitimate Indian bank websites end in approved apex domains (e.g., sbi.co.in, onlinesbi.sbi, hdfcbank.com). Never trust .top, .xyz, or .fit links.',
        'Utility Scams: Electricity discoms (BESCOM, TPDDL, etc.) do not disconnect power at 9:30 PM with personal mobile numbers listed for resolution.'
      ]
    },
    {
      title: 'Telegram Task & Part-Time Job Scams',
      category: 'Investment Fraud',
      badge: 'HIGH',
      icon: HelpCircle,
      summary: 'The anatomy of "Like YouTube videos and earn ₹5000 daily" syndicates.',
      rules: [
        'The Sunk Cost Trap: Victims are paid ₹150 for trivial tasks, building artificial trust before requiring ₹10,000 to ₹50,000 advance deposits.',
        'Fake Trading Dashboards: Fraudulent investment portals show fabricated exponential crypto profits, but withdrawal requests are blocked unless further fees are paid.',
        'Rule of Thumb: Genuine corporations never conduct hiring, interviews, or payroll exclusively through anonymous Telegram channels.'
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Official Indian Cyber Safety Center
            </h1>
            <Badge variant="cyan">PUBLIC DEFENSE</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Authoritative guidance, victim protocols, and legal reality checks aligned with I4C directives.
          </p>
        </div>

        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 self-start md:self-auto"
        >
          <span>cybercrime.gov.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Emergency Helpline 1930 Golden Hour Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-950 border border-red-500/40 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>NATIONAL EMERGENCY HOTLINE • 24x7 TOLL FREE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Financial Fraud? Dial <span className="text-red-400 underline decoration-red-500/50">1930</span> in the Golden Hour
            </h2>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              If you inadvertently transferred funds or entered your PIN, reporting within the first <strong>2 to 3 hours</strong> allows the Indian Cyber Crime Coordination Centre (I4C) to trigger the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) to freeze the fraudster's beneficiary bank accounts before cash is withdrawn at an ATM.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono">
              <span className="text-slate-400 block mb-1">Required Information:</span>
              <ul className="text-slate-300 space-y-1 text-[11px]">
                <li>• Bank Account & Debit Card Number</li>
                <li>• UPI Transaction ID / UTR Number</li>
                <li>• Fraudster's Mobile / VPA handle</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Knowledge Modules */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Core Cyber Defense Playbooks</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod, idx) => (
            <GlassCard key={idx} className="p-5 space-y-4" danger={mod.badge === 'CRITICAL'}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-cyan-400 shrink-0">
                    <mod.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{mod.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{mod.category}</span>
                  </div>
                </div>
                <Badge riskLevel={mod.badge as any} size="sm">{mod.badge}</Badge>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {mod.summary}
              </p>

              <div className="pt-2 border-t border-white/5 space-y-2">
                {mod.rules.map((rule, rIdx) => (
                  <div key={rIdx} className="flex items-start space-x-2 text-xs font-mono text-slate-300">
                    <span className="text-cyan-400 font-bold shrink-0">•</span>
                    <span className="leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Official Government Portals & Reporting Directory */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official Indian Cybercrime & Consumer Portals</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white">National Cybercrime Portal</div>
              <div className="text-[11px] text-cyan-400">cybercrime.gov.in</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>

          <a
            href="https://sancharsaathi.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white">Sanchar Saathi (Chakshu)</div>
              <div className="text-[11px] text-cyan-400">sancharsaathi.gov.in</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>

          <a
            href="https://rbi.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white">RBI Kehta Hai (Consumer Portal)</div>
              <div className="text-[11px] text-cyan-400">rbi.org.in/commonman</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>
        </div>

        <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-white/5">
          Disclaimer: Educational guidance provided by ScamShield India is intended for digital threat awareness and does not constitute formal legal counsel or financial advice.
        </div>
      </GlassCard>
    </div>
  );
};
