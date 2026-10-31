import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    scan_type = Column(String(32), nullable=False) # 'url' or 'message'
    input_target = Column(Text, nullable=False)
    risk_score = Column(Integer, nullable=False) # 0 to 100
    risk_level = Column(String(16), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    confidence = Column(Float, nullable=False, default=85.0)
    category = Column(String(64), nullable=False)
    details_json = Column(Text, nullable=False) # JSON payload with evidence & indicators
    created_at = Column(DateTime, default=datetime.utcnow)

class ThreatIndicator(Base):
    __tablename__ = "threat_indicators"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    indicator_value = Column(String(255), nullable=False, index=True)
    indicator_type = Column(String(32), nullable=False) # DOMAIN, UPI_VPA, PHONE, URL_PATH, IP
    scam_category = Column(String(64), nullable=False) # BANKING_PHISH, DIGITAL_ARREST, UPI_REFUND, etc.
    risk_level = Column(String(16), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)
    reported_count = Column(Integer, default=1)
    verified = Column(Boolean, default=False)
    source = Column(String(64), default="ScamShield Internal")
    description = Column(Text, nullable=True)

class CommunityReport(Base):
    __tablename__ = "community_reports"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    scam_category = Column(String(64), nullable=False)
    indicator = Column(String(255), nullable=True)
    raw_content_redacted = Column(Text, nullable=False)
    evidence_notes = Column(Text, nullable=True)
    status = Column(String(32), default="PENDING") # PENDING, VERIFIED, REJECTED
    upvotes = Column(Integer, default=0)
    flags = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    case_number = Column(String(32), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(16), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(32), default="ACTIVE") # ACTIVE, UNDER_REVIEW, RESOLVED, CLOSED
    assigned_analyst = Column(String(128), default="Cyber Intelligence Analyst")
    tags = Column(String(255), default="Phishing,India")
    notes_json = Column(Text, default="[]")
    timeline_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    evidence_items = relationship("InvestigationEvidence", back_populates="investigation", cascade="all, delete-orphan")

class InvestigationEvidence(Base):
    __tablename__ = "investigation_evidence"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    sha256_hash = Column(String(64), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(64), default="text/plain")
    description = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    investigation = relationship("Investigation", back_populates="evidence_items")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    action = Column(String(64), nullable=False)
    target_type = Column(String(64), nullable=False)
    target_id = Column(String(64), nullable=True)
    actor = Column(String(128), default="System")
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
