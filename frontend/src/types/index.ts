export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface UrlStage {
  name: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  detail: string;
}

export interface UrlEvidence {
  title: string;
  severity: RiskLevel;
  score_impact: number;
  description: string;
  recommendation: string;
}

export interface UrlAnalysisResult {
  valid: boolean;
  scan_id?: string;
  input_url: string;
  normalized_url?: string;
  scheme?: string;
  hostname?: string;
  apex_domain?: string;
  tld?: string;
  path?: string;
  query?: string;
  port?: number;
  is_ip_host: boolean;
  is_shortener: boolean;
  entropy: number;
  detected_brand?: string;
  has_homoglyphs: boolean;
  risk_score: number;
  risk_level: RiskLevel;
  confidence: number;
  findings: string[];
  evidence: UrlEvidence[];
  stages: UrlStage[];
  safety_notes: string[];
  error?: string;
}

export interface MessageHighlight {
  start: number;
  end: number;
  matched_text: string;
  rule_id: string;
  category: string;
  severity: RiskLevel;
}

export interface MessageEvidenceCard {
  rule_id: string;
  category: string;
  severity: RiskLevel;
  score: number;
  what_detected: string;
  why_suspicious: string;
  what_to_verify: string;
  action_to_take: string;
}

export interface MessageAnalysisResult {
  valid: boolean;
  scan_id?: string;
  message_type: string;
  detected_language: string;
  analyzed_language: string;
  char_count: number;
  risk_score: number;
  risk_level: RiskLevel;
  confidence: number;
  categories: string[];
  triggered_rules_count: number;
  evidence_cards: MessageEvidenceCard[];
  highlights: MessageHighlight[];
  summary: string;
  error?: string;
}

export interface ScanRecordItem {
  id: string;
  scan_type: 'url' | 'message';
  input_target: string;
  risk_score: number;
  risk_level: RiskLevel;
  confidence: number;
  category: string;
  created_at: string;
}

export interface ThreatItem {
  id: string;
  indicator_value: string;
  indicator_type: 'DOMAIN' | 'UPI_VPA' | 'PHONE' | 'URL_PATH' | 'IP';
  scam_category: string;
  risk_level: RiskLevel;
  first_seen: string;
  last_seen: string;
  reported_count: number;
  verified: boolean;
  source: string;
  description?: string;
}

export interface CommunityReport {
  id: string;
  title: string;
  scam_category: string;
  indicator?: string;
  raw_content_redacted: string;
  evidence_notes?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  upvotes: number;
  flags: number;
  created_at: string;
}

export interface InvestigationEvidence {
  id: string;
  file_name: string;
  sha256_hash: string;
  file_size: number;
  mime_type: string;
  description?: string;
  uploaded_at: string;
}

export interface InvestigationItem {
  id: string;
  case_number: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';
  assigned_analyst: string;
  tags: string;
  notes_json: string;
  timeline_json: string;
  created_at: string;
  updated_at: string;
  evidence_items?: InvestigationEvidence[];
}

export interface DashboardMetrics {
  total_analyses: number;
  high_risk_findings: number;
  critical_findings: number;
  threat_categories_count: number;
  active_investigations: number;
  community_reports_count: number;
  risk_distribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  category_distribution: Array<{ category: string; count: number }>;
  activity_timeline: Array<{ date: string; full_date: string; scans: number; threats_blocked: number }>;
  detection_engine_status: string;
  rules_version: string;
  demonstration_data_notice: string;
}

export interface SystemHealth {
  status: string;
  service: string;
  version: string;
  rules_version: string;
  database_connected: boolean;
  providers: {
    virustotal_configured: boolean;
    google_safebrowsing_configured: boolean;
    ai_explanation_configured: boolean;
    active_mode: string;
  };
  ssrf_protection: string;
  indian_cyber_ruleset: string;
}
