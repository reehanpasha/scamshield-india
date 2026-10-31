import hashlib
import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Investigation, InvestigationEvidence, AuditLog
from app.schemas.schemas import InvestigationCreate, InvestigationItem

router = APIRouter(prefix="/api/investigations", tags=["Investigation Workspace"])

@router.get("", response_model=List[InvestigationItem])
def list_investigations(
    status: Optional[str] = Query(None, description="Filter by status: ACTIVE, UNDER_REVIEW, RESOLVED, CLOSED"),
    db: Session = Depends(get_db)
):
    query = db.query(Investigation)
    if status:
        query = query.filter(Investigation.status == status.upper())
    return query.order_by(Investigation.updated_at.desc()).all()

@router.post("", response_model=InvestigationItem)
def create_investigation(payload: InvestigationCreate, db: Session = Depends(get_db)):
    count = db.query(Investigation).count() + 1
    case_num = f"INV-2026-{count:04d}"

    now = datetime.utcnow()
    initial_timeline = [
        {"time": now.isoformat(), "event": f"Case created with priority {payload.priority}"}
    ]
    initial_notes = [
        {"author": "Security Lead", "time": now.isoformat(), "text": f"Initiated docket: {payload.title}"}
    ]

    inv = Investigation(
        case_number=case_num,
        title=payload.title,
        description=payload.description or "",
        priority=payload.priority.upper(),
        status="ACTIVE",
        assigned_analyst="Cyber Threat Intelligence Desk",
        tags=payload.tags,
        notes_json=json.dumps(initial_notes),
        timeline_json=json.dumps(initial_timeline)
    )
    db.add(inv)

    audit = AuditLog(
        action="INVESTIGATION_CREATED",
        target_type="CASE",
        target_id=case_num,
        actor="Investigator",
        details=f"Opened case {case_num}: {payload.title}"
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)
    return inv

@router.get("/{investigation_id}", response_model=InvestigationItem)
def get_investigation_details(investigation_id: str, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        # Check case_number as fallback
        inv = db.query(Investigation).filter(Investigation.case_number == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation case not found")
    return inv

@router.post("/{investigation_id}/evidence")
async def upload_investigation_evidence(
    investigation_id: str,
    file: UploadFile = File(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024: # 10MB limit
        raise HTTPException(status_code=400, detail="Evidence file exceeds 10MB limit")

    # Cryptographic SHA-256 Hash Generation
    sha256_hash = hashlib.sha256(content).hexdigest()

    evidence = InvestigationEvidence(
        investigation_id=inv.id,
        file_name=file.filename or "evidence.txt",
        sha256_hash=sha256_hash,
        file_size=len(content),
        mime_type=file.content_type or "application/octet-stream",
        description=description or f"Uploaded evidence file for {inv.case_number}"
    )
    db.add(evidence)

    # Append timeline entry
    now = datetime.utcnow()
    timeline = json.loads(inv.timeline_json or "[]")
    timeline.append({
        "time": now.isoformat(),
        "event": f"Evidence '{file.filename}' attached with SHA-256 integrity hash {sha256_hash[:16]}..."
    })
    inv.timeline_json = json.dumps(timeline)
    inv.updated_at = now

    audit = AuditLog(
        action="EVIDENCE_ATTACHED",
        target_type="CASE_EVIDENCE",
        target_id=evidence.id,
        actor="Investigator",
        details=f"Attached evidence {file.filename} (Hash: {sha256_hash})"
    )
    db.add(audit)
    db.commit()
    db.refresh(evidence)

    return {
        "status": "SUCCESS",
        "evidence_id": evidence.id,
        "file_name": evidence.file_name,
        "sha256_hash": sha256_hash,
        "file_size": evidence.file_size,
        "integrity_notice": "Cryptographic SHA-256 digest computed to detect post-collection tampering. Note that hashing preserves file integrity but does not independently establish origin authenticity."
    }

@router.post("/{investigation_id}/notes")
def add_investigation_note(
    investigation_id: str,
    author: str = Form("Senior Analyst"),
    note: str = Form(...),
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    now = datetime.utcnow()
    notes = json.loads(inv.notes_json or "[]")
    notes.append({
        "author": author,
        "time": now.isoformat(),
        "text": note
    })
    inv.notes_json = json.dumps(notes)

    timeline = json.loads(inv.timeline_json or "[]")
    timeline.append({
        "time": now.isoformat(),
        "event": f"Analyst note added by {author}"
    })
    inv.timeline_json = json.dumps(timeline)
    inv.updated_at = now

    db.commit()
    db.refresh(inv)
    return {"status": "SUCCESS", "notes_count": len(notes)}
