from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# URL Schemas
class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., max_length=2048, description="Target URL to inspect")

class UrlStageItem(BaseModel):
    name: str
    status: str
    detail: str

class UrlEvidenceItem(BaseModel):
    title: str
    severity: str
    score_impact: int
    description: str
    recommendation: str

class UrlAnalysisResponse(BaseModel):
    valid: bool
    scan_id: Optional[str] = None
    input_url: str
    normalized_url: Optional[str] = None
    scheme: Optional[str] = None
    hostname: Optional[str] = None
    apex_domain: Optional[str] = None
    tld: Optional[str] = None
    path: Optional[str] = None
    query: Optional[str] = None
    port: Optional[int] = None
    is_ip_host: bool = False
    is_shortener: bool = False
    entropy: float = 0.0
    detected_brand: Optional[str] = None
    has_homoglyphs: bool = False
    risk_score: int
    risk_level: str
    confidence: float
    findings: List[str]
    evidence: List[UrlEvidenceItem]
    stages: List[UrlStageItem]
    safety_notes: List[str]
    error: Optional[str] = None

# Message Schemas
class MessageAnalysisRequest(BaseModel):
    content: str = Field(..., max_length=50000, description="SMS, WhatsApp, or Email message content")
    message_type: str = Field(default="SMS", description="SMS, WhatsApp, Email, or WebChat")
    language: str = Field(default="AUTO", description="AUTO, ENGLISH, HINDI, KANNADA")

class MessageHighlightItem(BaseModel):
    start: int
    end: int
    matched_text: str
    rule_id: str
    category: str
    severity: str

class MessageEvidenceCard(BaseModel):
    rule_id: str
    category: str
    severity: str
    score: int
    what_detected: str
    why_suspicious: str
    what_to_verify: str
    action_to_take: str

class MessageAnalysisResponse(BaseModel):
    valid: bool
    scan_id: Optional[str] = None
    message_type: str
    detected_language: str
    analyzed_language: str
    char_count: int
    risk_score: int
    risk_level: str
    confidence: float
    categories: List[str]
    triggered_rules_count: int
    evidence_cards: List[MessageEvidenceCard]
    highlights: List[MessageHighlightItem]
    summary: str
    error: Optional[str] = None

# Scan History Schemas
class ScanHistoryItem(BaseModel):
    id: str
    scan_type: str
    input_target: str
    risk_score: int
    risk_level: str
    confidence: float
    category: str
    created_at: datetime

    class Config:
        from_attributes = True

# Threat Explorer Schemas
class ThreatIndicatorItem(BaseModel):
    id: str
    indicator_value: str
    indicator_type: str
    scam_category: str
    risk_level: str
    first_seen: datetime
    last_seen: datetime
    reported_count: int
    verified: bool
    source: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

# Community Report Schemas
class CommunityReportCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    scam_category: str
    indicator: Optional[str] = None
    content: str = Field(..., min_length=10, max_length=5000)
    evidence_notes: Optional[str] = None

class CommunityReportItem(BaseModel):
    id: str
    title: str
    scam_category: str
    indicator: Optional[str] = None
    raw_content_redacted: str
    evidence_notes: Optional[str] = None
    status: str
    upvotes: int
    flags: int
    created_at: datetime

    class Config:
        from_attributes = True

# Investigation Schemas
class InvestigationCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    priority: str = "MEDIUM"
    tags: str = "Phishing,India"

class InvestigationEvidenceItem(BaseModel):
    id: str
    file_name: str
    sha256_hash: str
    file_size: int
    mime_type: str
    description: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True

class InvestigationItem(BaseModel):
    id: str
    case_number: str
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    assigned_analyst: str
    tags: str
    notes_json: str
    timeline_json: str
    created_at: datetime
    updated_at: datetime
    evidence_items: List[InvestigationEvidenceItem] = []

    class Config:
        from_attributes = True

# Dashboard Analytics
class DashboardAnalyticsResponse(BaseModel):
    total_analyses: int
    high_risk_findings: int
    critical_findings: int
    threat_categories_count: int
    active_investigations: int
    community_reports_count: int
    risk_distribution: Dict[str, int]
    category_distribution: List[Dict[str, Any]]
    activity_timeline: List[Dict[str, Any]]
    detection_engine_status: str
    rules_version: str
    demonstration_data_notice: str
