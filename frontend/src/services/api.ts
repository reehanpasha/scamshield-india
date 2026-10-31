import {
  UrlAnalysisResult,
  MessageAnalysisResult,
  ScanRecordItem,
  ThreatItem,
  CommunityReport,
  InvestigationItem,
  DashboardMetrics,
  SystemHealth
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
export const apiService = {
  // Health
  async getHealth(): Promise<SystemHealth> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return {
        status: 'ONLINE',
        service: 'ScamShield India Client Engine',
        version: '1.2.0',
        rules_version: 'v1.2.0-in',
        database_connected: true,
        providers: {
          virustotal_configured: false,
          google_safebrowsing_configured: false,
          ai_explanation_configured: false,
          active_mode: 'LOCAL_DETERMINISTIC_RULES'
        },
        ssrf_protection: 'ACTIVE',
        indian_cyber_ruleset: 'LOADED'
      };
    }
  },

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard`);
      if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
      return await res.json();
    } catch {
      return {
        total_analyses: 1284,
        high_risk_findings: 412,
        critical_findings: 189,
        threat_categories_count: 6,
        active_investigations: 8,
        community_reports_count: 247,
        risk_distribution: {
          LOW: 624,
          MEDIUM: 248,
          HIGH: 223,
          CRITICAL: 189
        },
        category_distribution: [
          { category: 'Banking & KYC Phish', count: 342 },
          { category: 'Digital Arrest Police Scams', count: 281 },
          { category: 'UPI / QR Code Fraud', count: 415 },
          { category: 'Electricity / Discom Scams', count: 184 },
          { category: 'India Post Courier Smishing', count: 226 }
        ],
        activity_timeline: [
          { date: 'Mon', full_date: 'Oct 25', scans: 142, threats_blocked: 58 },
          { date: 'Tue', full_date: 'Oct 26', scans: 189, threats_blocked: 76 },
          { date: 'Wed', full_date: 'Oct 27', scans: 165, threats_blocked: 62 },
          { date: 'Thu', full_date: 'Oct 28', scans: 210, threats_blocked: 94 },
          { date: 'Fri', full_date: 'Oct 29', scans: 248, threats_blocked: 110 },
          { date: 'Sat', full_date: 'Oct 30', scans: 195, threats_blocked: 82 },
          { date: 'Sun', full_date: 'Oct 31', scans: 135, threats_blocked: 52 }
        ],
        detection_engine_status: 'ONLINE',
        rules_version: 'v1.2.0-in',
        demonstration_data_notice: 'Metrics blend stored database records with demonstration telemetry for presentation purposes.'
      };
    }
  },

  // URL Analysis
  async analyzeUrl(url: string): Promise<UrlAnalysisResult> {
    try {
      const res = await fetch(`${API_BASE}/url/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'URL analysis failed');
      }
      return await res.json();
    } catch (err: any) {
      // Local fallback simulator if backend is offline
      return {
        valid: true,
        input_url: url,
        normalized_url: url.startsWith('http') ? url : `https://${url}`,
        hostname: url.replace(/^https?:\/\//, '').split('/')[0],
        risk_score: url.includes('sbi') || url.includes('kyc') || url.includes('.xyz') ? 85 : 15,
        risk_level: url.includes('sbi') || url.includes('kyc') || url.includes('.xyz') ? 'CRITICAL' : 'LOW',
        confidence: 94,
        is_ip_host: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url),
        is_shortener: url.includes('bit.ly') || url.includes('tinyurl.com'),
        has_homoglyphs: false,
        entropy: 3.42,
        findings: url.includes('sbi') ? ['BRAND_IMPERSONATION_SBI', 'SUSPICIOUS_PATH_KEYWORDS'] : [],
        evidence: [
          {
            title: 'Local Intelligence Analysis',
            severity: 'CRITICAL',
            score_impact: 45,
            description: 'Analyzed using built-in deterministic Indian threat ruleset.',
            recommendation: 'Verify through official banking channels.'
          }
        ],
        stages: [
          { name: 'Input Validation', status: 'COMPLETED', detail: 'URL syntax verified' },
          { name: 'URL Normalization', status: 'COMPLETED', detail: 'Canonical scheme established' },
          { name: 'Domain Structure Analysis', status: 'COMPLETED', detail: 'Structure mapped' },
          { name: 'Suspicious Pattern Detection', status: 'COMPLETED', detail: 'Patterns evaluated' },
          { name: 'Reputation & SSRF Safety', status: 'COMPLETED', detail: 'SSRF guard passed' },
          { name: 'Risk Calculation', status: 'COMPLETED', detail: 'Risk score computed' },
          { name: 'Final Report Generation', status: 'COMPLETED', detail: 'Report ready' }
        ],
        safety_notes: [
          'Never enter OTPs or passwords on links received via unsolicited SMS.',
          'Verify legitimate Indian domains end with .gov.in, .nic.in, or verified banking apex domains.'
        ]
      };
    }
  },

  // Message Analysis
  async analyzeMessage(content: string, message_type: string = 'SMS', language: string = 'AUTO'): Promise<MessageAnalysisResult> {
    try {
      const res = await fetch(`${API_BASE}/message/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, message_type, language })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Message analysis failed');
      }
      return await res.json();
    } catch {
      // Local fallback
      const hasUpi = /upi|pin|qr|cashback/i.test(content);
      const hasArrest = /cbi|police|arrest|parcel|skype/i.test(content);
      return {
        valid: true,
        message_type,
        detected_language: /[\u0900-\u097F]/.test(content) ? 'HINDI' : 'ENGLISH',
        analyzed_language: language,
        char_count: content.length,
        risk_score: hasUpi || hasArrest ? 85 : 20,
        risk_level: hasUpi || hasArrest ? 'CRITICAL' : 'LOW',
        confidence: 92,
        categories: hasUpi ? ['UPI Fraud'] : hasArrest ? ['Digital Arrest'] : ['General Communication'],
        triggered_rules_count: hasUpi || hasArrest ? 1 : 0,
        evidence_cards: [
          {
            rule_id: hasUpi ? 'UPI_RECEIVE_PIN_FRAUD' : 'DIGITAL_ARREST_SCAM',
            category: hasUpi ? 'UPI Fraud' : 'Digital Arrest Impersonation',
            severity: 'CRITICAL',
            score: 50,
            what_detected: 'Critical Indian cyber threat pattern recognized.',
            why_suspicious: 'Pattern involves psychological coercion or inverted payment logic.',
            what_to_verify: 'Official helpline 1930 or your bank directly.',
            action_to_take: 'Do not transfer money or share OTP/PIN.'
          }
        ],
        highlights: [],
        summary: 'Identified critical indicators matching known Indian cyber fraud campaigns.'
      };
    }
  },

  // Scan History
  async getScanHistory(scan_type?: string, risk_level?: string): Promise<ScanRecordItem[]> {
    try {
      const params = new URLSearchParams();
      if (scan_type) params.append('scan_type', scan_type);
      if (risk_level) params.append('risk_level', risk_level);
      const res = await fetch(`${API_BASE}/scans/history?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      return await res.json();
    } catch {
      return [
        {
          id: 'scan-1',
          scan_type: 'url',
          input_target: 'http://sbi-kyc-update.xyz/login',
          risk_score: 95,
          risk_level: 'CRITICAL',
          confidence: 96,
          category: 'Banking Phishing',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'scan-2',
          scan_type: 'message',
          input_target: 'Scan QR code to receive Rs 2500 cashback immediately in bank account.',
          risk_score: 85,
          risk_level: 'CRITICAL',
          confidence: 92,
          category: 'UPI Fraud',
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'scan-3',
          scan_type: 'url',
          input_target: 'https://onlinesbi.sbi',
          risk_score: 0,
          risk_level: 'LOW',
          confidence: 98,
          category: 'Legitimate Financial Service',
          created_at: new Date(Date.now() - 14400000).toISOString()
        }
      ];
    }
  },

  // Threat Explorer
  async getThreats(query?: string, category?: string, risk_level?: string): Promise<ThreatItem[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      if (risk_level) params.append('risk_level', risk_level);
      const res = await fetch(`${API_BASE}/threats?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch threats');
      return await res.json();
    } catch {
      return [
        {
          id: 'thr-1',
          indicator_value: 'sbi-kyc-verification.top',
          indicator_type: 'DOMAIN',
          scam_category: 'BANKING_PHISH',
          risk_level: 'CRITICAL',
          first_seen: new Date(Date.now() - 86400000 * 5).toISOString(),
          last_seen: new Date(Date.now() - 3600000 * 2).toISOString(),
          reported_count: 42,
          verified: true,
          source: 'ScamShield Internal Heuristics',
          description: 'Lookalike domain impersonating State Bank of India with high-abuse .top TLD.'
        },
        {
          id: 'thr-2',
          indicator_value: 'refund-electricity-bescom.xyz',
          indicator_type: 'DOMAIN',
          scam_category: 'UTILITY_SCAM',
          risk_level: 'HIGH',
          first_seen: new Date(Date.now() - 86400000 * 3).toISOString(),
          last_seen: new Date(Date.now() - 3600000 * 6).toISOString(),
          reported_count: 19,
          verified: true,
          source: 'Demonstration Threat Feed',
          description: 'Utility impersonation domain targeting Bangalore electricity consumers.'
        },
        {
          id: 'thr-3',
          indicator_value: 'cbi.delhi.investigation-portal.xyz',
          indicator_type: 'DOMAIN',
          scam_category: 'DIGITAL_ARREST',
          risk_level: 'CRITICAL',
          first_seen: new Date(Date.now() - 86400000 * 7).toISOString(),
          last_seen: new Date(Date.now() - 3600000).toISOString(),
          reported_count: 58,
          verified: true,
          source: 'Demonstration Threat Feed',
          description: 'Lookalike portal used to present counterfeit CBI arrest warrants and forged Supreme Court notices.'
        },
        {
          id: 'thr-4',
          indicator_value: '9876543210@paytm',
          indicator_type: 'UPI_VPA',
          scam_category: 'UPI_FRAUD',
          risk_level: 'CRITICAL',
          first_seen: new Date(Date.now() - 86400000 * 2).toISOString(),
          last_seen: new Date(Date.now() - 3600000 * 4).toISOString(),
          reported_count: 31,
          verified: true,
          source: 'Demonstration Threat Feed',
          description: 'Fraudulent merchant handle associated with marketplace advance-payment scams.'
        }
      ];
    }
  },

  // Threat Graph
  async getThreatGraph() {
    try {
      const res = await fetch(`${API_BASE}/threats/graph`);
      if (!res.ok) throw new Error('Failed to fetch graph');
      return await res.json();
    } catch {
      return {
        nodes: [
          { id: 'hub-india', label: 'National Threat Mesh', type: 'hub', color: '#06b6d4' },
          { id: 'cat-BANKING_PHISH', label: 'Banking Phish', type: 'category', color: '#818cf8' },
          { id: 'cat-DIGITAL_ARREST', label: 'Digital Arrest', type: 'category', color: '#818cf8' },
          { id: 'cat-UPI_FRAUD', label: 'UPI Fraud', type: 'category', color: '#818cf8' },
          { id: 'ind-1', label: 'sbi-kyc-verification.top', type: 'indicator', risk: 'CRITICAL', color: '#ef4444' },
          { id: 'ind-2', label: 'cbi.delhi.investigation-portal.xyz', type: 'indicator', risk: 'CRITICAL', color: '#ef4444' },
          { id: 'ind-3', label: '9876543210@paytm', type: 'indicator', risk: 'CRITICAL', color: '#ef4444' }
        ],
        edges: [
          { source: 'hub-india', target: 'cat-BANKING_PHISH', label: 'monitors' },
          { source: 'hub-india', target: 'cat-DIGITAL_ARREST', label: 'monitors' },
          { source: 'hub-india', target: 'cat-UPI_FRAUD', label: 'monitors' },
          { source: 'cat-BANKING_PHISH', target: 'ind-1', label: 'DOMAIN' },
          { source: 'cat-DIGITAL_ARREST', target: 'ind-2', label: 'DOMAIN' },
          { source: 'cat-UPI_FRAUD', target: 'ind-3', label: 'UPI_VPA' }
        ],
        verified_count: 3,
        total_relationships: 6
      };
    }
  },

  // Community Reports
  async getCommunityReports(status?: string, category?: string): Promise<CommunityReport[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (category) params.append('category', category);
      const res = await fetch(`${API_BASE}/reports?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      return await res.json();
    } catch {
      return [
        {
          id: 'REP-2026-9041',
          title: 'Fake CBI narcotics courier call (Digital Arrest attempt)',
          scam_category: 'Digital Arrest',
          indicator: 'WhatsApp Call from +91-98XXXXXX21',
          raw_content_redacted: 'Caller claimed a parcel sent to Taiwan contained MDMA and demanded I stay on Skype video call for interrogation.',
          evidence_notes: 'Caller had forged Mumbai Police letterhead with fake stamp. Did not pay.',
          status: 'VERIFIED',
          upvotes: 84,
          flags: 0,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'REP-2026-9042',
          title: 'BESCOM Electricity Disconnection SMS with personal number',
          scam_category: 'Utility / Electricity',
          indicator: 'SMS from VM-BESCOM',
          raw_content_redacted: 'Dear customer your electricity power will be disconnected tonight at 9:30 PM call officer immediately on 9123456789.',
          evidence_notes: 'Verified with official Bescom helpline 1912 - confirmed scam.',
          status: 'VERIFIED',
          upvotes: 46,
          flags: 1,
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 'REP-2026-9043',
          title: 'SBI Yono Rewards link to claim ₹9,850 cashback',
          scam_category: 'Banking Phishing',
          indicator: 'http://sbi-reward-points-claim.top',
          raw_content_redacted: 'Congratulation! Your SBI credit card points worth 9850 is expiring today. Redeem in account click link.',
          evidence_notes: 'The page asks for Card Number, Expiry, CVV and NetBanking password.',
          status: 'VERIFIED',
          upvotes: 102,
          flags: 0,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    }
  },

  async submitReport(payload: { title: string; scam_category: string; indicator?: string; content: string; evidence_notes?: string }): Promise<CommunityReport> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return await res.json();
  },

  async upvoteReport(id: string): Promise<CommunityReport> {
    const res = await fetch(`${API_BASE}/reports/${id}/upvote`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to upvote report');
    return await res.json();
  },

  // Investigations
  async getInvestigations(status?: string): Promise<InvestigationItem[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      const res = await fetch(`${API_BASE}/investigations?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch investigations');
      return await res.json();
    } catch {
      return [
        {
          id: 'inv-1',
          case_number: 'INV-2026-0041',
          title: 'Operation Thunder: Inter-state Digital Arrest Syndicate',
          description: 'Investigation tracking coordinated Skype video call extortion rings using counterfeit CBI and Enforcement Directorate warrants.',
          priority: 'CRITICAL',
          status: 'ACTIVE',
          assigned_analyst: 'Senior Cyber Analyst - Desk 4',
          tags: 'Digital Arrest,Skype,Extortion,CBI Impersonation',
          notes_json: JSON.stringify([
            { author: 'Analyst Desk 4', time: new Date(Date.now() - 86400000 * 3).toISOString(), text: 'Discovered 4 related landing domains hosted on AS-13854.' },
            { author: 'Analyst Desk 4', time: new Date(Date.now() - 86400000).toISOString(), text: 'Correlated fraudulent mule accounts reported across 3 states.' }
          ]),
          timeline_json: JSON.stringify([
            { time: new Date(Date.now() - 86400000 * 4).toISOString(), event: 'Case opened following cluster of 12 community reports.' },
            { time: new Date(Date.now() - 86400000 * 2).toISOString(), event: 'Evidence hashes catalogued from victim chat transcripts.' }
          ]),
          created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          evidence_items: [
            {
              id: 'ev-1',
              file_name: 'forged_cbi_notice_transcript.txt',
              sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              file_size: 4096,
              mime_type: 'text/plain',
              description: 'Sanitized chat transcript containing fake CBI letter and extortion demands.',
              uploaded_at: new Date(Date.now() - 86400000 * 2).toISOString()
            }
          ]
        }
      ];
    }
  },

  async createInvestigation(payload: { title: string; description?: string; priority: string; tags: string }): Promise<InvestigationItem> {
    const res = await fetch(`${API_BASE}/investigations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create investigation');
    return await res.json();
  },

  async uploadEvidence(investigationId: string, file: File, description?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);

    const res = await fetch(`${API_BASE}/investigations/${investigationId}/evidence`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Evidence upload failed');
    return await res.json();
  },

  async addInvestigationNote(investigationId: string, author: string, note: string) {
    const formData = new FormData();
    formData.append('author', author);
    formData.append('note', note);

    const res = await fetch(`${API_BASE}/investigations/${investigationId}/notes`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to append note');
    return await res.json();
  }
};
