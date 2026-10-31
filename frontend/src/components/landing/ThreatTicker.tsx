import React from 'react';
import { ShieldAlert, AlertTriangle, Info, Radio } from 'lucide-react';

export const ThreatTicker: React.FC = () => {
  const alerts = [
    { type: 'CRITICAL', text: 'ACTIVE ALERT: Surge in Digital Arrest Skype video extortion impersonating CBI Delhi and Supreme Court.' },
    { type: 'HIGH', text: 'UPI ADVISORY: Fake QR codes distributed claiming "Scan to receive ₹3,000 lottery cashback" debits accounts.' },
    { type: 'WARNING', text: 'PHISHING VECTOR: Lookalike domains spoofing State Bank of India detected on newly registered .top and .xyz TLDs.' },
    { type: 'INFO', text: 'COMMUNITY NOTIFICATION: BESCOM & Mahavitaran power disconnection SMS scam reported in 12 districts.' },
    { type: 'EMERGENCY', text: 'OFFICIAL HELPLINE: Dial 1930 immediately if you have suffered financial cyber fraud within the golden hour.' }
  ];

  return (
    <div className="w-full bg-slate-950/90 border-y border-cyan-500/20 py-2.5 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-mono shrink-0">
          <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
          <span className="font-bold">LIVE TELEMETRY</span>
        </div>

        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-flex space-x-8 animate-marquee">
            {alerts.concat(alerts).map((item, index) => (
              <div key={index} className="inline-flex items-center space-x-2 text-xs font-mono text-slate-300">
                {item.type === 'CRITICAL' || item.type === 'EMERGENCY' ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span>{item.text}</span>
                <span className="text-cyan-500/40 mx-2">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
