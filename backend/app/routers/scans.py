from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import ScanRecord
from app.schemas.schemas import ScanHistoryItem

router = APIRouter(prefix="/api/scans", tags=["Scan History"])

@router.get("/history", response_model=List[ScanHistoryItem])
def get_scan_history(
    scan_type: Optional[str] = Query(None, description="Filter by scan type ('url' or 'message')"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(ScanRecord)
    if scan_type:
        query = query.filter(ScanRecord.scan_type == scan_type.lower())
    if risk_level:
        query = query.filter(ScanRecord.risk_level == risk_level.upper())

    records = query.order_by(ScanRecord.created_at.desc()).limit(limit).all()
    return records
