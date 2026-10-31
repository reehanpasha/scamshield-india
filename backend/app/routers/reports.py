import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import CommunityReport, AuditLog
from app.schemas.schemas import CommunityReportCreate, CommunityReportItem

router = APIRouter(prefix="/api/reports", tags=["Community Reports"])

def sanitize_and_redact_pii(text: str) -> str:
    """
    Redacts phone numbers, 16-digit card numbers, 12-digit Aadhaar numbers,
    and OTP strings to protect citizen privacy.
    """
    if not text:
        return ""
    # Redact 16-digit credit/debit card numbers
    text = re.sub(r'\b(?:\d{4}[-\s]?){3}\d{4}\b', '[REDACTED_CARD_NUMBER]', text)
    # Redact 12-digit Aadhaar numbers
    text = re.sub(r'\b\d{4}\s\d{4}\s\d{4}\b', '[REDACTED_AADHAAR]', text)
    # Redact 10-digit Indian phone numbers
    text = re.sub(r'(\+91[\-\s]?)?[6-9]\d{9}', '[REDACTED_PHONE_NUMBER]', text)
    # Redact 4 or 6 digit OTP references
    text = re.sub(r'(otp|pin|code)\s*[:=]?\s*\d{4,6}', r'\1 [REDACTED_OTP]', text, flags=re.IGNORECASE)
    return text

@router.get("", response_model=List[CommunityReportItem])
def list_community_reports(
    status: Optional[str] = Query(None, description="Filter by status: PENDING, VERIFIED, REJECTED"),
    category: Optional[str] = Query(None, description="Filter by scam category"),
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(CommunityReport)
    if status:
        query = query.filter(CommunityReport.status == status.upper())
    if category:
        query = query.filter(CommunityReport.scam_category == category)

    return query.order_by(CommunityReport.created_at.desc()).limit(limit).all()

@router.post("", response_model=CommunityReportItem)
def submit_community_report(payload: CommunityReportCreate, db: Session = Depends(get_db)):
    # Redact sensitive PII before persistence
    redacted_content = sanitize_and_redact_pii(payload.content)
    redacted_indicator = sanitize_and_redact_pii(payload.indicator or "")

    # Duplicate check on indicator and title
    existing = db.query(CommunityReport).filter(
        CommunityReport.title.ilike(payload.title.strip())
    ).first()

    if existing:
        # Increase upvote count instead of creating noisy duplicate
        existing.upvotes += 1
        db.commit()
        db.refresh(existing)
        return existing

    report = CommunityReport(
        title=payload.title.strip(),
        scam_category=payload.scam_category,
        indicator=redacted_indicator,
        raw_content_redacted=redacted_content,
        evidence_notes=payload.evidence_notes,
        status="PENDING",
        upvotes=1,
        flags=0
    )
    db.add(report)

    audit = AuditLog(
        action="REPORT_SUBMITTED",
        target_type="REPORT",
        target_id=report.id,
        actor="Citizen Reporter",
        details=f"Submitted scam report in category {payload.scam_category}"
    )
    db.add(audit)
    db.commit()
    db.refresh(report)
    return report

@router.post("/{report_id}/upvote", response_model=CommunityReportItem)
def upvote_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(CommunityReport).filter(CommunityReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.upvotes += 1
    # Automatically verify if trusted by community threshold
    if report.upvotes >= 10 and report.flags == 0:
        report.status = "VERIFIED"

    db.commit()
    db.refresh(report)
    return report

@router.post("/{report_id}/flag", response_model=CommunityReportItem)
def flag_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(CommunityReport).filter(CommunityReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.flags += 1
    if report.flags >= 5:
        report.status = "REJECTED"

    db.commit()
    db.refresh(report)
    return report
